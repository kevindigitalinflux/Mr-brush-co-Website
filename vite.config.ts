import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        // manualChunks conflicts with the SSR build pass — it externalises
        // deps like gsap/react, which can't also be named in manualChunks.
        // Client-build-only, same as DI Dreamlabs' vite-react-ssg setup.
        manualChunks: isSsrBuild
          ? undefined
          : {
              // GSAP in its own chunk — large, changes rarely, benefits from caching
              'vendor-gsap': ['gsap'],
              // React runtime — tiny but changes very rarely
              'vendor-react': ['react', 'react-dom'],
            },
      },
    },
  },
}))
