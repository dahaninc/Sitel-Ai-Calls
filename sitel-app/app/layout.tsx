import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sitel AI — AI Voice Support for eCommerce & SaaS",
  description:
    "Replace Tier-1 call centre agents with AI that sounds human, works 24/7, and costs less than one hire. Live in 7 days.",
  keywords: "AI call centre, voice AI, customer support automation, ecommerce AI, call deflection",
  openGraph: {
    title: "Sitel AI — AI Voice Support",
    description: "Replace Tier-1 call centre agents with AI. 70% call deflection. Live in 7 days.",
    type: "website",
    url: "https://sitel-ai.vercel.app",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
