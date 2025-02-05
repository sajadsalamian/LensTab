/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2cae41",
        // primary: "#40534C",
        dark: '#1A3636',
        "dark-black": '#2c2d31',
        light: '#677D6A',
        secondary: '#D6BD98',
        "main-color": "#ffc107",
      },
      fontFamily: {
        // sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

