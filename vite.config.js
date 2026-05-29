import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/api/travel': {
        target: 'http://localhost:3300',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 配置 @ 别名指向 src目录
    },
  },
})
