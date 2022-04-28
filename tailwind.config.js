// See https://tailwindcss.com/docs/configuration
module.exports = {
  darkMode: 'media', // or 'media' or 'class'
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
