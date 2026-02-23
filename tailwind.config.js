/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        watercolor: {
          50: '#f6fbfb',
          100: '#e6f4f4',
          200: '#cde8e8',
          300: '#b5dbdb',
          400: '#7fbcbc',
          500: '#4ea5a5',
          600: '#3a7f7f',
          700: '#2b6161',
          800: '#234d4d',
          900: '#163737'
        }
      }
    }
  },
  plugins: []
}
