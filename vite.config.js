/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    test: {
      coverage: {
        reporter: ['text', 'cobertura'],
      },
    },
  },
})
