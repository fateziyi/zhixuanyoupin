<template>
  <!-- 路由组件出口的位置 -->
  <router-view />
</template>

<script lang="ts">
export default {
  name: 'Main'
}
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>