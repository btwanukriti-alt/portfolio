// Builds the clihub 20s embed into public/showcase/clihub/ (run: npx vite build --config scripts/clihub-embed/vite.config.mjs).
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const here = (p) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  root: here('.'),
  base: './',
  plugins: [react()],
  resolve: {
    // Outfit comes from Google Fonts in index.html instead of @fontsource.
    alias: [{ find: /^@fontsource\/outfit\/.*\.css$/, replacement: here('./empty.css') }],
  },
  build: {
    outDir: here('../../public/showcase/clihub'),
    emptyOutDir: true,
  },
})
