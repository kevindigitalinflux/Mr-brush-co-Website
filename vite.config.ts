import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // GSAP in its own chunk — large, changes rarely, benefits from caching
          'vendor-gsap': ['gsap'],
          // React runtime — tiny but changes very rarely
          'vendor-react': ['react', 'react-dom'],
        },
      },
    },
  },
})
