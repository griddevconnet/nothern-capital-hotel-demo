/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Blue
        primary: {
          50: 'rgba(var(--color-primary) / 0.05)',
          100: 'rgba(var(--color-primary) / 0.1)',
          200: 'rgba(var(--color-primary) / 0.2)',
          300: 'rgba(var(--color-primary) / 0.4)',
          400: 'rgba(var(--color-primary) / 0.6)',
          500: 'rgba(var(--color-primary) / 0.8)',
          600: 'rgb(var(--color-primary))',
          700: 'rgb(var(--color-primary-dark))',
          800: 'rgba(var(--color-primary) / 0.8)',
          900: 'rgba(var(--color-primary) / 0.9)',
          light: 'rgb(var(--color-primary-light))',
          dark: 'rgb(var(--color-primary-dark))',
          DEFAULT: 'rgb(var(--color-primary))',
        },
        // Secondary Gold
        secondary: {
          50: 'rgba(var(--color-secondary) / 0.05)',
          100: 'rgba(var(--color-secondary) / 0.1)',
          200: 'rgba(var(--color-secondary) / 0.2)',
          300: 'rgba(var(--color-secondary) / 0.4)',
          400: 'rgba(var(--color-secondary) / 0.6)',
          500: 'rgba(var(--color-secondary) / 0.8)',
          600: 'rgb(var(--color-secondary))',
          700: 'rgb(var(--color-secondary-dark))',
          800: 'rgba(var(--color-secondary) / 0.8)',
          900: 'rgba(var(--color-secondary) / 0.9)',
          light: 'rgb(var(--color-secondary-light))',
          dark: 'rgb(var(--color-secondary-dark))',
          DEFAULT: 'rgb(var(--color-secondary))',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
