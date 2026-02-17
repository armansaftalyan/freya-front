import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
      },
      colors: {
        sand: {
          50: '#faf7f2',
          100: '#f5efe3',
          200: '#e7d8bf',
          300: '#d8bf98',
          600: '#9f7f55',
          700: '#7a5f3f',
          900: '#3f311f',
        },
      },
      boxShadow: {
        soft: '0 10px 40px -16px rgba(83, 60, 23, 0.2)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise .55s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
