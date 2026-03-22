/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        heading: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Jost'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
