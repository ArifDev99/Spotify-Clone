/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'green':'#1DB954',
        'black':'#191414',
        'black-base':'#121212',
        'black-secondary':"#171818",
        'black-light':'#181818',
        'black-gray':'#282828',
        'black-highlight':'rgba(0,0,0,.7)',
        'gray':'#535353'
      },
      gridTemplateColumns:{
        'auto-fill-cards' : 'repeat(auto-fill,minmax(200px,1fr))'
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
