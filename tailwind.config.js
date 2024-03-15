/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./public/*.html", "./public/**/*/*.html" ],
  theme: {
    extend: {
      colors: {
        'waterloo-': {
          '50': '#f5f6f8',
          '100': '#ecf0f3',
          '200': '#dce2e9',
          '300': '#c7ceda',
          '400': '#afb8ca',
          '500': '#9aa2ba',
          '600': '#848aa7',
          '700': '#757a95',
          '800': '#5c6077',
          '900': '#4e5161',
          '950': '#2e3038',
        },
        'ebony': {
          '50': '#eef1ff',
          '100': '#e0e6ff',
          '200': '#c7d0fe',
          '300': '#a6b0fb',
          '400': '#8288f7',
          '500': '#6764f0',
          '600': '#5747e4',
          '700': '#4a39c9',
          '800': '#3d31a2',
          '900': '#090618',
          '950': '#0d0b1e',
        }
      },
      fontFamily: {
        "IBMplexMono": [ "IBMplexMono", "monospace" ],
        "Outfit": [ "Outfit", "sans-serif" ],
      }
    }
  },
  plugins: [],
}
