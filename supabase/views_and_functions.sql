-- ============================================================
-- SITEL AI — VIEWS & FUNCTIONS
-- Run AFTER schema.sql
-- ============================================================

-- ============================================================
-- VIEW: PIPELINE SUMMARY (founder dashboard)
-- ============================================================

create or replace view v_pipeline_summary as
select
  stage,
  count(*)                                      as deal_count,
  sum(monthly_fee)                              as total_monthly_value,
  sum(setup_fee)                                as total_setup_value,
  sum(monthly_fee * 12)                         as total_arr,
  avg(probability)                              as avg_probability,
  sum(monthly_fee * probability / 100.0)        as weighted_monthly_value
from deals
where stage not in ('closed_lost')
group by stage
order by
  array_position(array[
    'outreach','demo_called','discovery_scheduled',
    'discovery_completed','proposal_sent','negotiation','closed_won'
  ], stage::text);

-- ============================================================
-- VIEW: MRR DASHBOARD
-- ============================================================

create or replace view v_mrr as
select
  date_trunc('month', now())::date              as month,
  count(*) filter (where status = 'active')     as active_clients,
  sum(monthly_fee) filter (where status = 'active') as mrr,
  sum(monthly_fee) filter (where status = 'active') * 12 as arr,
  count(*) filter (where status = 'onboarding') as onboarding_clients,
  count(*) filter (where status = 'churned')    as churned_clients
from clients;

-- ============================================================
-- VIEW: CLIENT CALL STATS (for client dashboard)
-- ============================================================

create or replace view v_client_call_stats as
select
  c.id                                          as client_id,
  c.company_name,
  c.tier,
  c.status,
  count(cl.id)                                  as total_calls_all_time,
  count(cl.id) filter (
    where cl.started_at >= date_trunc('month', now())
  )                                             as calls_this_month,
  round(
    100.0 * count(cl.id) filter (where cl.resolved_by_ai = true)
    / nullif(count(cl.id), 0), 1
  )                                             as ai_deflection_rate_pct,
  round(avg(cl.duration_seconds), 0)            as avg_call_duration_seconds,
  round(avg(cl.sentiment_score)::numeric, 3)    as avg_sentiment,
  count(cl.id) filter (where cl.escalated_to_human = true) as escalations,
  count(cl.id) filter (where cl.abandoned = true)          as abandoned_calls,
  round(avg(cs.score)::numeric, 2)              as avg_csat
from clients c
left join call_logs cl on cl.client_id = c.id
left join csat_surveys cs on cs.client_id = c.id
group by c.id, c.company_name, c.tier, c.status;

-- ============================================================
-- VIEW: DAILY CALL VOLUME (last 30 days per client)
-- ============================================================

create or replace view v_daily_call_volume as
select
  client_id,
  date_trunc('day', started_at)::date           as call_date,
  count(*)                                      as total_calls,
  count(*) filter (where resolved_by_ai)        as ai_resolved,
  count(*) filter (where escalated_to_human)    as escalated,
  count(*) filter (where abandoned)             as abandoned,
  round(avg(sentiment_score)::numeric, 3)       as avg_sentiment,
  round(avg(duration_seconds)::numeric, 0)      as avg_duration_secs
from call_logs
where started_at >= now() - interval '30 days'
group by client_id, date_trunc('day', started_at)::date
order by call_date desc;

-- ============================================================
-- VIEW: TOP CALL INTENTS (last 30 days)
-- ============================================================

create or replace view v_top_intents as
select
  client_id,
  primary_intent,
  count(*)                                      as call_count,
  round(
    100.0 * count(*) / sum(count(*)) over (partition by client_id), 1
  )                                             as pct_of_calls,
  round(avg(sentiment_score)::numeric, 3)       as avg_sentiment,
  count(*) filter (where resolved_by_ai)        as ai_resolved,
  count(*) filter (where escalated_to_human)    as escalated
from call_logs
where started_at >= now() - interval '30 days'
  and primary_intent is not null
group by client_id, primary_intent
order by client_id, call_count desc;

-- ============================================================
-- VIEW: PROSPECT OUTREACH PERFORMANCE
-- ============================================================

create or replace view v_outreach_performance as
select
  channel,
  message_variant,
  count(*)                                        as messages_sent,
  count(*) filter (where replied_at is not null)  as replies,
  round(
    100.0 * count(*) filter (where replied_at is not null)
    / nullif(count(*), 0), 1
  )                                               as reply_rate_pct,
  count(*) filter (where reply_sentiment = 'positive') as positive_replies,
  count(*) filter (where reply_sentiment = 'negative') as negative_replies
from outreach_activities
group by channel, message_variant
order by reply_rate_pct desc;

-- ============================================================
-- VIEW: CHURN RISK RADAR (groundbreaking)
-- Clients showing early churn signals
-- ============================================================

create or replace view v_churn_risk_radar as
select
  c.id                                          as client_id,
  c.company_name,
  c.tier,
  c.monthly_fee,
  -- Signals
  count(ct.id) filter (where ct.churn_risk_detected) as churn_risk_calls_7d,
  round(avg(cl.sentiment_score)::numeric, 3)    as avg_sentiment_7d,
  count(cl.id) filter (where cl.csat_score <= 2) as low_csat_calls_7d,
  count(cl.id) filter (where cl.escalated_to_human) as escalations_7d,
  -- Risk score (0-100)
  least(100, (
    count(ct.id) filter (where ct.churn_risk_detected) * 20 +
    case when coalesce(avg(cl.sentiment_score), 0) < -0.3 then 30 else 0 end +
    count(cl.id) filter (where cl.csat_score <= 2) * 15 +
    case when count(cl.id) = 0 then 25 else 0 end
  ))                                            as churn_risk_score
from clients c
left join call_logs cl on cl.client_id = c.id
  and cl.started_at >= now() - interval '7 days'
left join call_transcripts ct on ct.call_log_id = cl.id
where c.status = 'active'
group by c.id, c.company_name, c.tier, c.monthly_fee
order by churn_risk_score desc;

-- ============================================================
-- VIEW: VOICE OF CUSTOMER WEEKLY DIGEST
-- ============================================================

create or replace view v_voc_weekly as
select
  vt.client_id,
  c.company_name,
  vt.week_start,
  vt.category,
  vt.theme,
  vt.call_count,
  round(
    100.0 * vt.call_count / sum(vt.call_count) over (
      partition by vt.client_id, vt.week_start, vt.category
    ), 1
  ) as pct_of_category
from voc_themes vt
join clients c on c.id = vt.client_id
order by vt.client_id, vt.week_start desc, vt.call_count desc;

-- ============================================================
-- FUNCTION: calculate_deflection_rate
-- ============================================================

create or replace function calculate_deflection_rate(
  p_client_id uuid,
  p_start_date timestamptz default now() - interval '30 days',
  p_end_date   timestamptz default now()
)
returns numeric as $$
declare
  v_total   int;
  v_ai      int;
begin
  select
    count(*),
    count(*) filter (where resolved_by_ai = true)
  into v_total, v_ai
  from call_logs
  where client_id = p_client_id
    and started_at between p_start_date and p_end_date;

  if v_total = 0 then return 0; end if;
  return round((v_ai::numeric / v_total) * 100, 1);
end;
$$ language plpgsql;

-- ============================================================
-- FUNCTION: aggregate_daily_analytics
-- Call this via a Supabase cron job (pg_cron) nightly
-- ============================================================

create or replace function aggregate_daily_analytics(p_date date default current_date - 1)
returns void as $$
begin
  insert into analytics_daily (
    client_id, date,
    total_calls, ai_resolved, human_escalated, abandoned,
    deflection_rate, avg_duration_seconds,
    avg_sentiment_score,
    positive_calls, neutral_calls, negative_calls,
    churn_risk_calls, top_intents
  )
  select
    base.client_id,
    p_date,
    base.total_calls,
    base.ai_resolved,
    base.human_escalated,
    base.abandoned,
    base.deflection_rate,
    base.avg_duration_seconds,
    base.avg_sentiment_score,
    base.positive_calls,
    base.neutral_calls,
    base.negative_calls,
    base.churn_risk_calls,
    coalesce(intents.top_intents, '{}')
  from (
    select
      cl.client_id,
      count(*)                                                    as total_calls,
      count(*) filter (where cl.resolved_by_ai)                  as ai_resolved,
      count(*) filter (where cl.escalated_to_human)              as human_escalated,
      count(*) filter (where cl.abandoned)                       as abandoned,
      round(count(*) filter (where cl.resolved_by_ai)::numeric / nullif(count(*),0), 4) as deflection_rate,
      round(avg(cl.duration_seconds)::numeric, 2)                as avg_duration_seconds,
      round(avg(cl.sentiment_score)::numeric, 3)                 as avg_sentiment_score,
      count(*) filter (where cl.sentiment_label = 'positive')    as positive_calls,
      count(*) filter (where cl.sentiment_label = 'neutral')     as neutral_calls,
      count(*) filter (where cl.sentiment_label = 'negative')    as negative_calls,
      count(ct.id) filter (where ct.churn_risk_detected)         as churn_risk_calls
    from call_logs cl
    left join call_transcripts ct on ct.call_log_id = cl.id
    where date_trunc('day', cl.started_at)::date = p_date
    group by cl.client_id
  ) base
  left join lateral (
    select jsonb_object_agg(primary_intent, intent_count) as top_intents
    from (
      select coalesce(primary_intent, 'unknown') as primary_intent, count(*) as intent_count
      from call_logs
      where date_trunc('day', started_at)::date = p_date
        and client_id = base.client_id
      group by primary_intent
    ) sub
  ) intents on true
  on conflict (client_id, date) do update set
    total_calls           = excluded.total_calls,
    ai_resolved           = excluded.ai_resolved,
    human_escalated       = excluded.human_escalated,
    abandoned             = excluded.abandoned,
    deflection_rate       = excluded.deflection_rate,
    avg_duration_seconds  = excluded.avg_duration_seconds,
    avg_sentiment_score   = excluded.avg_sentiment_score,
    positive_calls        = excluded.positive_calls,
    neutral_calls         = excluded.neutral_calls,
    negative_calls        = excluded.negative_calls,
    churn_risk_calls      = excluded.churn_risk_calls,
    top_intents           = excluded.top_intents;
end;
$$ language plpgsql;

-- ============================================================
-- FUNCTION: get_client_dashboard_data
-- Single function for the client portal — returns everything
-- ============================================================

create or replace function get_client_dashboard_data(p_client_id uuid)
returns jsonb as $$
declare
  v_result jsonb;
begin
  select jsonb_build_object(
    'overview', (
      select row_to_json(s) from v_client_call_stats s where client_id = p_client_id
    ),
    'daily_volume_30d', (
      select jsonb_agg(row_to_json(d) order by d.call_date desc)
      from v_daily_call_volume d where client_id = p_client_id
    ),
    'top_intents', (
      select jsonb_agg(row_to_json(i) order by i.call_count desc)
      from v_top_intents i where client_id = p_client_id
    ),
    'churn_risk', (
      select row_to_json(r) from v_churn_risk_radar r where client_id = p_client_id
    ),
    'recent_alerts', (
      select jsonb_agg(row_to_json(a) order by a.triggered_at desc)
      from alerts a
      where client_id = p_client_id
        and triggered_at >= now() - interval '7 days'
      limit 10
    ),
    'deflection_rate_30d', calculate_deflection_rate(p_client_id)
  ) into v_result;

  return v_result;
end;
$$ language plpgsql security definer;
