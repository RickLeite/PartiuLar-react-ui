import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        logger: { warn: () => { } }
      }
    }
  },
  server: {
    host: true,
    port: 5173,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8800',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'ws://localhost:4000',
        ws: true
      }
    }
  }
})