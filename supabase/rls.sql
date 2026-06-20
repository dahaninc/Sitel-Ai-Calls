-- ============================================================
-- SITEL AI — ROW LEVEL SECURITY
-- Run AFTER schema.sql and views_and_functions.sql
-- Ensures each client only sees their own data in the dashboard
-- ============================================================

-- Enable RLS on all data tables
alter table clients            enable row level security;
alter table call_logs          enable row level security;
alter table call_transcripts   enable row level security;
alter table escalation_events  enable row level security;
alter table analytics_daily    enable row level security;
alter table alert_rules        enable row level security;
alter table alerts             enable row level security;
alter table revenue_events     enable row level security;
alter table csat_surveys       enable row level security;
alter table voc_themes         enable row level security;
alter table competitor_mentions enable row level security;

-- Prospects and deals: founder-only (no client access)
alter table prospects          enable row level security;
alter table outreach_activities enable row level security;
alter table deals              enable row level security;
alter table webhook_events     enable row level security;

-- ============================================================
-- FOUNDER / ADMIN ROLE
-- Full access to everything
-- ============================================================

-- Create a custom role check function
create or replace function is_admin()
returns boolean as $$
begin
  return (
    select count(*) > 0
    from auth.users
    where id = auth.uid()
      and raw_user_meta_data->>'role' = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Founder sees all prospects
create policy "admin_all_prospects" on prospects
  for all using (is_admin());

create policy "admin_all_outreach" on outreach_activities
  for all using (is_admin());

create policy "admin_all_deals" on deals
  for all using (is_admin());

create policy "admin_all_clients" on clients
  for all using (is_admin());

create policy "admin_all_calls" on call_logs
  for all using (is_admin());

create policy "admin_all_transcripts" on call_transcripts
  for all using (is_admin());

create policy "admin_all_escalations" on escalation_events
  for all using (is_admin());

create policy "admin_all_analytics" on analytics_daily
  for all using (is_admin());

create policy "admin_all_alert_rules" on alert_rules
  for all using (is_admin());

create policy "admin_all_alerts" on alerts
  for all using (is_admin());

create policy "admin_all_revenue" on revenue_events
  for all using (is_admin());

create policy "admin_all_csat" on csat_surveys
  for all using (is_admin());

create policy "admin_all_voc" on voc_themes
  for all using (is_admin());

create policy "admin_all_competitors" on competitor_mentions
  for all using (is_admin());

create policy "admin_all_webhooks" on webhook_events
  for all using (is_admin());

-- ============================================================
-- CLIENT ROLE
-- Clients only see their own data (via dashboard_user_id)
-- ============================================================

create or replace function get_my_client_id()
returns uuid as $$
begin
  return (
    select id from clients
    where dashboard_user_id = auth.uid()
    limit 1
  );
end;
$$ language plpgsql security definer;

-- Clients can read their own client record
create policy "client_read_own" on clients
  for select using (dashboard_user_id = auth.uid());

-- Clients read their own call logs
create policy "client_read_calls" on call_logs
  for select using (client_id = get_my_client_id());

-- Clients read their own transcripts (via call_logs)
create policy "client_read_transcripts" on call_transcripts
  for select using (
    call_log_id in (
      select id from call_logs where client_id = get_my_client_id()
    )
  );

-- Clients read their own escalations
create policy "client_read_escalations" on escalation_events
  for select using (
    call_log_id in (
      select id from call_logs where client_id = get_my_client_id()
    )
  );

-- Clients read their own analytics
create policy "client_read_analytics" on analytics_daily
  for select using (client_id = get_my_client_id());

-- Clients read their own alert rules and can update notification prefs
create policy "client_read_alert_rules" on alert_rules
  for select using (client_id = get_my_client_id());

create policy "client_update_alert_rules" on alert_rules
  for update using (client_id = get_my_client_id())
  with check (client_id = get_my_client_id());

-- Clients read their own alerts
create policy "client_read_alerts" on alerts
  for select using (client_id = get_my_client_id());

-- Clients acknowledge their own alerts
create policy "client_ack_alerts" on alerts
  for update using (client_id = get_my_client_id())
  with check (client_id = get_my_client_id());

-- Clients read their own CSAT data
create policy "client_read_csat" on csat_surveys
  for select using (client_id = get_my_client_id());

-- Clients read their own VoC themes
create policy "client_read_voc" on voc_themes
  for select using (client_id = get_my_client_id());

-- Clients read competitor mentions in their calls
create policy "client_read_competitors" on competitor_mentions
  for select using (client_id = get_my_client_id());

-- Clients cannot see revenue data or other clients' data — no policies added for those
