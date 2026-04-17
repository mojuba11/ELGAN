/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        elgan: {
          dark: '#0f172a', // Deep slate for sidebars
          blue: '#1e40af', // Primary ELGAN blue
          light: '#f8fafc', // Background slate
        }
      }
    },
  },
  plugins: [],
}