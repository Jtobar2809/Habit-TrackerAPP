/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta roja moderna inspirada en "ember / crimson glow"
        ember: {
          50:  '#fff1f1',
          100: '#ffdfdf',
          200: '#ffc5c5',
          300: '#ff9d9d',
          400: '#ff6b6b',
          500: '#ff3b47',
          600: '#ec1f2e',
          700: '#c41121',
          800: '#a11320',
          900: '#851623',
          950: '#48060d',
        },
        ink: {
          50:  '#f6f6f7',
          100: '#e7e7e9',
          200: '#cfcfd3',
          300: '#a7a7af',
          400: '#76767f',
          500: '#5b5b63',
          600: '#494950',
          700: '#3c3c42',
          800: '#1f1f23',
          900: '#141417',
          950: '#0a0a0c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(236, 31, 46, 0.45)',
        'glow-lg': '0 0 60px -10px rgba(236, 31, 46, 0.55)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'radial-fade':
          'radial-gradient(circle at top, rgba(236, 31, 46, 0.18), transparent 55%)',
        'mesh':
          'radial-gradient(at 20% 10%, rgba(236, 31, 46, 0.20) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(255, 107, 107, 0.12) 0px, transparent 50%), radial-gradient(at 0% 80%, rgba(132, 22, 35, 0.25) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};
