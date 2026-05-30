import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { layoutRoutes, asyncRoutes } from './routes'

const AppLayout = () => import(/* webpackChunkName: "layout" */ '@/components/layout/AppLayout.vue')
const LoginView = () => import(/* webpackChunkName: "login" */ '@/views/login/LoginView.vue')

/** 静态路由表 */
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: layoutRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

/** 导航守卫：未登录 → /login */
router.beforeEach((to) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false)

  const title = to.meta.title || 'AI 学习成长助手'
  document.title = `${title} - AI 学习成长助手`

  if (requiresAuth && !userStore.isLoggedIn) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'Login' && userStore.isLoggedIn) {
    return { name: 'Dashboard' }
  }

  return true
})

export default router
export { asyncRoutes }
