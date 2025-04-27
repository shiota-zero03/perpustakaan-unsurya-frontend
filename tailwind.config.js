const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#085C94',
        'secondary': '#447CA0',
        'danger': '#AC0000',
        'white': '#FFFFFF',
        'accent-gray': '#BCBEEB',
        'accent-green': '#085F07',
      }
    },
    display: ["print"],
  },
  darkMode: "class",
  plugins: [nextui()],
}