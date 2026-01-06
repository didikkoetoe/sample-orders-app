import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '../services/auth';
import LoginView from '../views/LoginView.vue';
import ProductsView from '../views/ProductsView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import OrdersView from '../views/OrdersView.vue';

const routes = [
  {
    path: '/',
    redirect: '/products',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutView,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrdersView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/products');
  } else {
    next();
  }
});

export default router;
