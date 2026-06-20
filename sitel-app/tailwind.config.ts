import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          black:  "#000000",
          dark:   "#111111",
          card:   "#1d1d1f",
          text:   "#f5f5f7",
          muted:  "#86868b",
          dim:    "#515154",
          blue:   "#0071e3",
          green:  "#30d158",
          border: "rgba(255,255,255,0.08)",
        },
        brand: {
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
        },
        navy: {
          900: "#0a0f1e",
          800: "#0f172a",
          700: "#1e293b",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "system-ui", "sans-serif"],
      },
      animation: {
        "wave": "wave 1.4s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { height: "6px", opacity: "0.4" },
          "50%":      { height: "28px", opacity: "1" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.5" },
          "50%":      { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
