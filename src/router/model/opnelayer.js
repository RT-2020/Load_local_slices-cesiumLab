const routers = [
  {
    path: '/openlayer',
    name: 'openlayer加载本地切片示例',
    component: () => import('../../components/openlayerTest.vue')
  },
  {
    path: '/openlayerXYZ',
    name: 'openlayer加载XYZ示例',
    component: () => import('../../components/openlayerXYZ.vue')
  }
]

export default routers
