/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#2e4c9a',
        customBlueLight: '#6a82c3',
        customOrange: '#e67936',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
