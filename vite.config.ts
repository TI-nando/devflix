import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite - https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist'
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});