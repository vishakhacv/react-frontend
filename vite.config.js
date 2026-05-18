import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
  proxy: {
    '/api': {
      target: 'https://laravel-backend-1-bhrs.onrender.com',
      changeOrigin: true,
      secure: true,
    }
  }
},
});
