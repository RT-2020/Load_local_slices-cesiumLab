const routers = [
  {
    path: '/cesium',
    name: 'cesium加载本地切片示例',
    component: () => import('../../components/cesiumTest.vue')
  },
  {
    path: '/cesiumXYZ',
    name: 'cesiumXYZ示例',
    component: () => import('../../components/cesiumXYZ.vue')
  }
]
export default routers