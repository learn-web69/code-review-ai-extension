
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Custom plugin to copy manifest.json to the output directory.
// This is necessary as Vite's standard 'public' directory method
// isn't being used, and this ensures the manifest is included in the build.
function copyManifestPlugin() {
  return {
    name: 'copy-manifest-plugin',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: readFileSync(resolve('manifest.json'), 'utf-8'),
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyManifestPlugin()],
  build: {
    rollupOptions: {
      input: {
        // Entry for the web preview
        main: resolve('index.html'),
        // Entry for the extension popup
        popup: resolve('popup.html'),
        // Entry for the content script
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
