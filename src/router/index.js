import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

// Import views
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Home' }
  },
  {
    path: '/strategies',
    name: 'strategies',
    component: () => import('../views/strategies/StrategiesView.vue'),
    meta: { title: 'Browse Strategies' }
  },
  {
    path: '/strategies/:id',
    name: 'strategy-details',
    component: () => import('../views/strategies/StrategyDetailsView.vue'),
    meta: { title: 'Strategy Details' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { title: 'Login', guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { title: 'Register', guest: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/dashboard/DashboardView.vue'),
    meta: { title: 'Dashboard', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/dashboard/ProfileView.vue'),
    meta: { title: 'My Profile', requiresAuth: true }
  },
  {
    path: '/my-strategies',
    name: 'my-strategies',
    component: () => import('../views/dashboard/MyStrategiesView.vue'),
    meta: { title: 'My Strategies', requiresAuth: true }
  },
  {
    path: '/create-strategy',
    name: 'create-strategy',
    component: () => import('../views/strategies/CreateStrategyView.vue'),
    meta: { title: 'Create Strategy', requiresAuth: true }
  },
  {
    path: '/edit-strategy/:id',
    name: 'edit-strategy',
    component: () => import('../views/strategies/EditStrategyView.vue'),
    meta: { title: 'Edit Strategy', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guest)
  
  // Handle auth required routes
  if (requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  // Handle guest only routes (login, register)
  else if (isGuestOnly && userStore.isAuthenticated) {
    next({ name: 'dashboard' })
  }
  else {
    next()
  }
})

export default router