"use client";
/**
 * Login Page
 * Uses Supabase magic link (email OTP) — no password to forget.
 * After verification, middleware lets the user through to /dashboard.
 */
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        shouldCreateUser: false, // Only allow existing clients to log in
      },
    });

    if (error) {
      setError("Couldn't send a link to that email. Please check with your Sitel AI account manager.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        {/* Logo */}
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#f5f5f7", letterSpacing: "-0.02em" }}>Sitel AI</span>
          <p style={{ fontSize: 14, color: "#86868b", marginTop: 6 }}>Client Portal</p>
        </div>

        {!sent ? (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "40px 32px" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f5f5f7", marginBottom: 8, letterSpacing: "-0.02em" }}>Sign in</h1>
            <p style={{ fontSize: 14, color: "#86868b", marginBottom: 32 }}>We&apos;ll send a secure link to your email.</p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  padding: "14px 16px", background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                  color: "#f5f5f7", fontSize: 15, outline: "none",
                }}
              />
              {error && <p style={{ fontSize: 13, color: "#ff453a", textAlign: "left" }}>{error}</p>}
              <button type="submit" disabled={loading}
                style={{
                  padding: "14px", background: loading ? "rgba(0,113,227,0.5)" : "#0071e3",
                  border: "none", borderRadius: 12, color: "white",
                  fontSize: 15, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}>
                {loading ? "Sending…" : "Send sign-in link →"}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: "rgba(48,209,88,0.08)", border: "1px solid rgba(48,209,88,0.2)", borderRadius: 20, padding: "40px 32px" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f5f5f7", marginBottom: 8 }}>Check your email</h2>
            <p style={{ fontSize: 14, color: "#86868b" }}>We&apos;ve sent a secure sign-in link to <strong style={{ color: "#f5f5f7" }}>{email}</strong>. Click it to access your dashboard.</p>
            <button onClick={() => setSent(false)} style={{ marginTop: 24, fontSize: 13, color: "#86868b", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Use a different email
            </button>
          </div>
        )}

        <p style={{ marginTop: 32, fontSize: 13, color: "#515154" }}>
          Not a client yet?{" "}
          <a href="/#contact" style={{ color: "#0071e3", textDecoration: "none" }}>Book a demo →</a>
        </p>
      </div>
    </div>
  );
}
