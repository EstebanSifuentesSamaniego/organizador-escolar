/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ethereal-ivory': '#FFF5E6',  // Fondo principal
        'warm-sand': '#E8D3B8',      // Secciones y hover ligero
        'golden-brown': '#C1A37D',   // Acentos importantes
        'deep-navy': '#0F2F45',      // Texto principal
        'cerulean': '#2E5A88',       // Botones, íconos y destacados
        'card-cream': 'oklch(97% 0.001 106.424)',
      },
    },
  },
  plugins: [],
}
