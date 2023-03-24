import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// see https://github.com/vitejs/vite/issues/5668
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['funfetch'],
  },
  build: {
    commonjsOptions: {
      include: [/funfetch/, /node_modules/],
    },
  },
})
