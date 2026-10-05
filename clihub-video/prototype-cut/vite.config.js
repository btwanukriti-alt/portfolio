import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// React and Vite resolve from the portfolio's root node_modules.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { assetsInlineLimit: 100000000, cssCodeSplit: false, modulePreload: false },
})
