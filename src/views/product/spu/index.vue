<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0;">
      <div v-show="scene == 0">
        <el-button @click="addSpu" type="primary" size="default" icon="Plus" class="add-spu-button"
          :disabled="!categoryStore.c3Id">添加SPU</el-button>
        <!-- 展示已有的SPU数据 -->
        <el-table style="margin: 10px 0;" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName" align="center"></el-table-column>
          <el-table-column label="SPU描述" prop="description" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作" align="center">
            <template v-slot="{ row, $index }">
              <el-button type="primary" size="mini" icon="Plus" title="添加SKU"
                class="table-button add-button"></el-button>
              <el-button @click="updateSpu(row)" type="success" size="mini" icon="Edit" title="修改SPU"
                class="table-button edit-button"></el-button>
              <el-button type="info" size="mini" icon="View" title="查看SKU列表"
                class="table-button view-button"></el-button>
              <el-button type="danger" size="mini" icon="Delete" title="删除SPU"
                class="table-button delete-button"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[1, 3, 5, 7]"
          :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
          @current-change="getHasSpu" @size-change="changeSize" />
      </div>
      <!-- 添加/修改SPU子组件 -->
      <spuForm ref="spu" v-show="scene == 1" @changeScene="changeScene" />
      <!-- 添加/修改SKU子组件 -->
      <skuForm v-show="scene == 2" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { reqHasSpu } from '@/api/product/spu'
import type { HasSpuResponseData, Records, SpuData } from '@/api/product/spu/type'
// 引入分类的仓库
import useCategoryStore from '@/store/modules/category'
import spuForm from './spuForm.vue'
import skuForm from './skuForm.vue'
let categoryStore = useCategoryStore()
// 场景的数据
let scene = ref<number>(0) // 0：显示SPU列表 1：显示添加/修改SPU列表 2：显示添加SKU
// 分页器默认页码
let pageNo = ref<number>(1)
// 每一页显示条数
let pageSize = ref<number>(3)
// 存储已有的SPU数据
let records = ref<Records>([])
// 存储已有的SPU总个数
let total = ref<number>(0)
// 获取子组件实例spuForm
let spu = ref<any>()
// 监听三级分类ID的变化
watch(() => categoryStore.c3Id, () => {
  // 保证有三级分类ID
  if (!categoryStore.c3Id)
    return
  getHasSpu()
})
// 获取某一个三级分类下全部已有的SPU
const getHasSpu = async (page = 1) => {
  // 修改当前页码
  pageNo.value = page
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 分页器下拉菜单发生变化的时候触发
const changeSize = () => {
  getHasSpu()
}
// 添加SPU回调
const addSpu = () => {
  scene.value = 1
}
// 子组件spuForm绑定自定义事件，让子组件通知父组件切换场景为0
const changeScene = (num: number) => {
  // 子组件spuForm点击取消变为场景0，展示已有的SPU数据
  scene.value = num
}
// 修改已有的SPU的按钮的回调
const updateSpu = (row: SpuData) => {
  scene.value = 1
  // 调用子组件实例方法获取完整哟有的SPU数据
  spu.value.initHasSpuData(row)
}
</script>

<style scoped lang="scss">
.add-spu-button {
  margin-bottom: 20px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  i {
    margin-right: 8px;
    font-weight: bold;
  }
}

// 表格操作按钮样式
.table-button {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  margin: 0 4px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  i {
    margin-right: 4px;
  }
}

.add-button {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);

  &:hover {
    background-color: var(--el-color-primary-dark-2);
    border-color: var(--el-color-primary-dark-2);
  }
}

.edit-button {
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);

  &:hover {
    background-color: var(--el-color-success-dark-2);
    border-color: var(--el-color-success-dark-2);
  }
}

.view-button {
  background-color: var(--el-color-info);
  border-color: var(--el-color-info);

  &:hover {
    background-color: var(--el-color-info-dark-2);
    border-color: var(--el-color-info-dark-2);
  }
}

.delete-button {
  background-color: var(--el-color-danger);
  border-color: var(--el-color-danger);

  &:hover {
    background-color: var(--el-color-danger-dark-2);
    border-color: var(--el-color-danger-dark-2);
  }
}
</style>