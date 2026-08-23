/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gnosis: {
          bg: '#120e16',
          surface: '#221c28',
          raised: '#2b2532',
          hover: '#3f3847',
          line: '#3a3244',
          accent: '#34d399',
          accentMuted: '#059669',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      opacity: {
        15: '0.15',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(52, 211, 153, 0.12), 0 18px 50px -24px rgba(5, 150, 105, 0.45)',
      },
    },
  },
  plugins: [],
}
