import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        cairo: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-secondary)',
          dark: '#1a202c',
        },
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        theme: {
          primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--color-secondary-rgb) / <alpha-value>)',
          accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
          background: 'rgb(var(--color-background-rgb) / <alpha-value>)',
          text: 'rgb(var(--color-text-rgb) / <alpha-value>)',
        },
      },
      borderRadius: {
        theme: 'var(--border-radius)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-left': 'slideLeft 30s linear infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
