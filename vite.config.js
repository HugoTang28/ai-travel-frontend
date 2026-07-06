import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 加载对应环境变量
  const env = loadEnv(mode, process.cwd())

  return {  
    plugins: [vue()],
    server: {
      proxy: {
        '/api/travel': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
})