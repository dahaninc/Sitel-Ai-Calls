-- ============================================================
-- SITEL AI — SEED DATA
-- Demo data for testing the dashboard
-- Run AFTER schema.sql and views_and_functions.sql
-- ============================================================

-- Sample prospect
insert into prospects (company_name, contact_name, contact_email, contact_linkedin, contact_title,
  website, industry, employee_count, estimated_monthly_calls, estimated_revenue_range,
  trustpilot_url, trustpilot_rating, pain_signals, icp_score, source)
values
  ('Trove London', 'Sarah Mitchell', 'sarah@trovelondon.co.uk',
   'https://linkedin.com/in/sarahmitchell', 'Head of Operations',
   'trovelondon.co.uk', 'ecommerce', 45, 2000, '£3M-£8M',
   'https://uk.trustpilot.com/review/trovelondon.co.uk', 3.2,
   '["trustpilot_complaints","hiring_cs"]', 9, 'linkedin'),

  ('Patch Plants', 'James Okafor', 'james@patchplants.com',
   'https://linkedin.com/in/jamesokafor', 'COO',
   'patchplants.com', 'ecommerce', 62, 3500, '£5M-£12M',
   'https://uk.trustpilot.com/review/patchplants.com', 4.1,
   '["hiring_cs","scaling"]', 8, 'linkedin'),

  ('Spoke London', 'Emma Davies', 'emma@spokelondon.com',
   'https://linkedin.com/in/emmadavies', 'Customer Experience Director',
   'spokelondon.com', 'ecommerce', 38, 1200, '£2M-£5M',
   null, null,
   '["trustpilot_complaints"]', 7, 'cold_email');

-- Sample deal for Trove London
with p as (select id from prospects where company_name = 'Trove London' limit 1)
insert into deals (prospect_id, stage, tier, setup_fee, monthly_fee, estimated_close_date, probability)
select p.id, 'proposal_sent', 'growth', 8000, 3400, current_date + 14, 60
from p;

-- Sample signed client (for dashboard demo)
insert into clients (
  company_name, contact_name, contact_email,
  tier, setup_fee_paid, monthly_fee,
  contract_start_date, status,
  retell_agent_id, twilio_phone_number, crm_type
) values (
  'Demo Client — Aria Home', 'Alex Thompson', 'alex@ariahome.co.uk',
  'growth', 8000, 3400,
  current_date - 45, 'active',
  'agent_demo_001', '+442071234567', 'shopify'
);

-- Sample call logs (last 30 days)
with c as (select id from clients where company_name = 'Demo Client — Aria Home' limit 1)
insert into call_logs (
  client_id, retell_call_id, phone_number_from,
  started_at, ended_at, duration_seconds,
  resolved_by_ai, escalated_to_human, abandoned,
  primary_intent, sentiment_score, sentiment_label,
  caller_authenticated
)
select
  c.id,
  'call_' || generate_series || '_' || extract(epoch from now())::bigint,
  '+4477' || lpad((random() * 99999999)::int::text, 8, '0'),
  now() - (random() * 30)::int * interval '1 day' - (random() * 86400)::int * interval '1 second',
  now() - (random() * 30)::int * interval '1 day' - (random() * 86400)::int * interval '1 second' + ((120 + random() * 300)::int) * interval '1 second',
  (120 + random() * 300)::int,
  random() > 0.35,
  random() < 0.20,
  random() < 0.08,
  (array['order_status','return','refund','complaint','delivery_faq','wrong_item'])[ceil(random()*6)::int],
  round((random() * 2 - 1)::numeric, 3),
  (array['positive','neutral','negative'])[ceil(random()*3)::int],
  random() > 0.1
from generate_series(1, 120), c;

-- Sample revenue events
with c as (select id from clients where company_name = 'Demo Client — Aria Home' limit 1)
insert into revenue_events (client_id, event_type, amount, currency, invoice_date, paid_at)
select c.id, 'setup_fee', 8000, 'GBP', current_date - 45, now() - interval '44 days' from c
union all
select c.id, 'monthly_fee', 3400, 'GBP', current_date - 45, now() - interval '44 days' from c
union all
select c.id, 'monthly_fee', 3400, 'GBP', current_date - 14, now() - interval '13 days' from c;

-- Sample VoC themes
with c as (select id from clients where company_name = 'Demo Client — Aria Home' limit 1)
insert into voc_themes (client_id, week_start, theme, category, call_count)
select c.id, date_trunc('week', now())::date - interval '7 days', 'delivery delays', 'complaint', 18 from c
union all
select c.id, date_trunc('week', now())::date - interval '7 days', 'easy returns process', 'praise', 12 from c
union all
select c.id, date_trunc('week', now())::date - interval '7 days', 'tracking link not working', 'complaint', 9 from c
union all
select c.id, date_trunc('week', now())::date - interval '7 days', 'fast refund', 'praise', 7 from c;

-- Sample alert rule
with c as (select id from clients where company_name = 'Demo Client — Aria Home' limit 1)
insert into alert_rules (client_id, name, metric, operator, threshold, window_minutes, notification_email, is_active)
select c.id, 'High Escalation Rate', 'escalation_rate', 'gt', 0.30, 60, 'alex@ariahome.co.uk', true from c
union all
select c.id, 'Negative Sentiment Spike', 'negative_sentiment_rate', 'gt', 0.40, 120, 'alex@ariahome.co.uk', true from c;

-- Run daily aggregation for demo data
select aggregate_daily_analytics(current_date - 1);
select aggregate_daily_analytics(current_date - 2);
select aggregate_daily_analytics(current_date - 3);
