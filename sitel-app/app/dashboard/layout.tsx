"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard",           label: "Overview",   icon: "📊" },
  { href: "/dashboard/calls",     label: "Call Logs",  icon: "📞" },
  { href: "/dashboard/analytics", label: "Analytics",  icon: "📈" },
  { href: "/dashboard/alerts",    label: "Alerts",     icon: "🔔" },
  { href: "/dashboard/settings",  label: "Settings",   icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen bg-navy-900 flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-white/5 flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-white font-semibold">Sitel AI</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                path === item.href
                  ? "bg-brand-600/20 text-brand-400 border border-brand-600/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div>
              <div className="text-white text-sm font-medium">Demo Client</div>
              <div className="text-slate-500 text-xs">Growth Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
}
