<template>
  <div class="map-box" id="map-dom"></div>
</template>

<script setup>
import {
  // eslint-disable-next-line no-unused-vars
  Cartesian3,
  SceneMode,
  ShadowMode,
  Viewer,
  // eslint-disable-next-line no-unused-vars
  Math as CesiumMath,
  Rectangle,
  Color,
  GeographicTilingScheme,
  UrlTemplateImageryProvider
} from 'cesium'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4.js'
import { onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

// 然后定义EPSG:4490坐标系
var proj4490 = '+proj=longlat +ellps=GRS80 +no_defs'
register(proj4)

// 定义转换函数
function convertCoords(xMin, yMin, xMax, yMax) {
  // 使用Proj4js将EPSG:4490坐标转换为EPSG:4326 (WGS 84)
  var bottomLeft = proj4(proj4490, 'WGS84', [xMin, yMin])
  var topRight = proj4(proj4490, 'WGS84', [xMax, yMax])

  return {
    xMin: bottomLeft[0],
    yMin: bottomLeft[1],
    xMax: topRight[0],
    yMax: topRight[1]
  }
}
/**
 * @param {Viewer} viewer
 */
let viewer, rectangle

function initCesiumMap() {
  viewer = new Viewer('map-dom', {
    sceneMode: SceneMode.SCENE3D,
    infoBox: false,
    timeline: false, // 禁用时间线控件
    animation: false, // 禁用动画控件
    homeButton: false, // 禁用主页控件
    geocoder: false, // 禁用地名搜索定位控件
    navigationHelpButton: false, // 禁用帮助控件
    sceneModePicker: false, // 禁用场景模式切换控件
    baseLayerPicker: false, // 禁用底图切换控件
    fullscreenButton: false,
    selectionIndicator: false
  })
  window.viewer = viewer
  viewer.imageryLayers.removeAll()

  viewer.cesiumWidget.creditContainer.style.display = 'none'

  viewer.shadows = false
  viewer.terrainShadows = ShadowMode.ENABLED

  viewer.imageryLayers.addImageryProvider(
    new UrlTemplateImageryProvider({
      // 使用"zz" "yy" "xx" 是因为在cesium中自定义占位符号，使用xx yy zz以供后续更改请求地址时获取正确的拼接结果，对应customTags中的xx yy zz
      url: proxy.$mapBaseUrl + '/dom/608B0591/_alllayers/{zz}/{yy}/{xx}.png',
      rectangle: rectangle,
      minimumLevel: 0,
      maximumLevel: 22,
      tilingScheme: new GeographicTilingScheme(),
      // 解析自定义占位符号
      customTags: {
        // eslint-disable-next-line no-unused-vars
        xx: (imageryProvider, x, y, level) => {
          const xx = 'C' + formatNumberLength(x, 16, 8)
          return xx
        },
        // eslint-disable-next-line no-unused-vars
        yy: (imageryProvider, x, y, level) => {
          const yy = 'R' + formatNumberLength(y, 16, 8)
          return yy
        },
        // eslint-disable-next-line no-unused-vars
        zz: (imageryProvider, x, y, level) => {
          const zz = 'L' + formatNumberLength(level, 10, 2)
          return zz
        }
      }
    })
  )
}
const getBoundXml = () => {
  fetch(proxy.$mapBaseUrl + 'dom/608B0591/bound.xml')
    .then((response) => response.text()) // 将响应转换为文本
    .then((str) => {
      const parser = new DOMParser()
      const xml = parser.parseFromString(str, 'text/xml')
      return xml
    })
    .then((data) => {
      // 处理 XML 数据
      const XMin = data.getElementsByTagName('XMin')
      const YMin = data.getElementsByTagName('YMin')
      const XMax = data.getElementsByTagName('XMax')
      const YMax = data.getElementsByTagName('YMax')
      let dealRectangle = {
        xMin: '',
        yMin: '',
        xMax: '',
        yMax: ''
      }
      for (const item of XMin) {
        dealRectangle.xMin = Number(item.textContent)
      }
      for (const item of YMin) {
        dealRectangle.yMin = Number(item.textContent)
      }
      for (const item of XMax) {
        dealRectangle.xMax = Number(item.textContent)
      }
      for (const item of YMax) {
        dealRectangle.yMax = Number(item.textContent)
      }
      // 处理坐标为4326
      rectangle = convertCoords(
        dealRectangle.xMin,
        dealRectangle.yMin,
        dealRectangle.xMax,
        dealRectangle.yMax
      )
      createTestRectangle(rectangle)
    })
    .catch((error) => {
      // 处理任何在请求中发生的错误
      console.error('Error fetching and parsing data', error)
    })
}

/**
 * 转换数字长度
 * @param {number} num 十进制数
 * @param {number} radix 要转换的进制基数
 * @param {number} length 返回的字符串长度
 */
const formatNumberLength = (num = 0, radix = 10, length = 0) => {
  let str = num.toString(radix)
  if (length === 0) {
    return str
  }
  while (str.length < length) {
    str = '0' + str
  }
  return str
}

/**
 * 创建矩形
 * @param {*} rectangle
 */
const createTestRectangle = (rectangle) => {
  // 在Cesium中绘制矩形
  window.viewer.entities.add({
    rectangle: {
      coordinates: Rectangle.fromDegrees(
        rectangle.xMin,
        rectangle.yMin,
        rectangle.xMax,
        rectangle.yMax
      ),
      material: Color.RED.withAlpha(0.5)
    }
  })
  window.viewer.camera.flyTo({
    destination: Rectangle.fromDegrees(
      rectangle.xMin,
      rectangle.yMin,
      rectangle.xMax,
      rectangle.yMax
    )
  })
}

onMounted(() => {
  initCesiumMap()
  getBoundXml()
})
</script>

<style scoped>
.map-box {
  height: 100%;
}
</style>
