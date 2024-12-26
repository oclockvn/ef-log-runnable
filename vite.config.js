import { defineConfig } from 'vite'

export default defineConfig({
  base: './',  // Set base to relative path for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})