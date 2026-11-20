/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F0',
        sand: '#F3E9D9',
        parchment: '#FFFDF8',
        ink: '#2E211B',
        muted: '#7A6B60',
        terracotta: '#B4543A',
        gold: '#C99A3D',
        wine: '#7B2D2D',
        line: '#E7DAC7',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Segoe UI', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px -24px rgba(46, 33, 27, 0.35)',
        card: '0 8px 28px -18px rgba(46, 33, 27, 0.45)',
        lift: '0 22px 60px -28px rgba(46, 33, 27, 0.55)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        'slow-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        float: 'float 7s ease-in-out infinite',
        'slow-spin': 'slow-spin 36s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
