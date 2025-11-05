// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Active les opacités pour TOUTES les couleurs
      opacity: {
        20: "0.20",
      },
      // Force la génération des variantes /20
      ringOpacity: {
        20: "0.20",
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#3b82f6",
          "primary-focus": "#2563eb",
          "primary-content": "#ffffff",
        },
      },
      {
        dark: {
          primary: "#60a5fa",
          "primary-focus": "#3b82f6",
          "primary-content": "#ffffff",
        },
      },
    ],
    darkTheme: "dark",
    styled: true,
    base: true,
    utils: true,
    logs: false,
  },
};