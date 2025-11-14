<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div
      class="layout_slider"
      :class="{ fold: LayoutsettingStore.fold ? true : false }"
    >
      <Logo></Logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar" ref="scrollbarRef" always>
        <!-- 展示菜单-->
        <el-menu
          :collapse="LayoutsettingStore.fold ? true : false"
          :default-active="$route.path"
          background-color="#f8f8f8"
          text-color="#515767"
          active-text-color="#409eff"
          :collapse-transition="true"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div
      class="layout_tabbar"
      :class="{ fold: LayoutsettingStore.fold ? true : false }"
    >
      <!-- layout组件的顶部导航栏 -->
      <Tabbar></Tabbar>
    </div>
    <!-- 内容区域 -->
    <div
      class="layout_main"
      :class="{ fold: LayoutsettingStore.fold ? true : false }"
    >
      <!-- 移除el-scrollbar以解决路由切换问题 -->
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入左侧Logo组件
import Logo from './logo/index.vue'
// 引入左侧菜单组件
import Menu from './menu/index.vue'
// 右侧内容展示区域
import Main from './main/index.vue'
// 引入顶部tabbar组件
import Tabbar from './tabbar/index.vue'
// 获取路由对象
import { useRoute } from 'vue-router'
// 引入用户相关的小仓库
import useUserStore from '../store/modules/user'
import useLayoutSettingStore from '../store/modules/setting'
import { onMounted } from 'vue'

defineOptions({
  name: 'Layout'
})

const userStore = useUserStore()
const LayoutsettingStore = useLayoutSettingStore()
const $route = useRoute()

// 在组件挂载时获取用户信息
onMounted(() => {
  userStore.userInfo().catch(error => {
    console.error('获取用户信息失败:', error)
  })
})
</script>

<style scoped lang="scss">
@use '@/styles/variable.scss' as *;

.layout_container {
  width: 100%;
  height: 100vh;
  background-color: white;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: #f8f8f8;
    padding: 10px 0;
    box-sizing: border-box;
    min-height: 60px;
    border-right: 0.5px solid #f5f5f5;
    transition: width 0.3s ease;
    overflow: hidden;
    .scrollbar {
      padding-top: 10px;
      width: 100%;
      height: calc(100vh - $base-menu-logo-height - 20px);
      .el-menu {
        border-right: none;
        transition: all 0.3s ease;
        :deep(.el-menu-item),
        :deep(.el-sub-menu__title) {
          transition: all 0.3s ease;
        }

        /* 菜单展开时的字体显示优化 */
        :deep(.el-sub-menu__title span),
        :deep(.el-menu-item span) {
          opacity: 1;
          transition: opacity 0.3s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* 图标和文字的布局优化 */
        :deep(.el-menu-item .el-icon),
        :deep(.el-sub-menu__title .el-icon) {
          flex-shrink: 0;
          margin-right: 8px;
        }
      }
    }
    &.fold {
      width: $base-menu-min-width;
      transition: width 0.3s ease;
    }
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    left: $base-menu-width;
    top: 0;
    transition: all 0.3s ease;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
      transition: all 0.3s ease;
    }
  }
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    transition: all 0.3s ease;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
      transition: all 0.3s ease;
    }

    // 滚动条样式
    :deep(.el-scrollbar) {
      width: 100%;
      height: 100%;
    }
  }
}

/* 全局样式：当菜单折叠时隐藏子菜单的箭头 */
:global(
    .el-menu--collapse
      .el-sub-menu
      > .el-sub-menu__title
      .el-sub-menu__icon-arrow
  ) {
  display: none;
}

/* 改善菜单项在折叠/展开时的过渡效果 */
:global(.el-menu--vertical),
:global(.el-menu--popup),
:global(.el-menu--inline) {
  transition: all 0.3s ease;
}

/* 菜单项标题过渡效果 */
:global(.el-sub-menu__title),
:global(.el-menu-item) {
  transition: all 0.3s ease;
}

/* 确保在菜单展开时文字正确显示 */
:global(.el-menu-item .el-menu-tooltip__trigger) {
  width: 100%;
}

/* 文字样式优化 */
:global(.el-menu-item span),
:global(.el-sub-menu .el-sub-menu__title span) {
  opacity: 1;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 菜单项图标和文字的布局 */
:global(.el-menu-item),
:global(.el-sub-menu__title) {
  display: flex;
  align-items: center;
}

:global(.el-menu-item .el-icon),
:global(.el-sub-menu__title .el-icon) {
  flex-shrink: 0;
  margin-right: 8px;
}
</style>