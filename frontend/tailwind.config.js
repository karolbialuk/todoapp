/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      bg: '1330px',
      xl: '1440px',
      fullhd: '1920px',
    },
    extend: {
      colors: {
        textColor: '#1D2220',
        lightPink: '#C67ED2',
        transparentBackgroundColor: '#fdfdfdcc',
        transparentBackgroundColor2: '#fdfdfd23',
      },
    },
  },
  plugins: [],
}
