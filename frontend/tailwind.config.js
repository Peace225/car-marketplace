/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // 1. Déclaration des étapes de l'animation
      keyframes: {
        drive: {
          '0%, 100%': { backgroundPosition: 'left center' },
          '50%': { backgroundPosition: 'right center' },
        }
      },
      // 2. Création de la classe utilitaire 'animate-drive'
      animation: {
        drive: 'drive 30s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}