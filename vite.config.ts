import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // Backend Symfony (symfony serve --port=8000).
      // Attention : l'ancienne stack Spring occupe encore le port 8080.
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return
          if (id.includes('@mui')) return 'mui'
          if (id.includes('@tanstack/react-query')) return 'query'
          if (id.includes('react')) return 'vendor'
        },
      },
    },
  },
})
