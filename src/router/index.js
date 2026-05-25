import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue'),
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home/index.vue'),
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/Chat/index.vue'),
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user/index.vue'),
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/detail/index.vue'),
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用History模式，URL不带#
  routes, // 路由配置表
})

export default router