import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Same-origin in dev, so cookies work without any cross-site settings
    proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
  },
});
