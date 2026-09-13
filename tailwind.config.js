/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: '0.625rem',
        sm: '0.375rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        full: '9999px',
      },
      colors: {
        brand: {
          red: '#E63946',
          redDark: '#C1121F',
          redLight: '#FF6B6B',
          orange: '#F4845F',
          yellow: '#F4C542',
        },
        liban: {
          dark: '#0F172A',
          grey: '#F0F4FF',
          border: '#CBD5E1',
          muted: '#64748B',
          white: '#FFFFFF',
          accent: '#6366F1',
          accentLight: '#EEF2FF',
          success: '#10B981',
          successLight: '#ECFDF5',
          warning: '#F59E0B',
          warningLight: '#FFFBEB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 16px rgba(99,102,241,0.10)',
        nav: '0 2px 16px rgba(15,23,42,0.12)',
        glow: '0 0 20px rgba(230,57,70,0.25)',
        soft: '0 8px 32px rgba(15,23,42,0.08)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #F8FAFF 100%)',
        'gradient-red': 'linear-gradient(135deg, #E63946 0%, #C1121F 100%)',
        'gradient-accent': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
      },
    },
  },
  plugins: [],
};
