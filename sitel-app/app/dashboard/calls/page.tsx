"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CallLog } from "@/lib/types";

const INTENT_LABELS: Record<string, string> = {
  order_status: "Order Status", return: "Return", refund: "Refund",
  complaint: "Complaint", delivery_faq: "Delivery FAQ", product_faq: "Product FAQ",
  wrong_item: "Wrong Item", damaged_item: "Damaged Item",
  missing_parcel: "Missing Parcel", escalation: "Escalation", other: "Other",
};

const SENTIMENT_BADGE: Record<string, string> = {
  positive: "bg-green-500/20 text-green-400",
  neutral: "bg-slate-500/20 text-slate-400",
  negative: "bg-red-500/20 text-red-400",
};

function formatDuration(s: number) {
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

export default function CallsPage() {
  const supabase = createClient();
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: client } = await supabase.from("clients").select("id").eq("dashboard_user_id", user.id).single();
      if (!client) { setLoading(false); return; }

      let q = supabase.from("call_logs").select("*").eq("client_id", client.id).order("started_at", { ascending: false }).limit(100);
      if (filter === "ai") q = q.eq("resolved_by_ai", true);
      if (filter === "human") q = q.eq("escalated_to_human", true);
      if (filter === "negative") q = q.eq("sentiment_label", "negative");

      const { data } = await q;
      if (data) setCalls(data as CallLog[]);
      setLoading(false);
    }
    load();
  }, [supabase, filter]);

  async function loadTranscript(callId: string) {
    if (transcript[callId]) { setExpanded(expanded === callId ? null : callId); return; }
    const { data } = await supabase.from("call_transcripts").select("summary, full_transcript").eq("call_log_id", callId).single();
    if (data) setTranscript(t => ({ ...t, [callId]: data.summary || data.full_transcript || "No transcript available." }));
    setExpanded(expanded === callId ? null : callId);
  }

  const filtered = calls.filter(c =>
    search === "" ||
    c.phone_number_from?.includes(search) ||
    c.primary_intent?.includes(search) ||
    c.retell_call_id?.includes(search)
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Call Logs</h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} calls shown</p>
        </div>
        <button className="text-sm bg-brand-600/20 border border-brand-600/30 text-brand-400 px-4 py-2 rounded-lg">
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {[
          { key: "all", label: "All Calls" },
          { key: "ai", label: "AI Resolved" },
          { key: "human", label: "Escalated" },
          { key: "negative", label: "Negative Sentiment" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`text-sm px-4 py-2 rounded-lg transition-all ${
              filter === f.key
                ? "bg-brand-600 text-white"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}>
            {f.label}
          </button>
        ))}
        <input
          type="text" placeholder="Search by number, intent, call ID..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm px-4 py-2 rounded-lg outline-none focus:border-brand-600/50"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 text-xs text-slate-500 px-4 py-3 border-b border-white/5 uppercase tracking-wide">
          <span>Time</span><span>From</span><span>Intent</span>
          <span>Duration</span><span>Sentiment</span><span>Resolution</span><span>Transcript</span>
        </div>
        {loading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">Loading calls...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No calls found</div>
        ) : (
          filtered.map(call => (
            <div key={call.id}>
              <div className="grid grid-cols-7 items-center px-4 py-3 border-b border-white/5 hover:bg-white/2 transition-colors text-sm">
                <span className="text-slate-400 text-xs">
                  {new Date(call.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}<br />
                  <span className="text-slate-600">{new Date(call.started_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                </span>
                <span className="text-slate-300 font-mono text-xs">{call.phone_number_from?.slice(-8) || "—"}</span>
                <span className="text-slate-300 capitalize text-xs">{INTENT_LABELS[call.primary_intent] || call.primary_intent || "—"}</span>
                <span className="text-slate-400 text-xs">{call.duration_seconds ? formatDuration(call.duration_seconds) : "—"}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full w-fit capitalize ${SENTIMENT_BADGE[call.sentiment_label] || ""}`}>
                  {call.sentiment_label || "—"}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${
                  call.resolved_by_ai ? "bg-green-500/20 text-green-400" :
                  call.escalated_to_human ? "bg-blue-500/20 text-blue-400" :
                  "bg-slate-500/20 text-slate-400"
                }`}>
                  {call.resolved_by_ai ? "✓ AI" : call.escalated_to_human ? "→ Human" : "Abandoned"}
                </span>
                <button onClick={() => loadTranscript(call.id)}
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  {expanded === call.id ? "Hide ▲" : "View ▼"}
                </button>
              </div>
              {expanded === call.id && (
                <div className="px-6 py-4 bg-navy-800/50 border-b border-white/5">
                  <p className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Call Summary</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{transcript[call.id] || "Loading..."}</p>
                  {call.recording_url && (
                    <a href={call.recording_url} target="_blank" className="inline-flex items-center gap-2 mt-3 text-xs text-brand-400 hover:text-brand-300">
                      🎵 Listen to recording
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
