import { createApp } from 'vue'
import Vant, { Locale } from 'vant'
// import enUS from 'vant/es/locale/lang/en-US' // 引入英文语言包
import 'vant/lib/index.css'
import App from './App.vue'
import router from './router'
import '@/assets/styles/common.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'

// Locale.use('en-US', enUS) // 设置 Vant 语言为英文
console.log(import.meta.env.VITE_API_BASE_URL)
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(Vant) // 全局注册所有 Vant 组件
app.use(router)
app.mount('#app')
