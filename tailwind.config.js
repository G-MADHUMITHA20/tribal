/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b2853',
          blue: '#134685',
          lightBlue: '#1d63b8',
          accent: '#0284c7',
          sky: '#e0f2fe',
          saffron: '#e66800',
          green: '#138808',
          gold: '#b45309',
          surface: '#f8fafc',
          border: '#cbd5e1',
          textMain: '#0f172a',
          textMuted: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
