-- ============================================================
-- SITEL AI — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor (in order)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for fast text search

-- ============================================================
-- 1. PROSPECTS (CRM — leads pipeline)
-- ============================================================

create table prospects (
  id                       uuid primary key default uuid_generate_v4(),
  company_name             text not null,
  contact_name             text,
  contact_email            text,
  contact_linkedin         text,
  contact_title            text,
  phone                    text,
  website                  text,
  industry                 text check (industry in ('ecommerce','saas','logistics','other')),
  employee_count           int,
  estimated_monthly_calls  int,
  estimated_revenue_range  text, -- e.g. '£1M-£5M'
  trustpilot_url           text,
  trustpilot_rating        numeric(2,1),
  pain_signals             jsonb default '[]', -- ['hiring_cs','trustpilot_complaints','scaling','peak_issues']
  icp_score                int check (icp_score between 1 and 10),
  source                   text check (source in ('linkedin','cold_email','referral','inbound','event','other')),
  notes                    text,
  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);

create index idx_prospects_icp_score on prospects(icp_score desc);
create index idx_prospects_company on prospects using gin(to_tsvector('english', company_name));

-- ============================================================
-- 2. OUTREACH ACTIVITIES
-- ============================================================

create table outreach_activities (
  id                 uuid primary key default uuid_generate_v4(),
  prospect_id        uuid references prospects(id) on delete cascade,
  channel            text check (channel in ('linkedin','email','phone','whatsapp')),
  message_variant    text, -- which template used e.g. 'linkedin_v2_trustpilot'
  sent_at            timestamptz default now(),
  opened_at          timestamptz,
  replied_at         timestamptz,
  reply_sentiment    text check (reply_sentiment in ('positive','neutral','negative','no_reply')),
  reply_content      text,
  next_follow_up_at  timestamptz,
  follow_up_number   int default 1, -- 1 = initial, 2 = day 3 follow-up, 3 = day 7 follow-up
  created_at         timestamptz default now()
);

create index idx_outreach_prospect on outreach_activities(prospect_id);
create index idx_outreach_follow_up on outreach_activities(next_follow_up_at) where reply_sentiment = 'no_reply';

-- ============================================================
-- 3. DEALS (PIPELINE)
-- ============================================================

create type deal_stage as enum (
  'outreach',
  'demo_called',
  'discovery_scheduled',
  'discovery_completed',
  'proposal_sent',
  'negotiation',
  'closed_won',
  'closed_lost'
);

create table deals (
  id                    uuid primary key default uuid_generate_v4(),
  prospect_id           uuid references prospects(id) on delete set null,
  stage                 deal_stage default 'outreach',
  tier                  text check (tier in ('starter','growth','scale')),
  setup_fee             numeric(10,2),
  monthly_fee           numeric(10,2),
  estimated_close_date  date,
  actual_close_date     date,
  lost_reason           text,
  competitor_lost_to    text,
  probability           int default 10 check (probability between 0 and 100),
  notes                 text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- Auto-update pipeline value view
create index idx_deals_stage on deals(stage);

-- ============================================================
-- 4. CLIENTS (signed, paying)
-- ============================================================

create table clients (
  id                   uuid primary key default uuid_generate_v4(),
  deal_id              uuid references deals(id),
  company_name         text not null,
  contact_name         text,
  contact_email        text not null,
  tier                 text check (tier in ('starter','growth','scale')),
  setup_fee_paid       numeric(10,2),
  monthly_fee          numeric(10,2),
  contract_start_date  date,
  contract_end_date    date,
  min_term_months      int default 3,
  status               text check (status in ('onboarding','active','paused','churned')) default 'onboarding',
  -- Retell AI config
  retell_agent_id      text,
  retell_api_key       text, -- store encrypted in production
  -- Twilio config
  twilio_phone_number  text,
  twilio_account_sid   text,
  -- CRM integration
  crm_type             text check (crm_type in ('gorgias','zendesk','freshdesk','shopify','custom','none')),
  crm_webhook_url      text,
  -- Shopify
  shopify_store_url    text,
  shopify_api_key      text,
  -- Notifications
  slack_webhook_url    text,
  alert_email          text,
  -- Auth (for client dashboard login)
  dashboard_user_id    uuid references auth.users(id),
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

create index idx_clients_status on clients(status);

-- ============================================================
-- 5. CALL LOGS (every AI-handled call)
-- ============================================================

create table call_logs (
  id                    uuid primary key default uuid_generate_v4(),
  client_id             uuid references clients(id) on delete cascade,
  retell_call_id        text unique, -- Retell AI's call ID
  phone_number_from     text,
  phone_number_to       text,
  started_at            timestamptz,
  ended_at              timestamptz,
  duration_seconds      int,
  -- Resolution
  resolved_by_ai        boolean default false,
  escalated_to_human    boolean default false,
  escalation_reason     text,
  abandoned             boolean default false, -- caller hung up before resolution
  -- Intent classification
  primary_intent        text check (primary_intent in (
                          'order_status','return','refund','complaint',
                          'delivery_faq','product_faq','wrong_item',
                          'damaged_item','missing_parcel','escalation','other')),
  secondary_intents     jsonb default '[]',
  -- Sentiment
  sentiment_score       numeric(4,3) check (sentiment_score between -1 and 1),
  sentiment_label       text check (sentiment_label in ('positive','neutral','negative')),
  sentiment_shift       text check (sentiment_shift in ('improved','worsened','stable')), -- did we de-escalate?
  -- Quality
  csat_score            int check (csat_score between 1 and 5), -- post-call survey
  -- Media
  recording_url         text,
  -- Auth info collected
  caller_authenticated  boolean default false,
  order_number_provided text,
  created_at            timestamptz default now()
);

create index idx_call_logs_client on call_logs(client_id);
create index idx_call_logs_started on call_logs(started_at desc);
create index idx_call_logs_intent on call_logs(primary_intent);
create index idx_call_logs_sentiment on call_logs(sentiment_label);

-- ============================================================
-- 6. CALL TRANSCRIPTS
-- ============================================================

create table call_transcripts (
  id                   uuid primary key default uuid_generate_v4(),
  call_log_id          uuid references call_logs(id) on delete cascade unique,
  full_transcript      text,
  summary              text, -- AI-generated 2-sentence summary
  key_issues           jsonb default '[]', -- ['refund requested','agent error mentioned','repeat caller']
  competitor_mentions  jsonb default '[]', -- ['zendesk','freshdesk']
  product_mentions     jsonb default '[]', -- which products came up
  churn_risk_detected  boolean default false, -- did customer signal they might leave?
  abuse_detected       boolean default false, -- offensive language flag
  created_at           timestamptz default now()
);

create index idx_transcripts_churn_risk on call_transcripts(churn_risk_detected) where churn_risk_detected = true;

-- ============================================================
-- 7. ESCALATION EVENTS
-- ============================================================

create table escalation_events (
  id                    uuid primary key default uuid_generate_v4(),
  call_log_id           uuid references call_logs(id) on delete cascade,
  trigger_type          text check (trigger_type in (
                          'customer_request','ai_uncertainty',
                          'complaint_threshold','sensitive_data',
                          'abuse_detected','repeat_caller','other')),
  trigger_phrase        text, -- the exact phrase that caused escalation
  escalated_at          timestamptz,
  hold_time_seconds     int, -- how long customer waited for human
  resolved_by_human     boolean,
  resolution_notes      text,
  created_at            timestamptz default now()
);

-- ============================================================
-- 8. DAILY ANALYTICS (pre-aggregated for dashboard speed)
-- ============================================================

create table analytics_daily (
  id                     uuid primary key default uuid_generate_v4(),
  client_id              uuid references clients(id) on delete cascade,
  date                   date not null,
  total_calls            int default 0,
  ai_resolved            int default 0,
  human_escalated        int default 0,
  abandoned              int default 0,
  deflection_rate        numeric(5,4), -- 0.0000 to 1.0000
  avg_duration_seconds   numeric(8,2),
  avg_sentiment_score    numeric(4,3),
  positive_calls         int default 0,
  neutral_calls          int default 0,
  negative_calls         int default 0,
  csat_responses         int default 0,
  avg_csat               numeric(3,2),
  top_intents            jsonb default '{}', -- {'order_status': 45, 'return': 23, ...}
  churn_risk_calls       int default 0,
  unique (client_id, date)
);

create index idx_analytics_client_date on analytics_daily(client_id, date desc);

-- ============================================================
-- 9. ALERT RULES (configurable per client)
-- ============================================================

create table alert_rules (
  id                          uuid primary key default uuid_generate_v4(),
  client_id                   uuid references clients(id) on delete cascade,
  name                        text not null,
  metric                      text check (metric in (
                                'escalation_rate','negative_sentiment_rate',
                                'call_volume_spike','abandoned_rate',
                                'avg_duration','csat_score','churn_risk_count')),
  operator                    text check (operator in ('gt','lt','eq','gte','lte')),
  threshold                   numeric,
  window_minutes              int default 60, -- evaluate over this rolling window
  notification_email          text,
  notification_slack_webhook  text,
  is_active                   boolean default true,
  created_at                  timestamptz default now()
);

-- ============================================================
-- 10. ALERTS (triggered instances)
-- ============================================================

create table alerts (
  id               uuid primary key default uuid_generate_v4(),
  alert_rule_id    uuid references alert_rules(id) on delete cascade,
  client_id        uuid references clients(id),
  message          text,
  metric_value     numeric,
  triggered_at     timestamptz default now(),
  acknowledged_at  timestamptz,
  acknowledged_by  text
);

create index idx_alerts_client on alerts(client_id, triggered_at desc);

-- ============================================================
-- 11. REVENUE EVENTS
-- ============================================================

create table revenue_events (
  id                 uuid primary key default uuid_generate_v4(),
  client_id          uuid references clients(id) on delete set null,
  event_type         text check (event_type in (
                       'setup_fee','monthly_fee','overage',
                       'upsell','refund','churn')),
  amount             numeric(10,2) not null,
  currency           text default 'GBP',
  invoice_date       date,
  paid_at            timestamptz,
  stripe_invoice_id  text,
  notes              text,
  created_at         timestamptz default now()
);

create index idx_revenue_client on revenue_events(client_id, invoice_date desc);

-- ============================================================
-- 12. WEBHOOK EVENTS (from Retell AI — raw inbound)
-- ============================================================

create table webhook_events (
  id           uuid primary key default uuid_generate_v4(),
  client_id    uuid references clients(id),
  event_type   text, -- 'call_ended', 'call_started', 'escalation'
  retell_call_id text,
  payload      jsonb,
  processed    boolean default false,
  error        text,
  created_at   timestamptz default now()
);

create index idx_webhooks_unprocessed on webhook_events(processed, created_at) where processed = false;

-- ============================================================
-- 13. VOICE OF CUSTOMER — THEMES (groundbreaking)
-- Aggregated complaint/praise themes extracted from transcripts
-- ============================================================

create table voc_themes (
  id           uuid primary key default uuid_generate_v4(),
  client_id    uuid references clients(id) on delete cascade,
  week_start   date,
  theme        text, -- e.g. 'delivery delays', 'wrong item received', 'refund speed'
  category     text check (category in ('complaint','praise','neutral','feature_request')),
  call_count   int default 1,
  example_call_id uuid references call_logs(id),
  created_at   timestamptz default now(),
  unique (client_id, week_start, theme)
);

-- ============================================================
-- 14. COMPETITOR INTELLIGENCE (groundbreaking)
-- Tracks competitor mentions across all client calls
-- ============================================================

create table competitor_mentions (
  id             uuid primary key default uuid_generate_v4(),
  call_log_id    uuid references call_logs(id) on delete cascade,
  client_id      uuid references clients(id),
  competitor     text, -- 'zendesk', 'freshdesk', 'intercom', etc.
  context        text, -- the sentence where it was mentioned
  sentiment      text check (sentiment in ('positive','negative','neutral')),
  mentioned_at   timestamptz default now()
);

-- ============================================================
-- 15. CSAT SURVEYS (post-call)
-- ============================================================

create table csat_surveys (
  id               uuid primary key default uuid_generate_v4(),
  call_log_id      uuid references call_logs(id) on delete cascade,
  client_id        uuid references clients(id),
  score            int check (score between 1 and 5),
  comment          text,
  survey_channel   text check (survey_channel in ('sms','email','ivr')),
  responded_at     timestamptz default now()
);

-- ============================================================
-- UPDATED_AT TRIGGERS (auto-update timestamps)
-- ============================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_prospects_updated_at
  before update on prospects
  for each row execute function set_updated_at();

create trigger trg_deals_updated_at
  before update on deals
  for each row execute function set_updated_at();

create trigger trg_clients_updated_at
  before update on clients
  for each row execute function set_updated_at();
