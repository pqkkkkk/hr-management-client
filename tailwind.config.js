/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(45, 194, 117)',
          50: '#f0fdf6',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: 'rgb(45, 194, 117)',
          600: 'rgb(39, 174, 105)',
          700: 'rgb(34, 152, 92)',
          800: 'rgb(29, 132, 80)',
          900: 'rgb(24, 112, 68)',
        },
        secondary: {
          DEFAULT: 'rgb(42, 45, 52)',
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: 'rgb(42, 45, 52)',
          600: 'rgb(38, 40, 47)',
          700: 'rgb(33, 36, 41)',
          800: 'rgb(28, 30, 35)',
          900: 'rgb(23, 25, 29)',
        },
        dark: {
          bg: 'rgb(17, 24, 39)',
          card: 'rgb(31, 41, 55)',
          text: 'rgb(243, 244, 246)',
          textSecondary: 'rgb(156, 163, 175)',
          border: 'rgb(75, 85, 99)',
        }
      }
    },
  },
  plugins: [],
}

