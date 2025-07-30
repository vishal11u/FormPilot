/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: {
          DEFAULT: "#1b2a6f",
          light: "#4d5b89",
          softer: "#a5bad5",
        },
        accent: {
          green: "#6bff6b",
          teal: "#29ffb8",
        },
      },
    },
  },
  plugins: [],
};
