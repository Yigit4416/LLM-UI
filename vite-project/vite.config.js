import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access from local network
    port: 5173,      // Specify the development server port
    proxy: {
      '/api': {
        target: 'http://192.168.1.16:8080', // Backend URL
        changeOrigin: true,             // Ensure correct Host header is forwarded
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Rewrite path
      },
    },
  },
})
