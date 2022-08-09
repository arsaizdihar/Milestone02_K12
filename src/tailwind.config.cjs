/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-cream': '#FFF7E2',
        'primary-pink': '#FEF5FF',
        'primary-grey': '#D9D9D9',
        'primary-brown': '#80785C',
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
