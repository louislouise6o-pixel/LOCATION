/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#E8EEF6',
          100: '#C8D4E5',
          200: '#94ABCE',
          300: '#5B7BA8',
          400: '#2C5284',
          500: '#123B5D',
          600: '#0E2F4A',
          700: '#0A2640',
          800: '#071B33',
          900: '#04101F',
        },
        ocean: {
          50: '#E9F4F5',
          100: '#C8E6E6',
          200: '#9FD0D0',
          300: '#62B5B2',
          400: '#20B8B0',
          500: '#1BA39C',
          600: '#178580',
          700: '#136765',
          800: '#0F4A4A',
          900: '#0A3232',
        },
        sand: {
          50: '#FBF8F3',
          100: '#F4EFE4',
          200: '#E9DECA',
          300: '#D9C8A6',
        },
        mist: {
          50: '#F9FBFC',
          100: '#F4F7FA',
          200: '#E6ECF2',
          300: '#CBD6E2',
          400: '#9AAEC2',
        },
        ink: '#172536',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(7, 27, 51, 0.04), 0 8px 24px rgba(7, 27, 51, 0.08)',
        cardHover: '0 4px 8px rgba(7, 27, 51, 0.08), 0 16px 40px rgba(7, 27, 51, 0.16)',
        nav: '0 1px 0 rgba(7, 27, 51, 0.06)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out',
        fadeIn: 'fadeIn 0.4s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
