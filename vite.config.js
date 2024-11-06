export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: process.env.WSL_IP || '0.0.0.0'
    },
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: `http://${process.env.WSL_IP || '0.0.0.0'}:3000`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})