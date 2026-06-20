/**
 * Retell AI Webhook — Production-grade handler
 *
 * Security: Verifies the x-retell-signature header using HMAC-SHA256.
 * Without this check, anyone can POST fake call data to corrupt the DB.
 *
 * Flow:
 * 1. Verify signature (reject if invalid)
 * 2. Find client by agent_id
 * 3. Store raw event (idempotent via retell_call_id unique constraint)
 * 4. Call process_retell_call() SQL function
 * 5. Log competitor mentions
 * 6. Return 200 fast (<200ms) — Retell retries on non-2xx
 */
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createHmac, timingSafeEqual } from "crypto";

// ── Retell payload types ──────────────────────────────────────────────────────
interface RetellPayload {
  event: string;
  call: {
    call_id: string;
    call_status: string;
    agent_id: string;
    from_number: string;
    to_number: string;
    start_timestamp: number;
    end_timestamp: number;
    duration_ms: number;
    transcript?: string;
    recording_url?: string;
    call_analysis?: {
      call_summary?: string;
      user_sentiment?: "Positive" | "Negative" | "Neutral" | "Unknown";
      call_successful?: boolean;
      custom_analysis_data?: {
        intent?: string;
        resolved_by_ai?: boolean;
        escalated_to_human?: boolean;
        escalation_reason?: string;
        abandoned?: boolean;
        churn_risk?: boolean;
        key_issues?: string[];
        competitor_mentions?: string[];
      };
    };
  };
}

// ── Signature verification ────────────────────────────────────────────────────
/**
 * Verifies the x-retell-signature header.
 * Retell signs the raw body with HMAC-SHA256 using your webhook secret.
 * We use timingSafeEqual to prevent timing attacks.
 */
async function verifyRetellSignature(req: NextRequest, rawBody: string): Promise<boolean> {
  const secret = process.env.RETELL_WEBHOOK_SECRET;
  if (!secret) {
    // Allow in development (no secret set), but log a warning
    console.warn("RETELL_WEBHOOK_SECRET not set — skipping signature verification");
    return true;
  }

  const signature = req.headers.get("x-retell-signature");
  if (!signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ── Sentiment helpers ─────────────────────────────────────────────────────────
function sentimentScore(label: string): number {
  const map: Record<string, number> = { Positive: 0.6, Negative: -0.6, Neutral: 0, Unknown: 0 };
  return map[label] ?? 0;
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Read raw body for signature verification (must happen before .json())
  const rawBody = await req.text();

  // 2. Verify signature — reject unauthenticated requests immediately
  const valid = await verifyRetellSignature(req, rawBody);
  if (!valid) {
    console.error("Invalid Retell webhook signature");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: RetellPayload = JSON.parse(rawBody);

    // Only process call_ended events — acknowledge others immediately
    if (body.event !== "call_ended") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const supabase = createServiceClient();
    const call = body.call;
    const analysis = call.call_analysis;
    const custom = analysis?.custom_analysis_data;

    // 3. Find client by agent_id
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("retell_agent_id", call.agent_id)
      .single();

    if (clientError || !client) {
      console.error("No client found for agent_id:", call.agent_id);
      // Return 200 to prevent Retell from retrying — log for manual review
      return NextResponse.json({ ok: true, warning: "client_not_found" });
    }

    // 4. Store raw webhook event (idempotent — unique constraint on retell_call_id)
    const { error: webhookError } = await supabase.from("webhook_events").upsert(
      {
        client_id: client.id,
        event_type: body.event,
        retell_call_id: call.call_id,
        payload: body,
      },
      { onConflict: "retell_call_id", ignoreDuplicates: true }
    );

    if (webhookError) {
      console.error("webhook_events insert error:", webhookError);
    }

    const sentiment = analysis?.user_sentiment || "Unknown";

    // 5. Process call via SQL function
    const { data: callId, error: rpcError } = await supabase.rpc("process_retell_call", {
      p_retell_call_id:    call.call_id,
      p_client_id:         client.id,
      p_phone_from:        call.from_number,
      p_phone_to:          call.to_number,
      p_started_at:        new Date(call.start_timestamp).toISOString(),
      p_ended_at:          new Date(call.end_timestamp).toISOString(),
      p_transcript:        call.transcript || null,
      p_summary:           analysis?.call_summary || null,
      p_intent:            custom?.intent || "other",
      p_sentiment_score:   sentimentScore(sentiment),
      p_resolved_by_ai:    custom?.resolved_by_ai ?? (analysis?.call_successful ?? false),
      p_escalated:         custom?.escalated_to_human ?? false,
      p_escalation_reason: custom?.escalation_reason || null,
      p_abandoned:         custom?.abandoned ?? false,
      p_recording_url:     call.recording_url || null,
      p_churn_risk:        custom?.churn_risk ?? false,
      p_key_issues:        JSON.stringify(custom?.key_issues || []),
    });

    if (rpcError) {
      console.error("process_retell_call error:", rpcError);
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    // 6. Log competitor mentions (fire and forget — don't block response)
    if (custom?.competitor_mentions?.length && callId) {
      supabase.from("competitor_mentions").insert(
        custom.competitor_mentions.map(c => ({
          call_log_id: callId,
          client_id: client.id,
          competitor: c,
          sentiment: sentiment.toLowerCase(),
        }))
      ).then(({ error }) => { if (error) console.error("competitor_mentions error:", error); });
    }

    return NextResponse.json({ ok: true, call_log_id: callId });

  } catch (err) {
    console.error("Webhook parse/process error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// ── GET: health check ─────────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Sitel AI — Retell Webhook",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  });
}
