/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react"; // Importa el plugin de NextUI

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Asegúrate de incluir las rutas de NextUI para que Tailwind las detecte
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    nextui(), // Agrega el plugin de NextUI a los plugins de Tailwind
  ],
};
