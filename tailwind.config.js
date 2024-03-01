/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "0px",
      md: "481px",
      lg: "768px",
      xl: "1024px",
      "2xl": "1560px",
    },
    extend: {
      fontFamily: {
        interBlack: ["Inter-Black"],
      },
      colors: {
        bgColor: "rgb(0,0,0)",
        primeColor: "#1a2339",
        accColor: "#4267B5",
        darkRed: "#800000",
        imgCover: "rgba(0, 0, 0,0.55)",
        userColumnBgCol: "rgba(0, 0, 0,0.15)",
        spotify: "#1DB954",
        discord: "#424549",
        youtube: "#FF0000",
        facebook: "#4267B2",
        github: "#333",
        lightModeCol: "#F5F5F5",
        modalAccColor: "rgba(66, 103, 181, 0.95)",
        modalPrimeColor: "rgba(26,35,57,0.95)",
      },
    },
  },
  plugins: [],
}

