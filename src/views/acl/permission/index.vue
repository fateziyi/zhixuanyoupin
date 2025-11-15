<template>
  <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" align="center" prop="code"></el-table-column>
    <el-table-column label="修改时间" align="center" prop="updateTime"></el-table-column>
    <el-table-column label="操作" align="center">
      <template #="{ row, $index }">
        <el-button @click="addPermission(row)" type="primary" icon="Plus" class="table-button add-button"
          v-show="row.level !== 4">{{ row.level == 3
            ? '添加功能' : '添加菜单'
          }}</el-button>
        <el-button @click="updatePermission(row)" type="primary" icon="Edit" class="table-button edit-button"
          :disabled="row.level == 1 ? true : false">编辑</el-button>
        <el-popconfirm :title="`你确定要删除${row.name}吗？`" width="260px" @confirm="RemoveMenu(row.id)">
          <template #reference>
            <el-button type="danger" icon="Delete" class="table-button delete-button"
              :disabled="row.level == 1 ? true : false">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogVisible" :title="menuData.id ? '修改菜单' : '添加菜单'" width="500px">
    <!-- 表单组件，收集新增与已有的菜单数据 -->
    <el-form>
      <el-form-item label="名称：">
        <el-input placeholder="请输入菜单名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限值：">
        <el-input placeholder="请输入权限数值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false" class="dialog-button cancel-button">取消</el-button>
        <el-button type="primary" @click="save" class="dialog-button confirm-button">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
// 引入获取菜单请求API
import { reqAddOrUpdateMenu, reqAllPermisson, reqRemoveMenu } from '@/api/acl/menu'
import type {
  MenuParams,
  Permission,
  PermissionList,
  PermissionResponsData,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'
// 存储表单数据
let permissionArr = ref<PermissionList>([])
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 携带的参数
let menuData = reactive<MenuParams>({
  id: 0,
  level: 0,
  code: '',
  name: '',
  pid: 0,
})
// 组件挂载完毕
onMounted(() => {
  getHasPermissionList()
})

// 获取菜单数据的方法
const getHasPermissionList = async () => {
  const result = await reqAllPermisson()
  if (result.code === 200) {
    permissionArr.value = result.data
  }
}

// 点击添加按钮的回调
const addPermission = (row: Permission) => {
  // 清空数据
  Object.assign(menuData, {
    id: 0,
    level: 0,
    code: '',
    name: '',
    pid: 0,
  })
  dialogVisible.value = true
  // 收集新增的菜单的level值
  menuData.level = row.level + 1
  // 新增子菜单
  menuData.pid = row.id
}

// 点击编辑按钮的回调
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  // 收集已有的菜单数据
  Object.assign(menuData, row)
}

// 点击保存按钮的回调
const save = async () => {
  const result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code === 200) {
    ElMessage.success(menuData.id ? '修改成功' : '添加成功')
    dialogVisible.value = false
    getHasPermissionList()
  } else {
    ElMessage.error(menuData.id ? '修改失败' : '添加失败')
  }
}

// 删除菜单的回调
const RemoveMenu = async (id: number) => {
  let result: any = await reqRemoveMenu(id)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    getHasPermissionList()
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped lang="scss">
.table-button {
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: bold;
  margin-right: 8px;
  color: white;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
}

.add-button {
  background-color: #67c23a;
  border-color: #67c23a;

  &:hover {
    background-color: #85ce61;
    border-color: #85ce61;
    box-shadow: 0 4px 8px rgba(103, 194, 58, 0.3);
  }
}

.edit-button {
  background-color: #409eff;
  border-color: #409eff;

  &:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
    box-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
  }
}

.delete-button {
  background-color: #f56c6c;
  border-color: #f56c6c;

  &:hover {
    background-color: #f78989;
    border-color: #f78989;
    box-shadow: 0 4px 8px rgba(245, 108, 108, 0.3);
  }
}

.dialog-button {
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: bold;
  margin-right: 8px;
  color: white;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
}

.cancel-button {
  background-color: #909399;
  border-color: #909399;

  &:hover {
    background-color: #a6a9ad;
    border-color: #a6a9ad;
    box-shadow: 0 4px 8px rgba(144, 147, 153, 0.3);
  }
}

.confirm-button {
  background-color: #409eff;
  border-color: #409eff;

  &:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
    box-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
  }
}
</style>
