"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: "#94a3b8", font: { size: 12 } } } },
  scales: {
    x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#64748b" } },
    y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#64748b" } },
  },
};

export default function AnalyticsPage() {
  const supabase = createClient();
  const [daily, setDaily] = useState<{ labels: string[]; deflection: number[]; sentiment: number[]; calls: number[] }>({
    labels: [], deflection: [], sentiment: [], calls: [],
  });
  const [intents, setIntents] = useState<{ labels: string[]; counts: number[] }>({ labels: [], counts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: client } = await supabase.from("clients").select("id").eq("dashboard_user_id", user.id).single();
      if (!client) { setLoading(false); return; }

      const { data: vol } = await supabase
        .from("v_daily_call_volume").select("*").eq("client_id", client.id).limit(30);
      if (vol) {
        const sorted = [...vol].sort((a, b) => a.call_date.localeCompare(b.call_date));
        setDaily({
          labels: sorted.map(d => new Date(d.call_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })),
          deflection: sorted.map(d => d.total_calls > 0 ? Math.round((d.ai_resolved / d.total_calls) * 100) : 0),
          sentiment: sorted.map(d => Math.round((d.avg_sentiment || 0) * 100)),
          calls: sorted.map(d => d.total_calls),
        });
      }

      const { data: intentData } = await supabase
        .from("v_top_intents").select("*").eq("client_id", client.id).limit(8);
      if (intentData) {
        setIntents({
          labels: intentData.map(i => i.primary_intent.replace(/_/g, " ")),
          counts: intentData.map(i => i.call_count),
        });
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  if (loading) return <div className="p-8 text-slate-500 animate-pulse">Loading analytics...</div>;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">30-day performance breakdown</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">AI Deflection Rate %</h2>
          <div className="h-56">
            <Line data={{
              labels: daily.labels,
              datasets: [{ label: "Deflection %", data: daily.deflection, borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.1)", fill: true, tension: 0.4 }],
            }} options={chartOpts} />
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Daily Call Volume</h2>
          <div className="h-56">
            <Bar data={{
              labels: daily.labels,
              datasets: [{ label: "Total Calls", data: daily.calls, backgroundColor: "rgba(37,99,235,0.7)", borderRadius: 4 }],
            }} options={chartOpts} />
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Sentiment Score (scaled)</h2>
          <div className="h-56">
            <Line data={{
              labels: daily.labels,
              datasets: [{ label: "Sentiment", data: daily.sentiment, borderColor: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.1)", fill: true, tension: 0.4 }],
            }} options={chartOpts} />
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Calls by Intent</h2>
          <div className="h-56">
            <Bar data={{
              labels: intents.labels,
              datasets: [{ label: "Calls", data: intents.counts, backgroundColor: "rgba(124,58,237,0.7)", borderRadius: 4 }],
            }} options={{ ...chartOpts, indexAxis: "y" as const }} />
          </div>
        </div>
      </div>
    </div>
  );
}
