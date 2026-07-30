import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const apiTarget = process.env.VITE_API_TARGET || 'http://localhost:8080';

export default defineConfig({
  base: '/conta/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    proxy: {
      '/conta/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
