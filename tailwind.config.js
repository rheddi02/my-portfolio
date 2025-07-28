/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        foreground: '#ffffff',
        'muted-foreground': '#9ca3af',
      }
    },
  },
  plugins: [],
}
