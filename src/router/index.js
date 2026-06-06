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
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/hotCity',
    name: 'hotCity',
    component: () => import('@/views/HotCity/index.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/Chat/index.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User/index.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/detail/index.vue'),
    meta: {
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('AITRAVEL_TOKEN')

  if (to.meta.requiresAuth && !token) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  // if (to.path === '/login' && token) {
  //   return '/home'
  // }
})

export default router
