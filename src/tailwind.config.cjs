/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          cream: '#FFF7E2',
          pink: '#FEF5FF',
          grey: '#D9D9D9',
          brown: '#80785C',
        },
        secondary: {
          brown: '#787373',
        },
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      screens: {
        mobile: '480px',
      },
    },
  },
  plugins: [],
};
