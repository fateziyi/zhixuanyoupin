<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category />
    <!-- 属性管理 -->
    <el-card style="margin: 10px 0;">
      <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true" class="add-attr-button">
        添加属性
      </el-button>
      <el-table border style="margin: 10px 0;" :data="attrArr">
        <el-table-column label="序号" width="80px" align="center" type="index">
        </el-table-column>
        <el-table-column label="属性名称" width="180px" align="center" prop="attrName">
        </el-table-column>
        <el-table-column label="属性值名称" align="center">
          <template #="{ row, $index }">
            <el-tag v-for="(item, index) in row.attrValueList" :key="item.id" style="margin: 5px;">
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template #="{ row, $index }">
            <el-button type="success" size="default" icon="Edit" circle class="edit-button"></el-button>
            <el-button type="danger" size="default" icon="Delete" circle class="delete-button" style="margin-left: 10px;"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// 引入获取已有属性与属性值接口
import { reqAttr } from '@/api/product/attr';
import type { AttrResponseData, Attr } from '@/api/product/attr/type';
// 获取分类仓库
import useCategoryStore from '@/store/modules/category';
let categoryStore = useCategoryStore();
// 存储已有的属性与属性值
let attrArr = ref<Attr[]>([])
// 监听仓库三级分类ID变化
watch(() => categoryStore.c3Id, () => {
  // 清空上一次查询的属性与属性值
  attrArr.value = []
  // 保证三级分类ID不为空
  if (!categoryStore.c3Id)
    return
  // 解构获取分类的ID
  getAttr()

})
// 获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  // 获取分类下的已有的属性和属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}

</script>

<style scoped lang="scss">
.add-attr-button {
  // 内边距调整，确保文字和图标有合适的空间
  padding: 12px 10px;

  // 字体样式优化
  font-size: 14px;
  font-weight: 500;

  // 使用flex布局确保图标和文字垂直居中对齐
  display: inline-flex;
  align-items: center;
  justify-content: center;

  // 图标与文字间距
  :deep(.el-icon) {
    margin-right: 8px;
  }

  // 按钮圆角
  border-radius: 4px;

  // hover状态优化
  &:hover {
    background-color: var(--el-color-primary-dark-2);
    border-color: var(--el-color-primary-dark-2);
    color: white;
  }

  // focus状态保持一致
  &:focus {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    color: white;
  }

  // active状态略微加深
  &:active {
    background-color: var(--el-color-primary-dark-2);
    border-color: var(--el-color-primary-dark-2);
    color: white;
  }

  // 禁用状态保持一致性
  &:disabled {
    background-color: var(--el-color-primary-light-5);
    border-color: var(--el-color-primary-light-5);
    color: white;
    cursor: not-allowed;
  }

  // 添加过渡动画使交互更流畅
  transition: all 0.3s ease;
}

// 编辑按钮样式
.edit-button {
  // 使用Element Plus默认样式
  // hover状态优化
  &:hover {
    background-color: var(--el-color-success-dark-2);
    border-color: var(--el-color-success-dark-2);
    color: white;
  }

  // focus状态保持一致
  &:focus {
    background-color: var(--el-color-success);
    border-color: var(--el-color-success);
    color: white;
  }

  // active状态略微加深
  &:active {
    background-color: var(--el-color-success-dark-2);
    border-color: var(--el-color-success-dark-2);
    color: white;
  }

  // 添加过渡动画使交互更流畅
  transition: all 0.3s ease;
}

// 删除按钮样式
.delete-button {
  // 使用Element Plus默认样式
  // hover状态优化
  &:hover {
    background-color: var(--el-color-danger-dark-2);
    border-color: var(--el-color-danger-dark-2);
    color: white;
  }

  // focus状态保持一致
  &:focus {
    background-color: var(--el-color-danger);
    border-color: var(--el-color-danger);
    color: white;
  }

  // active状态略微加深
  &:active {
    background-color: var(--el-color-danger-dark-2);
    border-color: var(--el-color-danger-dark-2);
    color: white;
  }

  // 添加过渡动画使交互更流畅
  transition: all 0.3s ease;
}
</style>