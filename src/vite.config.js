export default defineConfig({
  root: 'src', // Set root to 'src'
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: '/index.html' // Path relative to new root
    }
  },
  // ...other settings
});
