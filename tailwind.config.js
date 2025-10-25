// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 님의 src 폴더 안의 모든 파일을 감시
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}