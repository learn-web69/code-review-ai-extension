
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Entry for the web preview
        // Fix: remove __dirname, as it's not available in ESM. Vite resolves from the project root.
        main: resolve('index.html'),
        // Entry for the extension popup
        // Fix: remove __dirname, as it's not available in ESM. Vite resolves from the project root.
        popup: resolve('popup.html'),
        // Entry for the content script
        // Fix: remove __dirname, as it's not available in ESM. Vite resolves from the project root.
        content: resolve('src/content.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
           // Keep original names for content script
          if (chunkInfo.name === 'content') {
            return 'content.js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
});
