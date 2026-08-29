/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E63946',
          redDark: '#C1121F',
          redLight: '#FF6B6B',
        },
        liban: {
          dark: '#111111',
          grey: '#F5F5F5',
          border: '#E0E0E0',
          muted: '#666666',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        nav: '0 2px 12px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
};
