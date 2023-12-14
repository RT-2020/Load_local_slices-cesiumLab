<template>
  <div class="map-box" id="map-dom"></div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { Cartesian3, SceneMode, ShadowMode, Viewer, Math as CesiumMath,
  Rectangle,
  GeographicTilingScheme,
  UrlTemplateImageryProvider,
} from 'cesium'
import { onMounted,getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()


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

  viewer.shadows = false
  viewer.terrainShadows = ShadowMode.ENABLED

  var rectangle = new Rectangle.fromDegrees(
    107.767, // XMin
    27.8465, // YMin
    107.781,   // XMax
    27.8657   // YMax
);

viewer.camera.setView({
    destination: rectangle
});

// 确保在限定的矩形范围内视图不会被剪切
viewer.scene.screenSpaceCameraController.minimumZoomDistance = 0;

  viewer.scene.camera.setView({
    // destination: Cartesian3.fromDegrees(89.4638009, 22.071171, 20118063.09),
    destination: rectangle,
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-90),
      roll: CesiumMath.toRadians(0),
    },
  })

  viewer.imageryLayers.addImageryProvider(
    new UrlTemplateImageryProvider({
      url: proxy.$mapBaseUrl + '/608B2192_DOM_Tiles/{z}/{x}/{y}.png',
      rectangle: Rectangle.fromDegrees(-180, -90, 180, 90),
      minimumLevel: 0,
      maximumLevel: 20,
      tilingScheme: new GeographicTilingScheme(),
    })
  )
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
