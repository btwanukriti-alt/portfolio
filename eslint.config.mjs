import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Stills are pre-sized exports, and the 3D sphere and lightbox need plain <img> elements.
      '@next/next/no-img-element': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'next-env.d.ts',
    'public/**',
    'dist/**',
    'scripts/ssh-client-embed/**',
    'scripts/mockups/**',
    '*-video/**',
    'Claude outputs/**',
  ]),
])
