# Supabase Setup Guide
## Sitel AI — Database & Backend

**Your Supabase project:** https://arbvuuyfdvojsdtvkkxd.supabase.co

---

## Step 1 — Run SQL files in order

Go to your Supabase dashboard → **SQL Editor** and run each file in this order:

1. `schema.sql` — creates all tables
2. `views_and_functions.sql` — creates dashboard views and helper functions
3. `rls.sql` — locks down data per client (row level security)
4. `retell_webhook.sql` — function that processes Retell AI call events
5. `seed.sql` — optional: loads demo data so your dashboard isn't empty

---

## Step 2 — Create your admin user

In Supabase → **Authentication** → **Users** → "Invite user":

- Email: your email
- After signing in, run this to grant admin role:

```sql
update auth.users
set raw_user_meta_data = jsonb_set(
  coalesce(raw_user_meta_data, '{}'),
  '{role}',
  '"admin"'
)
where email = 'your@email.com';
```

---

## Step 3 — Connect Retell AI webhook

In Retell AI → **Agent Settings** → **Webhook URL**, set:

```
https://arbvuuyfdvojsdtvkkxd.supabase.co/functions/v1/retell-webhook
```

Each time a call ends, Retell will POST the call data and it'll be stored automatically.

---

## Step 4 — Enable nightly analytics cron

In Supabase → **Database** → **Extensions**, enable `pg_cron`.

Then uncomment and run the cron section at the bottom of `retell_webhook.sql`.

---

## What You've Built

| Feature | Table/View |
|---|---|
| Prospect CRM | `prospects`, `outreach_activities` |
| Deal pipeline | `deals` → `v_pipeline_summary` |
| MRR tracking | `revenue_events` → `v_mrr` |
| Call logs | `call_logs`, `call_transcripts` |
| AI vs Human deflection | `v_client_call_stats` |
| Daily call volume chart | `v_daily_call_volume` |
| Top call reasons | `v_top_intents` |
| Churn risk radar | `v_churn_risk_radar` |
| Voice of Customer | `voc_themes` → `v_voc_weekly` |
| Competitor intelligence | `competitor_mentions` |
| Configurable alerts | `alert_rules`, `alerts` |
| CSAT tracking | `csat_surveys` |
| Client portal RLS | `rls.sql` |
| Retell webhook processor | `process_retell_call()` |

---

## Single API call for client dashboard

To power the client-facing dashboard, call this one function:

```sql
select get_client_dashboard_data('CLIENT_UUID_HERE');
```

Returns everything in one JSON blob: overview stats, daily volume, top intents, churn risk, recent alerts, and deflection rate.
