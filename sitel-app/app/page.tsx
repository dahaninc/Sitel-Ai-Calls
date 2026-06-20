"use client";
import { useState, useEffect, useRef } from "react";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE || "+44 20 7946 0000";

// ─── Utilities ────────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-navy-900/95 backdrop-blur-md border-b border-white/5" : ""
    )}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Sitel AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#roi" className="hover:text-white transition-colors">ROI Calculator</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
            Client login
          </a>
          <a href="#contact"
            className="text-sm bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Book a demo
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── Voice Waveform ───────────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1 h-10">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={cn("wave-bar transition-all duration-300", !active && "!h-1 !opacity-20")}
          style={{ animationPlayState: active ? "running" : "paused" }}
        />
      ))}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [calling, setCalling] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-slate-300 mb-8">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Demo live — call right now
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
          AI Voice Support<br />
          <span className="gradient-text">That Sounds Human.</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          Replace your Tier-1 call centre agents with AI that handles order tracking, returns, and complaints — 24/7, for a fraction of the cost.
        </p>

        <p className="text-base text-slate-500 mb-12">
          Average client deflects <span className="text-white font-semibold">68% of inbound calls</span> automatically. Live in 7 days.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => { setCalling(true); setTimeout(() => setCalling(false), 8000); }}
            className="group flex items-center gap-3 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 glow-blue"
          >
            <span className="text-2xl">📞</span>
            Call the Demo: {DEMO_PHONE}
          </button>
          <a href="#roi"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
            Calculate your ROI →
          </a>
        </div>

        {/* Live call indicator */}
        <div className={cn(
          "flex items-center justify-center gap-4 transition-all duration-500",
          calling ? "opacity-100" : "opacity-40"
        )}>
          <span className="text-slate-400 text-sm">Aria is listening</span>
          <Waveform active={calling} />
          <span className="text-slate-400 text-sm">Try: "Where is my order?"</span>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: "68%", label: "Average call deflection" },
    { value: "< 400ms", label: "AI response time" },
    { value: "£2.4M", label: "Saved for clients" },
    { value: "99.5%", label: "Uptime SLA" },
    { value: "7 days", label: "Average go-live" },
  ];
  return (
    <section className="border-y border-white/5 bg-white/2">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-5 gap-8">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <div className="text-2xl md:text-3xl font-black gradient-text mb-1">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────
function Problem() {
  const pains = [
    { emoji: "😤", text: "Customers waiting 20+ minutes on hold — leaving Trustpilot 1-stars" },
    { emoji: "💸", text: "Each agent costs £28,000–£37,000/year including NI, pension, and churn" },
    { emoji: "📈", text: "Call volume spikes at peak crush the team — Black Friday is a nightmare" },
    { emoji: "🔄", text: "60–70% of calls are identical: 'where's my order?' and 'I want a refund'" },
    { emoji: "😞", text: "Agents burn out on repetitive calls — average tenure is 14 months" },
  ];
  return (
    <section className="py-24 max-w-5xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Your support team is drowning.</h2>
        <p className="text-xl text-slate-400">And it's not their fault. The problem is the call volume.</p>
      </div>
      <div className="space-y-4">
        {pains.map(p => (
          <div key={p.text} className="glass rounded-xl p-5 flex items-start gap-4">
            <span className="text-2xl">{p.emoji}</span>
            <p className="text-slate-300 text-lg">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      step: "01", title: "We build Aria — your branded AI agent",
      desc: "We write the full dialogue tree for your specific call flows — your products, your policies, your tone. Not a generic bot. Your agent.",
      icon: "🎙️",
    },
    {
      step: "02", title: "Connected to your phone line in 48 hours",
      desc: "Aria sits on your existing number (or a new one). We integrate with Shopify, Gorgias, Zendesk, or any CRM via API so she has live order data.",
      icon: "🔌",
    },
    {
      step: "03", title: "Live in 7 days. Handles calls 24/7.",
      desc: "She answers within 1 ring, day or night, never calls in sick, and handles your peak volume without hiring a single extra person.",
      icon: "⚡",
    },
    {
      step: "04", title: "You see everything in the dashboard",
      desc: "Every call logged, transcribed, and analysed. Deflection rate, sentiment trends, top call reasons, churn risk alerts. All in real time.",
      icon: "📊",
    },
  ];
  return (
    <section id="how-it-works" className="py-24 bg-navy-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">How it works</h2>
          <p className="text-xl text-slate-400">From zero to AI-powered support in one week.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map(s => (
            <div key={s.step} className="glass rounded-2xl p-8 relative overflow-hidden group hover:border-brand-600/30 transition-all duration-300">
              <div className="absolute top-4 right-4 text-5xl font-black text-white/5 group-hover:text-white/10 transition-all">{s.step}</div>
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Demo Scenarios ───────────────────────────────────────────────────────────
function DemoScenarios() {
  const [active, setActive] = useState(0);
  const scenarios = [
    {
      trigger: "\"Where is my order?\"",
      response: "Of course! Can I take your order number — it starts with #UK and has six digits? … Thank you, James. I can see your order #UK100234 — your Nike Air Max 90s were dispatched yesterday with DPD, tracking reference JD000292812GB, and they're due to arrive today by 6pm.",
      intent: "Order Status", time: "38 seconds", resolved: true,
    },
    {
      trigger: "\"I want to return this — it's not right\"",
      response: "I'm sorry to hear that. I've pulled up your order — the Linen Blazer in Navy, Size 12, delivered on the 15th. That's well within our return window. I'll generate a free returns label now and email it to you. You can drop it at any DPD point. Once we receive it, your refund will be back in 5 to 7 working days. Does that work?",
      intent: "Return Request", time: "52 seconds", resolved: true,
    },
    {
      trigger: "\"This is absolutely disgusting, I've been waiting three weeks\"",
      response: "I'm really sorry — that's completely unacceptable and I absolutely understand your frustration. Three weeks is far too long and this isn't the standard we aim for. Can I take your order number so I can pull this up right now and get it sorted for you today?",
      intent: "Complaint", time: "1m 20s", resolved: true,
    },
    {
      trigger: "\"I need to speak to a real person\"",
      response: "Of course — I'll connect you to one of the team right now. Before I transfer you, can I take your name so they have everything they need? … Thank you, Emma. Please hold — I'm passing you over now along with a summary of your query.",
      intent: "Escalation", time: "15 seconds", resolved: false,
    },
  ];

  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Hear it in action</h2>
        <p className="text-xl text-slate-400">Real call scenarios. Real responses. No script reading.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {scenarios.map((s, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={cn(
              "text-left p-4 rounded-xl border transition-all duration-200 text-sm",
              active === i
                ? "border-brand-600 bg-brand-600/10 text-white"
                : "border-white/10 glass text-slate-400 hover:border-white/20"
            )}>
            <div className="font-medium mb-1">{s.intent}</div>
            <div className="text-xs opacity-70">{s.trigger}</div>
          </button>
        ))}
        <a href={`tel:${DEMO_PHONE}`}
          className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-brand-600/50 text-brand-400 text-sm hover:bg-brand-600/10 transition-all">
          📞 Try it live
        </a>
      </div>
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
          <div>
            <div className="text-white font-semibold">Aria</div>
            <div className="text-xs text-slate-500">Sitel AI Agent</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-slate-500">{scenarios[active].time}</span>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              scenarios[active].resolved
                ? "bg-green-500/20 text-green-400"
                : "bg-blue-500/20 text-blue-400"
            )}>
              {scenarios[active].resolved ? "✓ AI resolved" : "→ Transferred"}
            </span>
          </div>
        </div>
        <div className="bg-navy-900/50 rounded-xl p-5 mb-4">
          <p className="text-slate-500 text-sm mb-3">Customer said:</p>
          <p className="text-white font-medium text-lg">{scenarios[active].trigger}</p>
        </div>
        <div className="flex items-start gap-3">
          <Waveform active={true} />
          <p className="text-slate-300 leading-relaxed flex-1">{scenarios[active].response}</p>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    {
      name: "Starter", setup: "£5,000", monthly: "£1,800", calls: "1,000",
      overage: "£0.10/min", highlight: false,
      features: ["1 use case (order tracking OR returns)", "1 UK phone number", "Shopify integration", "Call transcripts", "Monthly report", "Email support"],
      roi: "Replaces 1 agent. Payback in ~10 weeks.",
    },
    {
      name: "Growth", setup: "£8,000", monthly: "£3,400", calls: "3,000",
      overage: "£0.08/min", highlight: true,
      features: ["3 use cases (tracking + returns + complaints)", "Full CRM integration", "2 UK phone numbers", "Custom webhook triggers", "Bi-weekly review call", "Dedicated account manager"],
      roi: "Replaces 1.5–2 agents. Payback in ~4 weeks.",
    },
    {
      name: "Scale", setup: "£15,000", monthly: "£6,500", calls: "8,000",
      overage: "£0.06/min", highlight: false,
      features: ["Unlimited use cases", "Full telephony setup / port existing number", "Multi-CRM integration", "Real-time dashboard", "Agent assist mode", "Multi-language support"],
      roi: "Replaces 4–6 agents. Payback in < 1 month.",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-navy-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Simple pricing. Real ROI.</h2>
          <p className="text-xl text-slate-400">A single UK agent costs £30K–£37K/year. Our Growth plan is £40,800. And it handles 3× the volume.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map(t => (
            <div key={t.name} className={cn(
              "rounded-2xl p-8 flex flex-col relative overflow-hidden",
              t.highlight
                ? "bg-gradient-to-b from-brand-600/20 to-purple-600/10 border border-brand-600/40"
                : "glass"
            )}>
              {t.highlight && (
                <div className="absolute top-4 right-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4">{t.name}</h3>
                <div className="text-4xl font-black text-white">{t.monthly}<span className="text-lg font-normal text-slate-400">/mo</span></div>
                <div className="text-slate-500 text-sm mt-1">{t.setup} setup · {t.calls} calls included</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-brand-400 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-6">
                <p className="text-green-400 text-sm font-medium">💰 {t.roi}</p>
              </div>
              <a href="#contact"
                className={cn(
                  "text-center py-3 rounded-xl font-semibold transition-all",
                  t.highlight
                    ? "bg-brand-600 hover:bg-brand-700 text-white"
                    : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                )}>
                Get started
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-8">
          Not sure which tier? Call the demo first: <span className="text-white">{DEMO_PHONE}</span>
        </p>
      </div>
    </section>
  );
}

// ─── ROI Calculator ───────────────────────────────────────────────────────────
function ROICalculator() {
  const [agents, setAgents] = useState(3);
  const [salary, setSalary] = useState(26000);
  const [tier, setTier] = useState<"starter" | "growth" | "scale">("growth");

  const tierCosts = { starter: { setup: 5000, monthly: 1800 }, growth: { setup: 8000, monthly: 3400 }, scale: { setup: 15000, monthly: 6500 } };
  const selected = tierCosts[tier];

  const annualAgentCost = agents * salary * 1.168; // salary + NI + pension
  const agentsRemaining = Math.max(1, Math.ceil(agents * 0.3)); // keep 30% for escalations
  const newAnnualCost = agentsRemaining * salary * 1.168 + selected.monthly * 12;
  const annualSaving = annualAgentCost - newAnnualCost;
  const paybackWeeks = Math.ceil((selected.setup / (annualSaving / 52)));

  return (
    <section id="roi" className="py-24 max-w-5xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Calculate your savings</h2>
        <p className="text-xl text-slate-400">Drag the sliders. See your number.</p>
      </div>
      <div className="glass rounded-2xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Inputs */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-white font-semibold">Customer service agents</label>
                <span className="text-brand-400 font-bold text-xl">{agents}</span>
              </div>
              <input type="range" min={1} max={20} value={agents} onChange={e => setAgents(+e.target.value)}
                className="w-full accent-blue-500" />
              <div className="flex justify-between text-xs text-slate-500 mt-1"><span>1</span><span>20</span></div>
            </div>
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-white font-semibold">Average salary</label>
                <span className="text-brand-400 font-bold text-xl">£{salary.toLocaleString()}</span>
              </div>
              <input type="range" min={18000} max={45000} step={500} value={salary} onChange={e => setSalary(+e.target.value)}
                className="w-full accent-blue-500" />
              <div className="flex justify-between text-xs text-slate-500 mt-1"><span>£18k</span><span>£45k</span></div>
            </div>
            <div>
              <label className="text-white font-semibold block mb-3">Sitel AI plan</label>
              <div className="grid grid-cols-3 gap-2">
                {(["starter", "growth", "scale"] as const).map(t => (
                  <button key={t} onClick={() => setTier(t)}
                    className={cn(
                      "py-2 rounded-lg text-sm font-medium transition-all capitalize",
                      tier === t ? "bg-brand-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
                    )}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="bg-navy-900/50 rounded-xl p-6">
              <div className="text-slate-500 text-sm mb-1">Current annual cost</div>
              <div className="text-3xl font-black text-white">£{Math.round(annualAgentCost).toLocaleString()}</div>
              <div className="text-slate-600 text-xs mt-1">{agents} agents × £{salary.toLocaleString()} + employer costs</div>
            </div>
            <div className="bg-navy-900/50 rounded-xl p-6">
              <div className="text-slate-500 text-sm mb-1">With Sitel AI</div>
              <div className="text-3xl font-black text-white">£{Math.round(newAnnualCost).toLocaleString()}</div>
              <div className="text-slate-600 text-xs mt-1">{agentsRemaining} human agent{agentsRemaining > 1 ? "s" : ""} + {tier} plan</div>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-brand-600/20 border border-green-500/30 rounded-xl p-6">
              <div className="text-green-400 text-sm mb-1 font-medium">Annual saving</div>
              <div className="text-4xl font-black text-green-400">
                £{Math.round(Math.max(0, annualSaving)).toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm mt-2">
                Setup fee paid back in <span className="text-white font-bold">{paybackWeeks} weeks</span>
              </div>
            </div>
            <a href="#contact"
              className="text-center bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-semibold transition-all">
              Get your custom quote →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Objections / FAQ ─────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "What if the AI gets it wrong?", a: "The agent only does what it's explicitly instructed to do — it never guesses. If something is outside its scope, it escalates immediately. And when something goes wrong, we fix the prompt permanently. Your human agents can make the same error 1,000 times. The AI makes it once." },
    { q: "Will our customers know they're talking to AI?", a: "Yes — we disclose at the start of every call as required by UK law. But experience shows customers care about speed and resolution, not who answered. In blind tests, a significant proportion can't tell the difference. And any customer who wants a human gets one instantly." },
    { q: "How long does it take to go live?", a: "7 working days from the onboarding call. We build the agent, connect your phone line, run internal testing, and soft-launch it alongside your human team before full deployment." },
    { q: "What about GDPR and call recording?", a: "We handle it. AI disclosure script, call recording consent language, Data Processing Agreement, ICO registration — all covered. We provide the template language for your privacy policy and the DPA for your contract with us." },
    { q: "What if it can't handle a call?", a: "Any call the agent can't confidently resolve — or where the customer asks for a human — is transferred within 5 seconds, with a summary of the conversation so your agent doesn't start from zero." },
    { q: "Can we try before we buy?", a: "Call the demo right now: " + DEMO_PHONE + ". That answers the question of whether the technology works. For a full pilot specific to your business, we require a 3-month contract — with a guarantee: if deflection doesn't reach 50% by Day 60, we waive Month 3." },
  ];
  return (
    <section id="faq" className="py-24 max-w-3xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Every question, answered.</h2>
      </div>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="glass rounded-xl overflow-hidden">
            <button className="w-full text-left p-6 flex items-center justify-between gap-4" onClick={() => setOpen(open === i ? null : i)}>
              <span className="text-white font-semibold">{f.q}</span>
              <span className={cn("text-slate-400 transition-transform duration-200 text-xl", open === i && "rotate-45")}>+</span>
            </button>
            {open === i && (
              <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-white/5 pt-4">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA / Contact ────────────────────────────────────────────────────────────
function CTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-transparent to-navy-800/50">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Ready to stop drowning in calls?</h2>
        <p className="text-xl text-slate-400 mb-12">Call the demo, then book 20 minutes with us. We'll show you exactly what Aria would handle for your brand.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a href={`tel:${DEMO_PHONE}`}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-brand-600/50 text-white px-8 py-4 rounded-xl font-semibold transition-all">
            📞 Call demo: {DEMO_PHONE}
          </a>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
            <p className="text-white font-semibold mb-6">Or leave your email — we'll reach out within 2 hours.</p>
            <div className="flex gap-3">
              <input
                type="email" required placeholder="your@company.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 outline-none focus:border-brand-600/50 transition-all"
              />
              <button type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap">
                Book a call →
              </button>
            </div>
          </form>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold text-xl">We'll be in touch within 2 hours.</p>
            <p className="text-slate-400 mt-2">In the meantime — call the demo: {DEMO_PHONE}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-white font-semibold">Sitel AI</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">GDPR</a>
          <span>© 2026 Sitel AI Ltd.</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="min-h-screen bg-navy-900">
      <Nav />
      <Hero />
      <StatsBar />
      <Problem />
      <HowItWorks />
      <DemoScenarios />
      <Pricing />
      <ROICalculator />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
