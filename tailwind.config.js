/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        epilogue: ["Epilogue", "sans-serif"],
      },
      colors: {},
      screens: {
        xs: "400px",
      },
      boxShadow: {
        secondary: "10px 10px 20px rgba(2, 2, 2, 0.25)",
      },
      translate: ["group-hover", "group-focus"],
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          primary: "#16a34a",
          secondary: "#0ea5e9",
          accent: "#8b5cf6",
          neutral: "#111827",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "base-content": "#111827",
          info: "#38bdf8",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      {
        dark: {
          primary: "#22c55e",
          secondary: "#38bdf8",
          accent: "#a78bfa",
          neutral: "#1f2937",
          "base-100": "#13131a",
          "base-200": "#1c1c24",
          "base-300": "#2c2f32",
          "base-content": "#ffffff",
          info: "#0ea5e9",
          success: "#16a34a",
          warning: "#fbbf24",
          error: "#f87171",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    utils: true,
    logs: false,
    styled: true,
  },
  plugins: [require("daisyui")],
};
