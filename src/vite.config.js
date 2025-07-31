// src/vite.config.js
import { defineConfig } from 'vite'; // Add this import
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, '.'), // Current directory (src)
  build: {
    outDir: path.resolve(__dirname, '../dist'),
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  },
  plugins: [react()],
});
