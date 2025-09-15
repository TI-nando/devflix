import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite - https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  base: '/devflix/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});