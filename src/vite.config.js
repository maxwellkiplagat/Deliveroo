// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',      // output in project root/dist
    emptyOutDir: true       // fix warning about not emptying folder
  }
})
