import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Three.js (pétales 3D) forme un fichier d'environ 140 Ko compressé, chargé
    // uniquement après l'affichage de la page : on relève le seuil d'alerte en conséquence.
    chunkSizeWarningLimit: 600,
  },
});
