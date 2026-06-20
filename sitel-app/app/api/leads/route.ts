/**
 * Lead Capture API
 *
 * Receives email submissions from the landing page CTA form.
 * Stores in Supabase `prospects` table with source tracking.
 * In production: also trigger a Zapier/Make webhook to notify the sales team via Slack.
 *
 * POST /api/leads
 * Body: { email: string, source?: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Simple rate limit: track IPs in memory (upgrade to Redis at scale)
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000; // 1 minute
  const maxRequests = 3;

  const timestamps = (rateLimitMap.get(ip) || []).filter(t => now - t < windowMs);
  if (timestamps.length >= maxRequests) return true;

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const source = body.source || "landing_page_cta";

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Upsert into prospects — don't fail if email already exists
    const { error } = await supabase.from("prospects").upsert(
      {
        contact_email: email,
        company_name: email.split("@")[1] || "Unknown", // Best guess from domain
        source,
        icp_score: 5, // Default — sales team will qualify
      },
      { onConflict: "contact_email", ignoreDuplicates: true }
    );

    if (error) {
      console.error("Lead capture error:", error);
      // Don't expose DB errors to client
      return NextResponse.json({ error: "Could not save" }, { status: 500 });
    }

    // Optional: notify sales team via webhook (add SALES_WEBHOOK_URL env var)
    const webhookUrl = process.env.SALES_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🔥 New lead: ${email} (source: ${source})`,
          email,
          source,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {}); // Fire and forget — don't block response
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
