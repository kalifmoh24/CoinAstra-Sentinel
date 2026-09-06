import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#030712",
          900: "#07101F",
          850: "#0A1222",
          800: "#0D1728",
          700: "#1a2234",
          600: "#243049",
        },
        accent: {
          DEFAULT: "#a855f7",
          violet: "#8b5cf6",
          purple: "#c084fc",
          cyan: "#a78bfa",
          emerald: "#34d399",
          amber: "#fbbf24",
          orange: "#fb923c",
          rose: "#f43f5e",
        },
        risk: {
          "very-low": "#34d399",
          low: "#6ee7b7",
          moderate: "#fbbf24",
          high: "#fb923c",
          critical: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(168, 85, 247, 0.18)",
        "glow-cyan": "0 0 40px rgba(168, 85, 247, 0.14)",
        "glow-purple": "0 0 48px rgba(139, 92, 246, 0.22)",
        card: "0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "purple-cta": "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      width: {
        sidebar: "220px",
      },
    },
  },
  plugins: [],
};

export default config;
