<template>
  <div class="openlayerXYZ-map" id="openlayerXYZ-map"></div>
</template>

<script setup>
import View from 'ol/View'
import Map from 'ol/Map'
import * as olSource from 'ol/source'
// eslint-disable-next-line no-unused-vars
import * as olProj from 'ol/proj'
import TileLayer from 'ol/layer/Tile.js'
import * as olTilegrid from 'ol/tilegrid'
import WMTS from 'ol/source/WMTS';
import { get as getProjection } from 'ol/proj';


import { onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

// 定义切片网格的起始点
const origin = [107.767, 27.8465]; // 从 XML 的 <Origin> 标签中获取

// 定义分辨率数组，对应于 XML 中的 <TileSet> 标签中的 units-per-pixel 值
const resolutions = [
  0.703125,
  0.351562,
  0.175781,
  // ... (其他的分辨率)
  1.3411e-06,
  6.70552e-07
];

// 创建自定义的切片网格
const tileGrid = new olTilegrid({
  origin: origin,
  resolutions: resolutions,
  tileSize: [256, 256]
});

// 创建 WMTS 图层源
const wmtsSource = new WMTS({
  tileGrid: tileGrid,
  projection: getProjection('EPSG:4326')
});

function initMap() {
  var extent4326 = [107.76665776664075, 27.846470221647493, 107.78109147363128, 27.865654636273387]

  new Map({
    target: 'openlayerXYZ-map',
    layers: [
      //矢量
      new TileLayer({
        source: new olSource.XYZ({
          url: proxy.$mapBaseUrl + '/608B2192_DOM_Tiles/{z}/{x}/{y}.png',
          projection: 'EPSG:4326',
          minResolution: 0.703125,
          // eslint-disable-next-line no-unused-vars
          tileLoadFunction: (imageTile, src) => {
            // console.log('%c [ imageTile ]-30', 'font-size:13px; background:pink; color:#bf2c9f;', imageTile)
            // console.log('%c [ src ]-30', 'font-size:13px; background:pink; color:#bf2c9f;', src)
            // imageTile.getImage().src = proxy.$mapBaseUrl + '/608B2192_DOM_Tiles' + '/' + Z + '/' + Y + '/' + X + '.png'

            // imageTile.getImage().src = proxy.$mapBaseUrl + '/608B2192_DOM_Tiles/'+  imageTile.tileCoord[0]+'/'+imageTile.tileCoord[1]*2+'/'+imageTile.tileCoord[2]*2+'.png'
          }
        })
      })
    ],
    view: new View({
      center: [107.767, 27.8465],
      // center: olProj.fromLonLat([107.767, 27.8465]),
      zoom: 6,
      projection: 'EPSG:4326',
      extent: extent4326
    })
  })
}
onMounted(() => {
  initMap()
})
</script>

<style scoped lang="scss">
.openlayerXYZ-map {
  height: 100%;
  width: 100%;
}
</style>
