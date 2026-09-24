/** @type {import("tailwindcss").Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          900: "#14532d",
        },
        surface: {
          DEFAULT: "rgb(var(--bg-surface) / <alpha-value>)",
          card: "rgb(var(--bg-surface-card) / <alpha-value>)",
          border: "rgb(var(--bg-surface-border) / <alpha-value>)",
          hover: "rgb(var(--bg-surface-hover) / <alpha-value>)",
        },
        up: "#26a69a",
        down: "#ef5350",
      },
      fontFamily: {
        sans: ["Inter", '"Phetsarath OT"', "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", '"Phetsarath OT"', "monospace"],
      },
    },
  },
  plugins: [],
};
