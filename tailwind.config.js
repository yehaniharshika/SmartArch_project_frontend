/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0A0F1E",
          900: "#0F1729",
          800: "#1B2B4B",
          700: "#1E3A6E",
          600: "#1A4FA0",
          500: "#1E6FD9",
        },
        blue: {
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#93C5FD",
          300: "#60A8F8",
          400: "#3B8FF0",
          500: "#1E6FD9",
        },
        warm: {
          50:  "#F8F9FC",
          100: "#F1F4F9",
          200: "#E4E9F2",
          300: "#C8D3E8",
          400: "#9AAAC8",
          500: "#6B7FA3",
          600: "#4A5C80",
          700: "#2E3D5E",
        },
        brass: {
          100: "#FBF0D3",
          400: "#E8C066",
          500: "#D4A843",
        },
        // "bronze" was used throughout the page components (bronze-DEFAULT,
        // bronze-light, bronze-dark) but was never defined here — those
        // classes were silently failing. Mapped onto the existing brass
        // tones so the accent colour that was already designed actually
        // renders. Swap these three lines later if a new palette comes in.
        bronze: {
          light:   "#E8C066", // = brass-400
          DEFAULT: "#D4A843", // = brass-500
          dark:    "#AD8530", // darker shade for hover states
        },
        "arch-cream": "#F8F9FC",
      },
      fontFamily: {
        display: ["'Syne'", "system-ui", "sans-serif"],
        sans:    ["'Inter'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        "display-xl": ["3.5rem", { lineHeight: "1.05" }],
        "display-lg": ["2.5rem", { lineHeight: "1.1" }],
        "display-md": ["1.875rem", { lineHeight: "1.15" }],
      },
      animation: {
        "fade-up":     "fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":     "fadeIn 0.3s ease both",
        "float":       "float 3s ease-in-out infinite",
        "spin-slow":   "spin 1s linear infinite",
        "pulse-slow":  "pulse 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-8px)" },
        },
      },
      boxShadow: {
        sm:   "0 1px 3px rgba(15,23,41,0.08)",
        md:   "0 4px 16px rgba(15,23,41,0.12)",
        lg:   "0 12px 40px rgba(15,23,41,0.18)",
        blue: "0 8px 32px rgba(30,111,217,0.25)",
        glow: "0 0 0 3px rgba(30,111,217,0.18)",
        "warm-sm": "0 1px 2px rgba(15,23,41,0.06)",
      },
      screens: {
        "xs": "400px",
      },
    },
  },
  plugins: [],
};