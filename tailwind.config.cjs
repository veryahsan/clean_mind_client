/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // include all React files
  ],
  darkMode: "class", // enable dark mode using class
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo / main brand color
        primaryHover: "#4338CA", // Hover color for buttons
        secondary: "#10B981", // Green accent
        secondaryHover: "#059669",
        balance: "#6D28D9", // Use for headings
        pretty: "#9CA3AF", // For subtitles/text
        "neutral-primary-soft": "#F3F4F6", // Example for footer
        heading: "#111827",
        body: "#6B7280",
      },
      fontFamily: {
        sans: ["Lato", "ui-sans-serif", "system-ui"],
      },
      animation: {
        blob: "blob 7s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};
