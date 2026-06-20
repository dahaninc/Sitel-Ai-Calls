"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "blue", trend }: {
  label: string; value: string | number; sub?: string; color?: string; trend?: string;
}) {
  const colors: Record<string, string> = {
    blue: "from-brand-600/20 to-brand-600/5 border-brand-600/20",
    green: "from-green-500/20 to-green-500/5 border-green-500/20",
    purple: "from-purple-600/20 to-purple-600/5 border-purple-600/20",
    orange: "from-orange-500/20 to-orange-500/5 border-orange-500/20",
    red: "from-red-500/20 to-red-500/5 border-red-500/20",
  };
  return (
    <div className={`bg-gradient-to-b ${colors[color]} border rounded-xl p-6`}>
      <div className="text-slate-500 text-sm mb-1">{label}</div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      {sub && <div className="text-slate-500 text-xs">{sub}</div>}
      {trend && <div className="text-green-400 text-xs mt-2">{trend}</div>}
    </div>
  );
}

// ─── Churn Risk Banner ────────────────────────────────────────────────────────
function ChurnRiskBanner({ score }: { score: number }) {
  if (score < 40) return null;
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-4">
      <span className="text-2xl">⚠️</span>
      <div>
        <div className="text-red-400 font-semibold">Churn Risk Detected</div>
        <div className="text-slate-400 text-sm">Risk score: {score}/100 — elevated negative sentiment and escalation rate this week. Review recent call transcripts.</div>
      </div>
      <button className="ml-auto text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-all">
        View transcripts
      </button>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState<Record<string, number>>({
    total_calls: 0, calls_this_month: 0,
    ai_deflection_rate_pct: 0, avg_sentiment: 0,
    escalations: 0, abandoned_calls: 0, avg_csat: 0,
    churn_risk_score: 0,
  });
  const [dailyVolume, setDailyVolume] = useState<{ labels: string[]; ai: number[]; human: number[] }>({ labels: [], ai: [], human: [] });
  const [intents, setIntents] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Get client ID for current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: client } = await supabase
        .from("clients").select("id").eq("dashboard_user_id", user.id).single();
      if (!client) { setLoading(false); return; }

      // Fetch stats
      const { data: statsData } = await supabase
        .from("v_client_call_stats").select("*").eq("client_id", client.id).single();
      if (statsData) setStats(statsData as Record<string, number>);

      // Fetch daily volume (last 30 days)
      const { data: vol } = await supabase
        .from("v_daily_call_volume").select("*").eq("client_id", client.id).limit(30);
      if (vol) {
        const sorted = [...vol].sort((a, b) => a.call_date.localeCompare(b.call_date));
        setDailyVolume({
          labels: sorted.map(d => new Date(d.call_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })),
          ai: sorted.map(d => d.ai_resolved),
          human: sorted.map(d => d.escalated),
        });
      }

      // Fetch intents
      const { data: intentData } = await supabase
        .from("v_top_intents").select("*").eq("client_id", client.id).limit(6);
      if (intentData) {
        setIntents({
          labels: intentData.map(i => i.primary_intent.replace(/_/g, " ")),
          data: intentData.map(i => i.call_count),
        });
      }

      setLoading(false);
    }
    load();
  }, [supabase]);

  const sentimentLabel = stats.avg_sentiment > 0.2 ? "Positive" : stats.avg_sentiment < -0.2 ? "Negative" : "Neutral";
  const sentimentColor = stats.avg_sentiment > 0.2 ? "green" : stats.avg_sentiment < -0.2 ? "red" : "blue";

  const lineData = {
    labels: dailyVolume.labels,
    datasets: [
      {
        label: "AI Resolved",
        data: dailyVolume.ai,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Escalated",
        data: dailyVolume.human,
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124,58,237,0.05)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const donutData = {
    labels: intents.labels,
    datasets: [{
      data: intents.data,
      backgroundColor: ["#2563eb","#7c3aed","#059669","#d97706","#dc2626","#0891b2"],
      borderColor: "transparent",
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#94a3b8", font: { size: 12 } } } },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#64748b", maxTicksLimit: 8 } },
      y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#64748b" } },
    },
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-slate-500 animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Last updated: {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Agent Live</span>
        </div>
      </div>

      {/* Churn Risk */}
      <ChurnRiskBanner score={stats.churn_risk_score || 0} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Calls This Month" value={stats.calls_this_month?.toLocaleString() || "—"}
          sub="All inbound calls" color="blue" />
        <StatCard label="AI Deflection Rate" value={`${stats.ai_deflection_rate_pct || 0}%`}
          sub="Resolved without human" color="green"
          trend={stats.ai_deflection_rate_pct > 60 ? "↑ Above target" : undefined} />
        <StatCard label="Avg Sentiment" value={sentimentLabel}
          sub={`Score: ${(stats.avg_sentiment || 0).toFixed(2)}`} color={sentimentColor} />
        <StatCard label="Avg CSAT" value={stats.avg_csat ? `${stats.avg_csat.toFixed(1)} / 5` : "—"}
          sub="Post-call survey score" color="purple" />
        <StatCard label="Total Calls (All Time)" value={stats.total_calls_all_time?.toLocaleString() || "—"} color="blue" />
        <StatCard label="Escalations" value={stats.escalations?.toLocaleString() || "0"}
          sub="Transferred to human" color="orange" />
        <StatCard label="Abandoned" value={stats.abandoned_calls?.toLocaleString() || "0"}
          sub="Hung up before resolution" color="red" />
        <StatCard label="Avg Call Duration" value={stats.avg_call_duration_seconds ? `${Math.round(stats.avg_call_duration_seconds)}s` : "—"}
          sub="AI-handled calls" color="purple" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-6">Call Volume — Last 30 Days</h2>
          <div className="h-64">
            {dailyVolume.labels.length > 0
              ? <Line data={lineData} options={chartOptions} />
              : <div className="h-full flex items-center justify-center text-slate-600">No data yet</div>
            }
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-6">Top Call Reasons</h2>
          <div className="h-64">
            {intents.labels.length > 0
              ? <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { color: "#94a3b8", font: { size: 11 }, padding: 12 } } }, cutout: "65%" }} />
              : <div className="h-full flex items-center justify-center text-slate-600">No data yet</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
