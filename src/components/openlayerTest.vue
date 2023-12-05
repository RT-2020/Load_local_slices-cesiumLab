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
import WMTSTileGrid from 'ol/tilegrid/WMTS.js'

import { onMounted } from 'vue'

function initMap() {
  // 定义坐标系, 这里定义之后后续代码中的坐标系代码 4490 才会有效
  proj4.defs('EPSG:4490', '+proj=longlat +ellps=GRS80 +no_defs')
  register(proj4)

  // 计算各个缩放级别的分辨率
  const maxZoom = 9 // 从服务说明中获取
  const minResolution = 0.7039130078552128 // 从服务说明中获取
  // 计算
  const resolutions = []
  const matrixIds = []

  for (let z = 0; z < maxZoom; ++z) {
    resolutions[z] = minResolution / Math.pow(2, z)
    matrixIds[z] = z
  }

  // const mapServerBasePath = 'http://localhost:8888/EarthG11/%E5%9B%BE%E5%B1%82/_alllayers'
  const mapServerBasePath = 'http://10.52.1.38:6088/geoscene/static/servers/earthGll/_alllayers/'

  new Map({
    target: 'map-dom',
    layers: [
      new TileLayer({
        source: new XYZ({
          url: mapServerBasePath + '/{z}/{y}/{x}',
          tileGrid: new WMTSTileGrid({
            origin: [-180, 90], // 从服务说明中获取
            resolutions: resolutions,
            matrixIds: matrixIds
          }),
          wrapX: true,
          projection: 'EPSG:4490',
          // 重构地图请求地址
          tileLoadFunction: (imageTile, src) => {
            const Z = 'L' + formatNumberLength(imageTile.tileCoord[0], 10, 2)
            const X = 'C' + formatNumberLength(imageTile.tileCoord[1], 16, 8)
            const Y = 'R' + formatNumberLength(imageTile.tileCoord[2], 16, 8)
            console.log('xxxxx', Z, X, Y)
            console.log('imageTile', imageTile, src)
            imageTile.getImage().src = mapServerBasePath + '/' + Z + '/' + Y + '/' + X + '.jpg'
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
