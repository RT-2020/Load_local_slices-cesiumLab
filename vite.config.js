import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),cesium()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/geoscene': {
        target: 'http://10.52.1.38:6088',
        changeOrigin: true,
      },
    },
  },
})
