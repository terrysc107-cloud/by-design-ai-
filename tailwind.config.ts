import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
        'gold-dim': 'rgba(201,168,76,0.15)',
        'gold-border': 'rgba(201,168,76,0.4)',
        background: '#0A0A0A',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gold-pulse': 'gold-pulse 3s ease-in-out infinite',
        'border-spin': 'border-spin 4s linear infinite',
        'grain': 'grain 8s steps(10) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        'gold-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(201,168,76,0.2)' },
          '50%': { boxShadow: '0 0 24px rgba(201,168,76,0.5)' },
        },
        'border-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'grain': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 1%)' },
          '30%': { transform: 'translate(-1%, 4%)' },
          '40%': { transform: 'translate(4%, -2%)' },
          '50%': { transform: 'translate(-3%, 2%)' },
          '60%': { transform: 'translate(2%, -4%)' },
          '70%': { transform: 'translate(-4%, 1%)' },
          '80%': { transform: 'translate(1%, 3%)' },
          '90%': { transform: 'translate(-2%, -1%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gold-radial': 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}

export default config
