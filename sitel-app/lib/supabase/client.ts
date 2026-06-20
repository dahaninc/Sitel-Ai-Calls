import { createBrowserClient } from "@supabase/ssr";

// Fallback prevents build-time crash when env vars are absent.
// Real values must be set in Vercel → Settings → Environment Variables.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key"
  );
}
