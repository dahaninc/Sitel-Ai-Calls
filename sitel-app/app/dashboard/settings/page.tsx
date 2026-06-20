"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Client = {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  tier: string;
  monthly_fee: number;
  setup_fee_paid: number;
  contract_start_date: string;
  retell_agent_id: string | null;
  twilio_phone_number: string | null;
  crm_type: string | null;
  status: string;
};

const TIER_LABELS: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  scale: "Scale",
};

export default function SettingsPage() {
  const supabase = createClient();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("clients").select("*").eq("dashboard_user_id", user.id).single();
      if (data) {
        setClient(data as Client);
        setContactName(data.contact_name);
        setContactEmail(data.contact_email);
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function handleSave() {
    if (!client) return;
    await supabase.from("clients").update({ contact_name: contactName, contact_email: contactEmail }).eq("id", client.id);
    setClient(c => c ? { ...c, contact_name: contactName, contact_email: contactEmail } : c);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <div className="p-8 text-slate-500 animate-pulse">Loading settings...</div>;
  if (!client) return <div className="p-8 text-slate-500">No account found.</div>;

  const contractStart = new Date(client.contract_start_date);
  const monthsActive = Math.floor((Date.now() - contractStart.getTime()) / (1000 * 60 * 60 * 24 * 30));

  return (
    <div className="p-8 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Account and integration details</p>
      </div>

      {/* Account info */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Account</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 mb-1">Company</p>
            <p className="text-white font-medium">{client.company_name}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Plan</p>
            <p className="text-white font-medium">{TIER_LABELS[client.tier] ?? client.tier}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Monthly fee</p>
            <p className="text-white font-medium">£{client.monthly_fee.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Contract start</p>
            <p className="text-white font-medium">{contractStart.toLocaleDateString("en-GB")} ({monthsActive}mo)</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Status</p>
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${client.status === "active" ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`}>
              {client.status}
            </span>
          </div>
        </div>
      </div>

      {/* Contact details (editable) */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Contact details</h2>
        <div className="space-y-3">
          <div>
            <label className="text-slate-400 text-sm block mb-1">Name</label>
            <input value={contactName} onChange={e => setContactName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand" />
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Email</label>
            <input value={contactEmail} onChange={e => setContactEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand" />
          </div>
        </div>
        <button onClick={handleSave}
          className="px-4 py-2 bg-brand hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>

      {/* Integrations (read-only) */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Integrations</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-400">Retell AI Agent ID</span>
            <code className="text-white bg-slate-800 px-2 py-1 rounded text-xs">{client.retell_agent_id ?? "—"}</code>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-800">
            <span className="text-slate-400">Phone number</span>
            <code className="text-white bg-slate-800 px-2 py-1 rounded text-xs">{client.twilio_phone_number ?? "—"}</code>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-400">CRM type</span>
            <code className="text-white bg-slate-800 px-2 py-1 rounded text-xs">{client.crm_type ?? "—"}</code>
          </div>
        </div>
        <p className="text-slate-600 text-xs">To update integration settings, contact your Sitel AI account manager.</p>
      </div>
    </div>
  );
}
