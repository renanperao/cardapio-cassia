/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          50: '#fcf9f5',
          100: '#f5efe6',
          200: '#e8dbca',
          300: '#d7c0a9',
          400: '#c3a183',
          500: '#b28662',
          600: '#a47253',
          700: '#895c45',
          800: '#714d3b',
          900: '#5c4033',
        }
      },
      height: {
        'screen-dvh': '100dvh',
      },
      minHeight: {
        'screen-dvh': '100dvh',
      },
    },
  },
  plugins: [],
}
