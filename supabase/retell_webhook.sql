-- ============================================================
-- SITEL AI — RETELL AI WEBHOOK HANDLER
-- This Edge Function processes inbound Retell AI call events
-- and writes them to call_logs and call_transcripts
--
-- Deploy via: supabase functions deploy retell-webhook
-- Set webhook URL in Retell AI to:
-- https://arbvuuyfdvojsdtvkkxd.supabase.co/functions/v1/retell-webhook
-- ============================================================

-- This is the SQL setup for the webhook processor.
-- The actual Edge Function code is in: supabase/functions/retell-webhook/index.ts
-- (create that file and deploy via Supabase CLI)

-- Function to process a completed Retell call
create or replace function process_retell_call(
  p_retell_call_id    text,
  p_client_id         uuid,
  p_phone_from        text,
  p_phone_to          text,
  p_started_at        timestamptz,
  p_ended_at          timestamptz,
  p_transcript        text,
  p_summary           text,
  p_intent            text,
  p_sentiment_score   numeric,
  p_resolved_by_ai    boolean,
  p_escalated         boolean,
  p_escalation_reason text,
  p_abandoned         boolean,
  p_recording_url     text,
  p_churn_risk        boolean default false,
  p_key_issues        jsonb default '[]'
)
returns uuid as $$
declare
  v_call_id uuid;
  v_sentiment_label text;
begin
  -- Determine sentiment label
  v_sentiment_label := case
    when p_sentiment_score >= 0.2  then 'positive'
    when p_sentiment_score <= -0.2 then 'negative'
    else 'neutral'
  end;

  -- Insert call log
  insert into call_logs (
    client_id, retell_call_id,
    phone_number_from, phone_number_to,
    started_at, ended_at,
    duration_seconds,
    resolved_by_ai, escalated_to_human, escalation_reason, abandoned,
    primary_intent,
    sentiment_score, sentiment_label,
    recording_url,
    caller_authenticated
  ) values (
    p_client_id, p_retell_call_id,
    p_phone_from, p_phone_to,
    p_started_at, p_ended_at,
    extract(epoch from (p_ended_at - p_started_at))::int,
    p_resolved_by_ai, p_escalated, p_escalation_reason, p_abandoned,
    p_intent,
    p_sentiment_score, v_sentiment_label,
    p_recording_url,
    true -- assume authenticated if we received structured data
  )
  returning id into v_call_id;

  -- Insert transcript
  if p_transcript is not null then
    insert into call_transcripts (
      call_log_id, full_transcript, summary,
      key_issues, churn_risk_detected
    ) values (
      v_call_id, p_transcript, p_summary,
      p_key_issues, p_churn_risk
    );
  end if;

  -- Insert escalation event if escalated
  if p_escalated then
    insert into escalation_events (
      call_log_id, trigger_type, trigger_phrase, escalated_at
    ) values (
      v_call_id,
      case
        when p_escalation_reason = 'customer_request' then 'customer_request'
        when p_escalation_reason = 'complaint' then 'complaint_threshold'
        else 'ai_uncertainty'
      end,
      p_escalation_reason,
      p_ended_at
    );
  end if;

  -- Mark webhook as processed
  update webhook_events
  set processed = true
  where retell_call_id = p_retell_call_id
    and processed = false;

  return v_call_id;
end;
$$ language plpgsql security definer;

-- ============================================================
-- CRON JOB — nightly analytics aggregation
-- Enable via: Dashboard > Database > Extensions > pg_cron
-- ============================================================

-- select cron.schedule(
--   'nightly-analytics',
--   '0 2 * * *',  -- 2am every night
--   $$ select aggregate_daily_analytics(current_date - 1); $$
-- );
