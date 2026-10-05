import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `--mode single` inlines everything (JS, CSS, fonts) into one dist/index.html.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  // Don't inherit the portfolio's PostCSS (Tailwind) config from the repo root.
  css: { postcss: {} },
  build: { assetsInlineLimit: 100000000 },
}))
