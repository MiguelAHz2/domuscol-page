import type { Config } from "tailwindcss";

// Colors resolve to CSS variables (RGB channels) defined in globals.css,
// so every token has a light and a dark value and supports /opacity.
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      // Classic typographic scale: 12 · 14 · 16 · 18 · 21 · 24 · 36 · 48 · 60
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.55" }],
        base: ["1rem", { lineHeight: "1.65" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        xl: ["1.3125rem", { lineHeight: "1.4" }],
        "2xl": ["1.5rem", { lineHeight: "1.3" }],
        "4xl": ["2.25rem", { lineHeight: "1.12", letterSpacing: "-0.025em" }],
        "5xl": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "6xl": ["3.75rem", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
      },
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        "surface-2": token("surface-2"),
        ink: token("ink"),
        body: token("body"),
        muted: token("muted"),
        line: token("line"),
        cobalt: token("cobalt"),
        emerald: token("emerald"),
        "emerald-ink": token("emerald-ink"),
        amber: token("amber"),
        danger: token("danger"),
        navy: {
          DEFAULT: token("navy"),
          deep: token("navy-deep"),
          raised: token("navy-raised"),
        },
        window: token("window"),
        band: token("band"),
      },
      maxWidth: {
        page: "75rem",
      },
      boxShadow: {
        float: "0 30px 60px -20px rgb(4 12 26 / 0.55), 0 12px 24px -12px rgb(4 12 26 / 0.35)",
        soft: "0 1px 0 rgb(255 255 255 / 0.9) inset, 0 1px 2px rgb(13 34 63 / 0.08)",
        pressed: "inset 0 1px 2px rgb(13 34 63 / 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
