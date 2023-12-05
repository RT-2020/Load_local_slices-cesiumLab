<script setup>
// import Map from '../components/openlayerTest.vue'


</script>

<template>
  <div class="map-demo">
    <div class="map-demo-buttons">
      <button @click="$router.push('/openlayer')">OpenLayers 示例</button>
      <button @click="$router.push('/cesium')">Cesium 示例</button>
    </div>

    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.map-demo {
  width: 100%;
  height: 100%;
  .map-demo-buttons{
    position: absolute;
    z-index: 999;
    top: 1em;
    right: 2em;
    display: flex;
    gap: 5px;
    flex-direction: row;
    justify-content: space-around;

    button{
      padding: 5px 10px;
    }
  }
}
</style>
