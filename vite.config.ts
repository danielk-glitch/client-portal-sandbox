import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Poll for file changes so edits made outside the editor (e.g. by Claude) always reach the dev server.
  server: { watch: { usePolling: true, interval: 300 } },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
})
