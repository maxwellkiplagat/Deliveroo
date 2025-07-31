// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './src',
  plugins: [react()],
  build: {
    outDir: '../dist', // build output outside of src
    emptyOutDir: true,
  }
});
