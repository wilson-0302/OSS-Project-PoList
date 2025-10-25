// postcss.config.js
module.exports = { // export default 대신 module.exports 사용 (CRA 호환성)
  plugins: {
    tailwindcss: {}, // '@tailwindcss/postcss' 대신 'tailwindcss'
    autoprefixer: {},
  },
}