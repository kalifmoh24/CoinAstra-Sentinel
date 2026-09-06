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
          950: "#05070d",
          900: "#0a0e17",
          800: "#111827",
          700: "#1a2234",
          600: "#243049",
        },
        accent: {
          DEFAULT: "#3b82f6",
          cyan: "#22d3ee",
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
        glow: "0 0 40px rgba(59, 130, 246, 0.15)",
        "glow-cyan": "0 0 40px rgba(34, 211, 238, 0.12)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
    },
  },
  plugins: [],
};

export default config;
