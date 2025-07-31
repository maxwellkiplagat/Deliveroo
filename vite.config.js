import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'src', // Simplified path
  build: {
    outDir: '../dist', // Relative to root
    emptyOutDir: true, // Cleans the directory
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // Keep this as is
    }
  },
  plugins: [react()],
});
