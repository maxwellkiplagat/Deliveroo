import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Explicitly define build output
    emptyOutDir: true, // Clean outDir before each build
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});