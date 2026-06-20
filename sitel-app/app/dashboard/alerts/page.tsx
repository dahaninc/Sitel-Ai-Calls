"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Alert = {
  id: string;
  triggered_at: string;
  resolved_at: string | null;
  alert_rules: { name: string; metric: string; threshold: number } | null;
  triggered_value: number;
  message: string | null;
};

type AlertRule = {
  id: string;
  name: string;
  metric: string;
  operator: string;
  threshold: number;
  is_active: boolean;
  notification_email: string | null;
};

export default function AlertsPage() {
  const supabase = createClient();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"triggered" | "rules">("triggered");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: client } = await supabase.from("clients").select("id").eq("dashboard_user_id", user.id).single();
      if (!client) { setLoading(false); return; }

      const { data: alertData } = await supabase
        .from("alerts")
        .select("*, alert_rules(name, metric, threshold)")
        .eq("client_id", client.id)
        .order("triggered_at", { ascending: false })
        .limit(50);
      if (alertData) setAlerts(alertData as Alert[]);

      const { data: rulesData } = await supabase
        .from("alert_rules")
        .select("*")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });
      if (rulesData) setRules(rulesData as AlertRule[]);

      setLoading(false);
    }
    load();
  }, [supabase]);

  async function toggleRule(id: string, current: boolean) {
    await supabase.from("alert_rules").update({ is_active: !current }).eq("id", id);
    setRules(r => r.map(rule => rule.id === id ? { ...rule, is_active: !current } : rule));
  }

  async function resolveAlert(id: string) {
    await supabase.from("alerts").update({ resolved_at: new Date().toISOString() }).eq("id", id);
    setAlerts(a => a.map(alert => alert.id === id ? { ...alert, resolved_at: new Date().toISOString() } : alert));
  }

  if (loading) return <div className="p-8 text-slate-500 animate-pulse">Loading alerts...</div>;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Alerts</h1>
        <p className="text-slate-500 text-sm mt-1">Real-time notifications and alert rules</p>
      </div>

      <div className="flex gap-2">
        {(["triggered", "rules"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-brand text-white" : "text-slate-400 hover:text-white"}`}>
            {t === "triggered" ? `Triggered (${alerts.filter(a => !a.resolved_at).length})` : "Rules"}
          </button>
        ))}
      </div>

      {tab === "triggered" && (
        <div className="space-y-3">
          {alerts.length === 0 && (
            <div className="glass rounded-xl p-8 text-center text-slate-500">No alerts triggered yet.</div>
          )}
          {alerts.map(alert => (
            <div key={alert.id} className={`glass rounded-xl p-4 flex items-start justify-between gap-4 border-l-4 ${alert.resolved_at ? "border-slate-600 opacity-60" : "border-red-500"}`}>
              <div className="space-y-1">
                <p className="text-white font-medium">{alert.alert_rules?.name ?? "Alert"}</p>
                <p className="text-slate-400 text-sm">{alert.message ?? `Value: ${alert.triggered_value}`}</p>
                <p className="text-slate-600 text-xs">{new Date(alert.triggered_at).toLocaleString("en-GB")}</p>
              </div>
              {!alert.resolved_at && (
                <button onClick={() => resolveAlert(alert.id)}
                  className="text-xs text-slate-400 hover:text-white border border-slate-700 rounded px-3 py-1 whitespace-nowrap transition-colors">
                  Resolve
                </button>
              )}
              {alert.resolved_at && (
                <span className="text-xs text-green-500 whitespace-nowrap">Resolved</span>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "rules" && (
        <div className="space-y-3">
          {rules.length === 0 && (
            <div className="glass rounded-xl p-8 text-center text-slate-500">No alert rules configured.</div>
          )}
          {rules.map(rule => (
            <div key={rule.id} className="glass rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-white font-medium">{rule.name}</p>
                <p className="text-slate-400 text-sm">
                  {rule.metric.replace(/_/g, " ")} {rule.operator} {rule.threshold}
                </p>
                {rule.notification_email && (
                  <p className="text-slate-600 text-xs">→ {rule.notification_email}</p>
                )}
              </div>
              <button onClick={() => toggleRule(rule.id, rule.is_active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rule.is_active ? "bg-brand" : "bg-slate-700"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rule.is_active ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
