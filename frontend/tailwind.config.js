/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-navbar': '#071952',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(8px);' },
          '100%': { opacity: 1, transform: 'translateY(0);' },
        },
        'fade-out': {
          '0%': { opacity: 1, transform: 'translateY(0);' },
          '100%': { opacity: 0, transform: 'translateY(8px);' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-out': 'fade-out 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
