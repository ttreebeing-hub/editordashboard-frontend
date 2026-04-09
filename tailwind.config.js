/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        background: '#0f0f0f',
        card: '#1a1a1a',
        elevated: '#242424',
        border: '#2a2a2a',
        accent: '#0ea5e9',
        'text-primary': '#f4f4f5',
        'text-muted': '#a1a1aa',
        signal: {
          red: '#ef4444',
          yellow: '#f59e0b',
          green: '#22c55e',
        },
        tier: {
          excellent: '#0ea5e9',
          good: '#a855f7',
          developing: '#f59e0b',
          support: '#ef4444',
        },
      },
    },
  },
  plugins: [],
}
