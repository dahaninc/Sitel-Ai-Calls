/**
 * Supabase Browser Client — Singleton
 *
 * createBrowserClient() MUST be called once per browser session.
 * Calling it inside a component body creates a new WebSocket on every render,
 * exhausting Supabase's connection pool (200 connections on free tier, 500 on Pro).
 *
 * This module exports a singleton instance that is reused across all components.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During build or misconfigured deploy — return a non-functional client
    // rather than crashing the build. Will fail gracefully at runtime.
    console.warn("Supabase env vars not set — client will not connect");
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
  }

  _client = createBrowserClient(url, key);
  return _client;
}
