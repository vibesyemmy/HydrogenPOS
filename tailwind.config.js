/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          black: '#000000',
          white: '#FFFFFF',
        },
        grey: {
          2: '#484848',
        }
      },
      fontFamily: {
        'mail-sans': ['Mail Sans Roman', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
