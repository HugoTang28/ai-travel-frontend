import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/common.js'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index.vue')
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
      requiresAuth: true
    }
  },
  {
    path: '/hotCity',
    name: 'hotCity',
    component: () => import('@/views/HotCity/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/contact/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/Chat/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/detail/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@/views/setting.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound/index.vue')
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

  // if (to.path === '/login' && token) {
  //   return '/home'
  // }
})

export default router
