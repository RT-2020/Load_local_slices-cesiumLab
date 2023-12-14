import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import modules from './model/index.js';

/**
 * 构造路由模块
 */
const routes = [
  ...modules.opnelayer,
  ...modules.cesium
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: routes ? routes[0].path : '/',
      children: routes
    },
  ]
})

export default router
