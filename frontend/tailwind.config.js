/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        buttonbghover: "#626F86",
        buttonbg: "#44546F",
        spantext: "#44546F",
        boxbg: "#091E4224",
        signbut: "#B3B9C4",
        signbuthov: "#DCDFE4",
        magenta: {
          500: "#DA62AC",
          600: "#CD519D",
          100: "#FFECF8",
        },
        sidebar: "#B3B9C4",
        searchbg: "#091E4208",
      },
    },
  },
  plugins: [],
};

