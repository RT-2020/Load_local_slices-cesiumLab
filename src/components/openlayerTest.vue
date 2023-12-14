<template>
  <div class="box">
    <div id="map-dom" class="map-dom"></div>
  </div>
</template>

<script setup>
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import Map from 'ol/Map'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4.js'
import XYZ from 'ol/source/XYZ.js'
import { transformExtent } from 'ol/proj';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js'

import { onMounted,getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()


function initMap() {
  // 定义坐标系, 这里定义之后后续代码中的坐标系代码 4490 才会有效
  proj4.defs('EPSG:4490', '+proj=longlat +ellps=GRS80 +no_defs')
  register(proj4)

  // 计算各个缩放级别的分辨率
  const maxZoom = 22 // 从服务说明中获取
  const minResolution = 0.70391300785521282 // 从服务说明中获取
  // 计算
  const resolutions = []
  const matrixIds = []

  for (let z = 0; z < maxZoom; ++z) {
    resolutions[z] = minResolution / Math.pow(2, z)
    matrixIds[z] = z
  }

  var extent = transformExtent(
    [107.34350754384501, 28.136996855272013, 107.356257619901, 28.163110084644],
    'EPSG:4326', // 原始坐标系是WGS 84
    'EPSG:4490' 
);
  // http://10.52.1.38:6088/dom/608B0591/_alllayers/
  const mapServerBasePath = '/dom/608B0591/_alllayers/'
  

  const map = new Map({
    target: 'map-dom',
    layers: [
      new TileLayer({
        source: new XYZ({
          url: proxy.$mapBaseUrl + mapServerBasePath + '{z}/{y}/{x}',
          tileGrid: new WMTSTileGrid({
            origin: [-180, 90], // 从服务说明中获取
            resolutions: resolutions,
            matrixIds: matrixIds
          }),
          wrapX: true,
          projection: 'EPSG:4490',
          // 重构地图请求地址
          // eslint-disable-next-line no-unused-vars
          tileLoadFunction: (imageTile, src) => {
            const Z = 'L' + formatNumberLength(imageTile.tileCoord[0], 10, 2)
            const X = 'C' + formatNumberLength(imageTile.tileCoord[1], 16, 8)
            const Y = 'R' + formatNumberLength(imageTile.tileCoord[2], 16, 8)
            imageTile.getImage().src = proxy.$mapBaseUrl + mapServerBasePath + '/' + Z + '/' + Y + '/' + X + '.png'
          }
        })
      })
    ],
    view: new View({
      projection: 'EPSG:4490',
      center: [106, 27],
      zoom: 7
    })
  })

  map.getView().fit(extent, {
    size: map.getSize(), // 地图容器的大小
    padding: [100, 100, 100, 100], // 可选，如果您想在范围周围有一些边缘空间
    duration: 1000 // 可选，动画持续时间（毫秒）
});
}

onMounted(() => {
  initMap()
})

/**
 * 转换数字长度
 * @param {number} num 十进制数
 * @param {number} radix 要转换的进制基数
 * @param {number} length 返回的字符串长度
 */
function formatNumberLength(num, radix = 10, length = 0) {
  let str = num.toString(radix)
  if (length === 0) {
    return str
  }
  while (str.length < length) {
    str = '0' + str
  }
  return str
}
</script>

<style scoped lang="scss">
.box {
  height: 100%;
  width: 100%;

  .map-dom {
    height: 100%;
    width: 100%;
  }
}
</style>
