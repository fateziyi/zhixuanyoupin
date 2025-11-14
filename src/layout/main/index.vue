<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
// 获取骨架小仓库
import useLayoutSettingStore from '@/store/modules/setting';

defineOptions({
  name: 'Main'
})

const LayoutSettingStore = useLayoutSettingStore()
// 控制当前组件是否销毁重建
const flag = ref(true)
// 监听仓库内部数据是否改变，如果改变则重新获取数据
watch(() => LayoutSettingStore.refresh, () => {
  // 点击刷新按钮，路由组件销毁
  flag.value = false
  nextTick(() => {
    // 重建组件
    flag.value = true
  })
})
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