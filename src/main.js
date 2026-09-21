import { createApp } from 'vue'
import Vant, { showFailToast } from 'vant'
import 'vant/lib/index.css'
import App from './App.vue'
import router from './router'
import '@/assets/styles/common.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(Vant) // 全局注册所有 Vant 组件
app.use(router)

// 全局错误兜底：渲染异常不再白屏
app.config.errorHandler = (err, instance, info) => {
  console.error('[app] 渲染异常:', info, err)
  showFailToast({ message: '页面出现异常，请稍后重试', position: 'top' })
}

// 未处理的 Promise 异常兜底（如接口 reject 未被 catch）
window.addEventListener('unhandledrejection', (event) => {
  console.error('[app] 未处理的 Promise 异常:', event.reason)
  event.preventDefault()
})

app.mount('#app')
