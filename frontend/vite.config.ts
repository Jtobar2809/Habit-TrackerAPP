import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// El backend escucha en http://localhost:5000 (ver Properties/launchSettings.json).
// Proxiamos los grupos de rutas para evitar CORS sin tocar el backend.
const BACKEND = 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/users':                { target: BACKEND, changeOrigin: true },
      '/habitos':              { target: BACKEND, changeOrigin: true },
      '/registros-habitos':    { target: BACKEND, changeOrigin: true },
      '/estadisticas-habitos': { target: BACKEND, changeOrigin: true },
    },
  },
});
