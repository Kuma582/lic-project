/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lic: {
          blue: '#003366',
          gold: '#FFB81C',
          dark: '#0f172a',
          gray: '#f3f4f6'
        }
      }
    },
  },
  plugins: [],
}

