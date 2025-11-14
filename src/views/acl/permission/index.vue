<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="菜单名称:">
        <el-input placeholder="请输入搜索菜单名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button type="info">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" icon="Plus">添加菜单</el-button>
    <!-- 表格展示菜单信息 -->
    <el-table style="margin: 10px 0;" border :data="menuArr" row-key="id">
      <el-table-column label="菜单名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="菜单图标" align="center" prop="icon" show-overflow-tooltip></el-table-column>
      <el-table-column label="菜单路径" align="center" prop="path" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="240px">
        <template #="{ row, $index }">
          <el-button type="primary" icon="Plus">添加</el-button>
          <el-button type="success" icon="Edit">编辑</el-button>
          <el-button type="danger" icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 菜单数据
let menuArr = ref<any[]>([])

onMounted(() => {
  // 模拟获取菜单数据
  getMenuList()
})

// 获取菜单列表数据
const getMenuList = () => {
  // 模拟数据
  menuArr.value = [
    {
      id: 1,
      name: '首页',
      icon: 'HomeFilled',
      path: '/home',
      createTime: '2023-01-01',
      updateTime: '2023-01-01'
    }
  ]
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>