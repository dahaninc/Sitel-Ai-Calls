"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard",           label: "Overview",   icon: "▣" },
  { href: "/dashboard/calls",     label: "Call Logs",  icon: "◎" },
  { href: "/dashboard/analytics", label: "Analytics",  icon: "◈" },
  { href: "/dashboard/alerts",    label: "Alerts",     icon: "◉" },
  { href: "/dashboard/settings",  label: "Settings",   icon: "◌" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, position: "fixed", height: "100vh",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        background: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#f5f5f7", letterSpacing: "-0.02em" }}>Sitel AI</span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(item => {
            const active = path === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: active ? 500 : 400,
                transition: "background 0.15s, color 0.15s",
                background: active ? "rgba(255,255,255,0.08)" : "transparent",
                color: active ? "#f5f5f7" : "#86868b",
              }}>
                <span style={{ fontSize: 13, opacity: 0.7 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>A</div>
            <div>
              <div style={{ fontSize: 13, color: "#f5f5f7", fontWeight: 500 }}>Demo Client</div>
              <div style={{ fontSize: 11, color: "#515154" }}>Growth Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh", background: "#000" }}>
        {children}
      </main>
    </div>
  );
}
