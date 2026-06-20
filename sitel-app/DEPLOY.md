# Deploy to Vercel

## Option A — Vercel CLI (fastest, 3 minutes)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Go to the app folder
cd ~/Desktop/Project-Sitel-Launch-Kit/sitel-app

# 3. Install dependencies
npm install

# 4. Deploy
vercel --prod
```

Follow the prompts:
- Link to existing project? → **No** (create new)
- Project name: `sitel-ai`
- Framework: **Next.js** (auto-detected)

## Option B — GitHub + Vercel (auto-deploys on push)

1. Push the `sitel-app` folder to GitHub (use the `push-to-github.sh` script)
2. Go to vercel.com → "Add New Project"
3. Import the `dahaninc/Sitel-Ai-Calls` repo
4. Set root directory to `sitel-app`
5. Add environment variables (see below)
6. Deploy

## Environment Variables (add in Vercel dashboard)

Go to your Vercel project → Settings → Environment Variables:

| Key | Value | Where to find it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://arbvuuyfdvojsdtvkkxd.supabase.co` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase → Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase → Settings → API → service_role key |
| `RETELL_API_KEY` | `key_...` | Retell AI → Dashboard → API Key |
| `NEXT_PUBLIC_DEMO_PHONE` | `+44 20 XXXX XXXX` | Your Twilio number |
| `NEXT_PUBLIC_APP_URL` | `https://sitel-ai.vercel.app` | Your Vercel domain |

## After deployment

1. **Update Retell AI webhook URL:**
   Retell AI → Agent → Webhook URL → `https://sitel-ai.vercel.app/api/webhook/retell`

2. **Test the webhook:**
   ```
   curl https://sitel-ai.vercel.app/api/webhook/retell
   ```
   Should return `{"status":"ok","service":"Sitel AI Retell Webhook"}`

3. **Set up Supabase Auth:**
   Supabase → Authentication → URL Configuration → Site URL: `https://sitel-ai.vercel.app`

4. **Run the SQL files** in Supabase SQL Editor (see supabase/SETUP.md)

## Your URLs

- **Landing page:** `https://sitel-ai.vercel.app`
- **Client dashboard:** `https://sitel-ai.vercel.app/dashboard`
- **Retell webhook:** `https://sitel-ai.vercel.app/api/webhook/retell`
