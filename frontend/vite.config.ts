import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Todas las llamadas API se redirigen al backend NestJS
      '/alerts': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/setup': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/calibration': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/readings': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
