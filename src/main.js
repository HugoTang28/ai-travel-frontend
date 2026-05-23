import { createApp } from 'vue'
import Vant, { Locale } from 'vant'
import enUS from 'vant/es/locale/lang/en-US' // 引入英文语言包
import 'vant/lib/index.css'
import App from './App.vue'
import router from './router'
import '@/assets/styles/common.css'

// Locale.use('en-US', enUS) // 设置 Vant 语言为英文

const app = createApp(App)

app.use(Vant) // 全局注册所有 Vant 组件
app.use(router)
app.mount('#app')