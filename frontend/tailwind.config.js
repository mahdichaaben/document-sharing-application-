/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-light": "#FFFFFF",       // White (background)
        "primary-dark": "#000000",   // Black (primary dark)
        "primary-light": "#FF5733",  // Coral (highlight/accent)
        "button-blue": "#3498DB",    // Sky Blue (buttons and action elements)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],  // Default sans-serif font is Inter
      },
    },
  },
  plugins: [],
};
