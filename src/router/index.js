import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/index.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About/index.vue'),
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用History模式，URL不带#
  routes, // 路由配置表
})

export default router