import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dgg: {
          bg: "#0f0b14",
          surface: "#1a1520",
          border: "#2e2438",
          muted: "#a1a1aa",
          "muted-dim": "#71717a",
          lime: "#a855f7",
          "lime-bright": "#c084fc",
          yellow: "#a78bfa",
          "yellow-dark": "#8b5cf6",
          nailed: "#a78bfa",
          "nailed-bright": "#c4b5fd",
          failed: "#e11d48",
          "failed-bright": "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Bebas Neue", "Oswald", "sans-serif"],
      },
      backgroundImage: {
        "stripes-diagonal":
          "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(167, 139, 250, 0.12) 8px, rgba(167, 139, 250, 0.12) 10px)",
        "stripes-dgg":
          "repeating-linear-gradient(-45deg, #8b5cf6 0px, #8b5cf6 12px, #a78bfa 12px, #a78bfa 24px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
