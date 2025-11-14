<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="角色名称:">
        <el-input placeholder="请输入搜索角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button type="info">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" icon="Plus">添加角色</el-button>
    <el-button type="danger" icon="Delete">批量删除</el-button>
    <!-- 表格展示角色信息 -->
    <el-table style="margin: 10px 0;" border>
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="角色名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="240px">
        <template #="{ row, $index }">
          <el-button type="primary" icon="User">分配权限</el-button>
          <el-button type="success" icon="Edit">编辑</el-button>
          <el-button type="danger" icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
      :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="total" />
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 默认页码
let pageNo = ref<number>(1)
// 默认每页显示数量
let pageSize = ref<number>(3)
// 列表总条数
let total = ref<number>(0)
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>