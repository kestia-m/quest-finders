/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'persian-pink': '#f991ccff',
        'pink-lavender': '#e2afdeff',
        'thistle': '#d3c2ceff',
        'timberwolf': '#d3d2c7ff',
        'lemon-chiffon': '#e2e1b9ff',
      },
    },
  },
  plugins: [require('daisyui')],
}