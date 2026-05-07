import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/thinknextapp/',  // ← Your repository name (same as homepage path)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})