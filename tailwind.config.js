/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/apx-ds/src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset"), require("apx-ds/preset/tailwind")],
  theme: {
    extend: {},
  },
  plugins: [],
};
