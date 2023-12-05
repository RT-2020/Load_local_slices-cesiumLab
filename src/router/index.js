import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: '/openlayer',
      children:[
        {
          path: '/openlayer',
          name: 'openlayer示例',
          component: () => import('../components/openlayerTest.vue')
        },
        {
          path: '/cesium',
          name: 'cesium示例',
          component: () => import('../components/cesiumTest.vue')
        },
      ]
    },
  ]
})

export default router
