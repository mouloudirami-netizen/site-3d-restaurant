import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Le chunk 3D (three + fiber + drei) est chargé à la demande ; sa taille est attendue.
  build: { chunkSizeWarningLimit: 1000 },
})
