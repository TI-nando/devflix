import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite - https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configura o caminho base para deploy no GitHub Pages
  // Altere 'devflix' para o nome real do seu repositório
  base: '/devflix/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});