import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/common.js'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      requiresAuth: true,
      title: '智能旅行'
    }
  },
  {
    path: '/hotCity',
    name: 'hotCity',
    component: () => import('@/views/HotCity/index.vue'),
    meta: {
      requiresAuth: true,
      title: '热门城市'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/contact/index.vue'),
    meta: {
      requiresAuth: true,
      title: '联系人'
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/Chat/index.vue'),
    meta: {
      requiresAuth: true,
      title: 'AI对话'
    }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User/index.vue'),
    meta: {
      requiresAuth: true,
      title: '我的'
    }
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/detail/index.vue'),
    meta: {
      requiresAuth: true,
      title: '行程规划'
    }
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/setting.vue'),
    meta: {
      requiresAuth: true,
      title: '设置'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound/index.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = getToken()

  if (to.meta.requiresAuth && !token) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    }
  }

  // 已登录访问登录页，直接回首页
  if (to.path === '/login' && token) {
    return '/home'
  }
})

// 同步浏览器标题
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · AI旅行助手` : 'AI旅行助手'
})

export default router
