import { defineConfig } from 'vite';
import { resolve } from 'path';

function swapFontDisplayPlugin() {
  return {
    name: 'swap-font-display',
    transform(code, id) {
      if (id.endsWith('.css') || id.includes('@phosphor-icons')) {
        return {
          code: code.replace(/font-display:\s*block/g, 'font-display: swap'),
          map: null
        };
      }
    }
  };
}

export default defineConfig({
  plugins: [swapFontDisplayPlugin()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
});

