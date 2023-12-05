<template>
  <div class="map-box" id="map-dom"></div>
</template>

<script setup>
import { Cartesian3, SceneMode, ShadowMode, Viewer, Math as CesiumMath,
  Rectangle,
  GeographicTilingScheme,
  UrlTemplateImageryProvider,
} from 'cesium'
import { onMounted } from 'vue'

function initCesiumMap (){
  const viewer = new Viewer('map-dom', {
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
    selectionIndicator: false,
  })
  viewer.imageryLayers.removeAll()

  viewer.cesiumWidget.creditContainer.style.display = 'none'

  viewer.shadows = true
  viewer.terrainShadows = ShadowMode.ENABLED

  viewer.scene.camera.setView({
    destination: Cartesian3.fromDegrees(89.4638009, 22.071171, 20118063.09),
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-90),
      roll: CesiumMath.toRadians(0),
    },
  })

  viewer.imageryLayers.addImageryProvider(
    new UrlTemplateImageryProvider({
      // 使用"zz" "yy" "xx" 是因为在cesium中自定义占位符号，使用xx yy zz以供后续更改请求地址时获取正确的拼接结果，对应customTags中的xx yy zz
      url: 'geoscene/static/servers/earthGll/_alllayers/{zz}/{yy}/{xx}.jpg',
      rectangle: Rectangle.fromDegrees(-180, -90, 180, 90),
      minimumLevel: 0,
      maximumLevel: 8,
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
        },
      },
    })
  )
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

onMounted(() => {
  initCesiumMap()
})
</script>

<style scoped>
.map-box {
  height: 100%;
}
</style>
