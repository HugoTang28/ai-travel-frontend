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
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    // 启动时就预构建这些依赖，避免运行中才发现新包触发 re-optimize 导致
    // "Failed to fetch dynamically imported module / 504 Outdated Optimize Dep"
    optimizeDeps: {
      include: ['marked', 'marked-highlight', 'highlight.js/lib/common', 'dompurify']
    },
    build: {
      rollupOptions: {
        output: {
          // 把大依赖拆成独立 chunk，避免主包过大
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (id.includes('vant')) return 'vant'
            if (/node_modules[\\/](marked|marked-highlight|highlight\.js|dompurify)/.test(id)) {
              return 'markdown'
            }
            return undefined
          }
        }
      }
    }
  }
})
