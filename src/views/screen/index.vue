<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <!-- 数据大屏顶部 -->
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Counter class="counter"></Counter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入顶部的子组件
import Top from "./components/top/index.vue";
// 引入左侧三个子组件
import Tourist from "./components/tourist/index.vue";
import Sex from "./components/sex/index.vue";
import Age from "./components/age/index.vue";
// 引入中间的两个子组件
import Map from "./components/map/index.vue";
import Line from "./components/line/index.vue";
// 引入右侧的三个子组件
import Year from "./components/year/index.vue";
import Rank from "./components/rank/index.vue";
import Counter from "./components/counter/index.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
// 获取数字大屏展示盒子内容的DOM元素
let screen = ref();

onMounted(() => {
  if (screen.value) {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
  }
  window.addEventListener('resize', resizeHandler)
})

// 定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return Math.min(ww, wh);
}

function resizeHandler() {
  if (screen.value) {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url("./images/bg.png") no-repeat;
  background-size: cover;

  .screen {
    transform-origin: left top;
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;

    .top {
      width: 100%;
      height: 40px
    }

    .bottom {
      display: flex;
      width: 100%;
      height: 100%;

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 20px;

        .rank {
          flex: 1.5;
        }

        .year {
          flex: 1;
        }

        .counter {
          flex: 1;
        }
      }

      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;

        .tourist {
          flex: 1;
        }

        .sex {
          flex: 1;
        }

        .age {
          flex: 1;
        }
      }

      .center {
        flex: 2;
        display: flex;
        flex-direction: column;

        .map {
          flex: 3;
        }

        .line {
          flex: 1;
        }
      }

      .right {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 0 12px;

        .rank {
          flex: 1.2;
        }

        .year {
          flex: 1;
        }

        .counter {
          flex: 1;
        }
      }
    }
  }

}
</style>