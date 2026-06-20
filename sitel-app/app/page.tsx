"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const DEMO_PHONE = process.env.NEXT_PUBLIC_DEMO_PHONE || "+44 20 7946 0000";

// ── Scroll reveal hook ──────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Waveform ────────────────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{
            animationPlayState: active ? "running" : "paused",
            height: active ? undefined : "4px",
            opacity: active ? undefined : 0.2,
            transition: "height 0.3s, opacity 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#f5f5f7", letterSpacing: "-0.02em" }}>Sitel AI</span>
        <div style={{ display: "flex", gap: 32, fontSize: 14, color: "#86868b" }} className="hidden md:flex">
          {[["How it works","#how-it-works"],["Pricing","#pricing"],["ROI","#roi"],["FAQ","#faq"]].map(([l,h]) => (
            <a key={l} href={h} style={{ color: "#86868b", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e=>(e.currentTarget.style.color="#f5f5f7")}
              onMouseLeave={e=>(e.currentTarget.style.color="#86868b")}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/dashboard" style={{ fontSize: 14, color: "#86868b", textDecoration: "none" }}>Client login</a>
          <a href="#contact" className="btn-primary" style={{ padding: "8px 18px", fontSize: 14 }}>Book a demo</a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const [calling, setCalling] = useState(false);
  const handleCall = useCallback(() => {
    setCalling(true);
    setTimeout(() => setCalling(false), 8000);
  }, []);

  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(0,113,227,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Live badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 980, padding: "6px 16px", fontSize: 13, color: "#86868b", marginBottom: 32 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#30d158", display: "inline-block", animation: "glowPulse 2s ease-in-out infinite" }} />
        Live demo available — call now
      </div>

      {/* Headline */}
      <h1 className="headline-xl" style={{ maxWidth: 900, marginBottom: 24 }}>
        The AI that answers<br />
        <span className="gradient-text">every call.</span>
      </h1>

      <p className="body-lg" style={{ maxWidth: 580, marginBottom: 48 }}>
        Shopify brands use Sitel AI to handle order tracking, returns, and complaints automatically — 24/7, under a second response, live in 7 days.
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 56 }}>
        <button onClick={handleCall} className="btn-primary" style={{ fontSize: 17, padding: "16px 32px" }}>
          📞 {calling ? "Aria is listening…" : `Call the demo: ${DEMO_PHONE}`}
        </button>
        <a href="#roi" className="btn-secondary" style={{ fontSize: 17, padding: "16px 32px" }}>
          Calculate your ROI →
        </a>
      </div>

      {/* Waveform */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: calling ? 1 : 0.3, transition: "opacity 0.5s" }}>
        <span style={{ fontSize: 13, color: "#86868b" }}>Aria is listening</span>
        <Waveform active={calling} />
        <span style={{ fontSize: 13, color: "#86868b" }}>Try: &quot;Where is my order?&quot;</span>
      </div>
    </section>
  );
}

// ── Stats ───────────────────────────────────────────────────────────────────
function Stats() {
  const ref = useReveal();
  const stats = [
    { n: "68%",    l: "Average call deflection" },
    { n: "< 1s",   l: "AI response time" },
    { n: "7 days", l: "Average go-live" },
    { n: "24/7",   l: "No hold times, ever" },
  ];
  return (
    <section ref={ref} className="reveal" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 40 }}>
        {stats.map(s => (
          <div key={s.n} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#f5f5f7", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 14, color: "#86868b", marginTop: 8 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Problem ──────────────────────────────────────────────────────────────────
function Problem() {
  const ref = useReveal();
  const pains = [
    { icon: "📞", title: "60–75% of calls are 'where's my order?'", body: "Repetitive, predictable, and completely automatable. Your team is spending most of their day on this." },
    { icon: "💸", title: "Each CS agent costs £28k–£37k/year", body: "Plus NI, pension, equipment, training, and 14-month average tenure before they leave." },
    { icon: "📈", title: "Volume spikes without warning", body: "Black Friday. A viral post. A delayed batch. Your team can't scale overnight. An AI can." },
    { icon: "😞", title: "Customers hang up before they're answered", body: "Every minute on hold is a Trustpilot review waiting to happen. And you know it." },
  ];
  return (
    <section ref={ref} className="reveal" style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#86868b", marginBottom: 16 }}>The problem</p>
          <h2 className="headline-lg">Your support team is overwhelmed.<br />It&apos;s not their fault.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
          {pains.map(p => (
            <div key={p.title} style={{ background: "#000", padding: "40px 32px" }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{p.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f5f5f7", marginBottom: 10, lineHeight: 1.4 }}>{p.title}</h3>
              <p style={{ fontSize: 15, color: "#86868b", lineHeight: 1.6 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const ref = useReveal();
  const steps = [
    { n: "01", title: "We build your AI agent", body: "Custom dialogue trees for your exact call flows — your products, your policies, your tone. Not a generic bot." },
    { n: "02", title: "Connected in 48 hours", body: "We put Aria on your Shopify phone line. Live order data, your CRM, your return policy — all integrated." },
    { n: "03", title: "Go live in 7 days", body: "Answers in under a second, 24/7. Handles your peak volume without hiring a single extra person." },
    { n: "04", title: "You see everything", body: "Every call transcribed, analysed, and surfaced. Churn risk alerts, sentiment trends, top call reasons — real time." },
  ];
  return (
    <section id="how-it-works" ref={ref} className="reveal" style={{ padding: "120px 24px", background: "#0a0a0a" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#86868b", marginBottom: 16 }}>How it works</p>
          <h2 className="headline-lg">From zero to AI support.<br />In one week.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 32 }}>
          {steps.map((s, i) => (
            <div key={s.n} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: 13, color: "#0071e3", fontWeight: 600, marginBottom: 20, letterSpacing: "0.05em" }}>{s.n}</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "#f5f5f7", marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: "#86868b", lineHeight: 1.65 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Demo ─────────────────────────────────────────────────────────────────────
function Demo() {
  const ref = useReveal();
  const [active, setActive] = useState(0);
  const scenarios = [
    {
      label: "Order status",
      caller: "Where is my order?",
      aria: "Of course! Give me your order number — starts with #UK. … Found it. Your Nike Air Max were dispatched yesterday with DPD, reference JD000292812GB, arriving today by 6pm. Anything else?",
      outcome: "AI resolved · 38 seconds",
      sentiment: "positive",
    },
    {
      label: "Return request",
      caller: "I want to return this, it's not right.",
      aria: "I'm sorry to hear that. Can I take your order number and the reason for your return? … Got it. I've raised your return request and you'll receive a prepaid label within 2 hours. Refund in 3–5 days.",
      outcome: "AI resolved · 52 seconds",
      sentiment: "positive",
    },
    {
      label: "Complaint",
      caller: "This is absolutely disgusting, I've been waiting three weeks.",
      aria: "I completely understand your frustration, and I'm so sorry for the wait. Let me pull up your order right now and tell you exactly what's happened — and what we're doing to fix it.",
      outcome: "De-escalated · Transferred to senior agent",
      sentiment: "neutral",
    },
    {
      label: "Escalation",
      caller: "I need to speak to a real person, now.",
      aria: "Of course, I'll transfer you straight away. While you're on hold — which is less than 2 minutes right now — can I take your order number so your agent has everything ready?",
      outcome: "Transferred · 12 seconds",
      sentiment: "neutral",
    },
  ];
  const s = scenarios[active];

  return (
    <section ref={ref} className="reveal" style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#86868b", marginBottom: 16 }}>Hear it in action</p>
          <h2 className="headline-lg">Real scenarios.<br />Real responses.</h2>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {scenarios.map((sc, i) => (
            <button key={sc.label} onClick={() => setActive(i)}
              style={{ padding: "8px 20px", borderRadius: 980, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.2s",
                background: active === i ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                color: active === i ? "#f5f5f7" : "#86868b" }}>
              {sc.label}
            </button>
          ))}
        </div>

        {/* Conversation */}
        <div className="glass" style={{ borderRadius: 20, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white" }}>A</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#f5f5f7" }}>Aria · Sitel AI Agent</div>
              <div style={{ fontSize: 12, color: "#86868b" }}>AI-powered · Live 24/7</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ background: "#0071e3", borderRadius: "18px 18px 4px 18px", padding: "12px 18px", maxWidth: "70%", fontSize: 15, color: "white", lineHeight: 1.5 }}>
                {s.caller}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white" }}>A</div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px 18px 18px 18px", padding: "12px 18px", maxWidth: "75%", fontSize: 15, color: "#f5f5f7", lineHeight: 1.65 }}>
                {s.aria}
              </div>
            </div>
          </div>

          {/* Outcome */}
          <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#30d158", display: "inline-block" }} />
            <span style={{ fontSize: 13, color: "#86868b" }}>{s.outcome}</span>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: "#515154" }}>
          Call the live demo: <a href={`tel:${DEMO_PHONE}`} style={{ color: "#0071e3", textDecoration: "none" }}>{DEMO_PHONE}</a>
        </p>
      </div>
    </section>
  );
}

// ── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const ref = useReveal();
  const tiers = [
    {
      name: "Starter", setup: "£5,000", monthly: "£1,800", calls: "1,000 calls/mo",
      features: ["1 use case", "Shopify integration", "1 UK number", "Call transcripts", "Monthly report"],
      roi: "Replaces 1 agent. Payback ~10 weeks.",
      highlight: false,
    },
    {
      name: "Growth", setup: "£8,000", monthly: "£3,400", calls: "3,000 calls/mo",
      features: ["3 use cases", "Full CRM integration", "2 UK numbers", "Custom webhooks", "Bi-weekly review", "Account manager"],
      roi: "Replaces 1.5–2 agents. Payback ~4 weeks.",
      highlight: true,
    },
    {
      name: "Scale", setup: "£15,000", monthly: "£6,500", calls: "8,000 calls/mo",
      features: ["Unlimited use cases", "Full telephony setup", "Multi-CRM", "Real-time dashboard", "Agent assist", "Multi-language"],
      roi: "Replaces 4–6 agents. Payback < 1 month.",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" ref={ref} className="reveal" style={{ padding: "120px 24px", background: "#0a0a0a" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#86868b", marginBottom: 16 }}>Pricing</p>
          <h2 className="headline-lg">Less than one hire.<br />More than one agent.</h2>
          <p className="body-lg" style={{ marginTop: 16 }}>A UK CS agent costs £30k–£37k/year. Our Growth plan is £40,800. It handles 3× the volume.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {tiers.map(t => (
            <div key={t.name}
              style={{
                borderRadius: 20, padding: "40px 32px", position: "relative",
                background: t.highlight ? "rgba(0,113,227,0.08)" : "rgba(255,255,255,0.03)",
                border: t.highlight ? "1px solid rgba(0,113,227,0.4)" : "1px solid rgba(255,255,255,0.08)",
              }}>
              {t.highlight && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#0071e3", color: "white", fontSize: 12, fontWeight: 600, padding: "4px 16px", borderRadius: 980 }}>
                  Most popular
                </div>
              )}
              <div style={{ fontSize: 14, color: "#86868b", marginBottom: 8 }}>{t.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: "#f5f5f7", letterSpacing: "-0.03em" }}>{t.monthly}</span>
                <span style={{ fontSize: 14, color: "#86868b" }}>/mo</span>
              </div>
              <div style={{ fontSize: 13, color: "#515154", marginBottom: 32 }}>{t.setup} setup · {t.calls}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                {t.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#86868b" }}>
                    <span style={{ color: "#30d158", fontSize: 16 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "#86868b", padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 24 }}>
                💰 {t.roi}
              </div>
              <a href="#contact" className={t.highlight ? "btn-primary" : "btn-secondary"} style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                Get started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ROI Calculator ────────────────────────────────────────────────────────────
function ROI() {
  const ref = useReveal();
  const [agents, setAgents] = useState(3);
  const [salary, setSalary] = useState(26000);
  const [tier, setTier] = useState<"starter"|"growth"|"scale">("growth");

  const tierCosts: Record<string, number> = { starter: 21600+5000, growth: 40800+8000, scale: 78000+15000 };
  const agentTotal = Math.round(agents * salary * 1.175); // +17.5% employer costs
  const sitelCost = tierCosts[tier];
  const saving = agentTotal - (Math.round(salary * 0.175 * 1 + sitelCost)); // keep 1 human agent
  const weeks = Math.round(sitelCost / (saving / 52));

  return (
    <section id="roi" ref={ref} className="reveal" style={{ padding: "120px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#86868b", marginBottom: 16 }}>ROI Calculator</p>
          <h2 className="headline-lg">See your number.</h2>
        </div>

        <div className="glass" style={{ borderRadius: 24, padding: "48px 40px" }}>
          <div style={{ display: "grid", gap: 40 }}>
            {/* Agents slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 15, color: "#f5f5f7" }}>Customer service agents</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#f5f5f7" }}>{agents}</span>
              </div>
              <input type="range" min={1} max={20} value={agents} onChange={e=>setAgents(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#515154", marginTop: 4 }}>
                <span>1</span><span>20</span>
              </div>
            </div>

            {/* Salary slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 15, color: "#f5f5f7" }}>Average salary</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#f5f5f7" }}>£{salary.toLocaleString()}</span>
              </div>
              <input type="range" min={18000} max={45000} step={1000} value={salary} onChange={e=>setSalary(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#515154", marginTop: 4 }}>
                <span>£18k</span><span>£45k</span>
              </div>
            </div>

            {/* Plan selector */}
            <div>
              <span style={{ fontSize: 15, color: "#f5f5f7", display: "block", marginBottom: 12 }}>Sitel AI plan</span>
              <div style={{ display: "flex", gap: 8 }}>
                {(["starter","growth","scale"] as const).map(t => (
                  <button key={t} onClick={()=>setTier(t)}
                    style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid", cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s", textTransform: "capitalize",
                      background: tier===t ? "rgba(0,113,227,0.15)" : "rgba(255,255,255,0.04)",
                      borderColor: tier===t ? "#0071e3" : "rgba(255,255,255,0.08)",
                      color: tier===t ? "#60a5fa" : "#86868b" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ marginTop: 48, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.08)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, textAlign: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: "#86868b", marginBottom: 6 }}>Current annual cost</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#f5f5f7", letterSpacing: "-0.02em" }}>£{agentTotal.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#86868b", marginBottom: 6 }}>Annual saving</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#30d158", letterSpacing: "-0.02em" }}>£{Math.max(0,saving).toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#86868b", marginBottom: 6 }}>Payback period</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#f5f5f7", letterSpacing: "-0.02em" }}>{weeks > 0 && weeks < 200 ? `${weeks}wk` : "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const ref = useReveal();
  const [open, setOpen] = useState<number|null>(null);
  const faqs = [
    { q: "Will our customers know they're talking to AI?", a: "Yes — UK GDPR requires AI disclosure at the start of every call. Aria identifies itself as an AI assistant. In practice, 94% of callers stay on the call and get their query resolved. Customers care about speed and accuracy, not whether it's a human." },
    { q: "What if the AI gets something wrong?", a: "Aria is trained on your specific product catalogue, policies, and FAQs before going live. For anything outside its confidence threshold, it escalates to your team instantly with a full transcript so the agent is briefed immediately." },
    { q: "How long does setup actually take?", a: "7 days for Starter and Growth. Day 1–2: we build the dialogue tree. Day 3–4: Shopify integration and test calls. Day 5–6: soft launch with monitoring. Day 7: full handover." },
    { q: "What about GDPR and call recording?", a: "Every call begins with an AI disclosure and recording consent. We provide a full Data Processing Agreement, store data on UK/EU servers, and can provide an ICO registration checklist. Compliant out of the box." },
    { q: "Can we try before committing?", a: "Call +44 20 7946 0000 right now — that's a live Aria demo. We also offer a 30-day pilot on the Starter plan where you can terminate if the deflection rate doesn't meet the agreed target." },
    { q: "What happens to calls Aria can't handle?", a: "Aria transfers to your team in under 3 seconds with a live transcript. Your agent picks up already knowing the customer's name, order number, and the reason they called. Average human handle time drops 40%." },
  ];

  return (
    <section id="faq" ref={ref} className="reveal" style={{ padding: "120px 24px", background: "#0a0a0a" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#86868b", marginBottom: 16 }}>FAQ</p>
          <h2 className="headline-lg">Every question,<br />answered.</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <button onClick={() => setOpen(open===i ? null : i)}
                style={{ width: "100%", padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}>
                <span style={{ fontSize: 17, fontWeight: 500, color: "#f5f5f7" }}>{f.q}</span>
                <span style={{ fontSize: 24, color: "#86868b", flexShrink: 0, transition: "transform 0.3s", transform: open===i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </button>
              <div style={{ maxHeight: open===i ? 400 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
                <p style={{ fontSize: 15, color: "#86868b", lineHeight: 1.7, paddingBottom: 24 }}>{f.a}</p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  const ref = useReveal();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" ref={ref} className="reveal" style={{ padding: "140px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h2 className="headline-lg" style={{ marginBottom: 20 }}>Ready to stop<br />drowning in calls?</h2>
        <p className="body-lg" style={{ marginBottom: 48 }}>
          Call the demo, then book 20 minutes with us. We&apos;ll show you exactly what Aria would handle for your brand.
        </p>
        <a href={`tel:${DEMO_PHONE}`} className="btn-primary" style={{ fontSize: 18, padding: "18px 40px", marginBottom: 40, display: "inline-flex" }}>
          📞 Call demo: {DEMO_PHONE}
        </a>
        <p style={{ fontSize: 14, color: "#515154", marginBottom: 24 }}>Or leave your email — we&apos;ll reach out within 2 hours.</p>
        {!sent ? (
          <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: "flex", gap: 12, maxWidth: 420, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ flex: 1, minWidth: 220, padding: "14px 18px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#f5f5f7", fontSize: 15, outline: "none" }} />
            <button type="submit" className="btn-primary" style={{ padding: "14px 24px" }}>Book a call →</button>
          </form>
        ) : (
          <p style={{ color: "#30d158", fontSize: 16 }}>✓ We&apos;ll be in touch within 2 hours.</p>
        )}
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#f5f5f7" }}>Sitel AI</span>
        <div style={{ display: "flex", gap: 32, fontSize: 13, color: "#515154" }}>
          <a href="#" style={{ color: "#515154", textDecoration: "none" }}>Privacy</a>
          <a href="#" style={{ color: "#515154", textDecoration: "none" }}>Terms</a>
          <a href="#" style={{ color: "#515154", textDecoration: "none" }}>GDPR</a>
          <a href="/dashboard" style={{ color: "#515154", textDecoration: "none" }}>Client portal</a>
        </div>
        <span style={{ fontSize: 13, color: "#515154" }}>© 2026 Sitel AI Ltd.</span>
      </div>
    </footer>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function Page() {
  // Wire up all .reveal elements after mount
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Problem />
        <HowItWorks />
        <Demo />
        <Pricing />
        <ROI />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
