<template>
  <div class="line-box">
    <div class="title">
      <p>未来七天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script lang="ts" setup name="Line">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
// 获取图形图表的节点
let charts = ref()

onMounted(() => {
  let mycharts = echarts.init(charts.value)
  // 设置配置项
  mycharts.setOption({
    // 标题组件
    title: {
      text: '(访问量)',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    // x|y轴
    xAxis: {
      type: 'category',
      // 两侧不留白
      boundaryGap: 0,
      // 分割线
      splitLine: {
        show: false,
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // 刻度
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#A3B1CC'
      },
      axisLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.2)' }
      }
    },
    yAxis: {
      // 分割线
      splitLine: {
        show: true,
        lineStyle: { type: 'dashed', color: 'rgba(255,255,255,0.12)' }
      },
      // 轴线设置
      axisLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.2)' }
      },
      // 刻度
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#A3B1CC'
      }
    },
    grid: {
      left: '6%',
      right: '4%',
      top: 36,
      bottom: 36,
      containLabel: true,
    },
    series: [
      {
        type: 'line',
        data: [1, 240, 6, 100, 1, 200, 2],
        // 平滑曲线
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#31C6FF' },
        emphasis: { focus: 'series' },
        // 区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(49,198,255,0.35)' },
              { offset: 1, color: 'rgba(49,198,255,0.05)' }
            ],
            global: false,
          },
        },
      },
    ],
  })
})
</script>
<style scoped lang="scss">
.line-box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px 20px;

  .title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 12px 0 12px;

    p {
      color: white;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
      margin: 0 0 6px 0;
    }
    img {
      width: 180px;
      height: 14px;
      object-fit: contain;
      opacity: 0.95;
    }
  }

  .charts {
    height: calc(100% - 68px);
    // background: red;
  }
}
</style>
