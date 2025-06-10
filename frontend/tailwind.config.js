/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // 👈 tells Tailwind where to look for class names
  ],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ['Caveat', 'cursive'], // for the handwritten font you added
      },
    },
  },
  plugins: [],
};

