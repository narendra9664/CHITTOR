// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    globals: true,
    css: false,
    // Mock framer-motion and gsap at the module level
    server: {
      deps: {
        // Inline these so vi.mock hoisting works correctly
        inline: ['framer-motion', 'gsap'],
      },
    },
  },
});