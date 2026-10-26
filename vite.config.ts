import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Chemins relatifs : le site fonctionne aussi dans un sous-dossier (GitHub Pages).
  base: './',
  plugins: [react()],
  // Le chunk 3D (three + fiber + drei) est chargé à la demande ; sa taille est attendue.
  build: { chunkSizeWarningLimit: 1000 },
})
