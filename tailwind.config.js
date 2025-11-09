/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0b0b0b',
        accent: '#b30000',
      },
      animation: {
        'tv-noise': 'tvNoise 0.5s steps(3) infinite',
      },
      keyframes: {
        tvNoise: {
          '0%': { opacity: '0.3', filter: 'brightness(1)' },
          '50%': { opacity: '0.7', filter: 'brightness(1.2)' },
          '100%': { opacity: '0.3', filter: 'brightness(1)' },
        },
      },
    },
  },
  plugins: [],
}