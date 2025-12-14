/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Merriweather', 'serif'], // Gán Merriweather làm font serif mặc định
      },
    },
  },
  plugins: [],
}
