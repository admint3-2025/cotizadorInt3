/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'integrational-blue': '#0066cc',
        'integrational-dark': '#003366',
        'integrational-light': '#4d94ff',
      }
    },
  },
  plugins: [],
}
