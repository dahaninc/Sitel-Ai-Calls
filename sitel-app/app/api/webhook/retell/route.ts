import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Retell AI posts call data here when a call ends.
// Set this URL in Retell AI → Agent Settings → Webhook URL:
// https://your-domain.vercel.app/api/webhook/retell

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

function sentimentScore(label: string): number {
  return label === "Positive" ? 0.6 : label === "Negative" ? -0.6 : 0;
}

export async function POST(req: NextRequest) {
  try {
    const body: RetellPayload = await req.json();
    if (body.event !== "call_ended") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const supabase = createServiceClient();
    const call = body.call;
    const analysis = call.call_analysis;
    const custom = analysis?.custom_analysis_data;

    // Find client by agent ID
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("retell_agent_id", call.agent_id)
      .single();

    if (!client) {
      console.error("No client found for agent_id:", call.agent_id);
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Store raw webhook event
    await supabase.from("webhook_events").insert({
      client_id: client.id,
      event_type: body.event,
      retell_call_id: call.call_id,
      payload: body,
    });

    const sentiment = analysis?.user_sentiment || "Unknown";
    const sentLabel = sentiment === "Positive" ? "positive" : sentiment === "Negative" ? "negative" : "neutral";

    // Process call via SQL function
    const { data: callId, error } = await supabase.rpc("process_retell_call", {
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

    if (error) {
      console.error("process_retell_call error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log competitor mentions if any
    if (custom?.competitor_mentions?.length && callId) {
      await supabase.from("competitor_mentions").insert(
        custom.competitor_mentions.map(c => ({
          call_log_id: callId,
          client_id: client.id,
          competitor: c,
          sentiment: sentLabel,
        }))
      );
    }

    return NextResponse.json({ ok: true, call_log_id: callId });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Sitel AI Retell Webhook",
    timestamp: new Date().toISOString(),
  });
}
