<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入搜索用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="modern-btn modern-btn-primary">搜索</el-button>
        <el-button type="info" class="modern-btn modern-btn-default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" icon="Plus" class="modern-btn modern-btn-primary" @click="addUser">添加用户</el-button>
    <el-button type="danger" icon="Delete" class="modern-btn modern-btn-danger">批量删除</el-button>
    <!-- 表格展示用户信息 -->
    <el-table style="margin: 10px 0;" border :data="userArr">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名" align="center" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户昵称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="330px">
        <template #="{ row, $index }">
          <el-button type="primary" icon="User" class="modern-btn modern-btn-primary table-btn"
            @click="setRole(row)">分配角色</el-button>
          <el-button type="success" icon="Edit" class="modern-btn modern-btn-success table-btn"
            @click="updateUser(row)">编辑</el-button>
          <el-button type="danger" icon="Delete" class="modern-btn modern-btn-danger table-btn">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
      :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="total"
      @current-change="getUserList" @size-change="handler" />
  </el-card>
  <!-- 抽屉结构:完成添加和修改 -->
  <el-drawer v-model="drawer" direction="rtl">
    <!-- 头部标题：内容动态 -->
    <template #header>
      <h4>{{ userParams.id ? '修改用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="用户名:" prop="username">
          <el-input placeholder="请输入用户名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称:" prop="name">
          <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码:" prop="password" v-if="!userParams.id">
          <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" class="drawer-btn drawer-btn-confirm" @click="save">确定</el-button>
        <el-button class="drawer-btn drawer-btn-cancel" @click="cancel">取消</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉结构：完成分配角色 -->
  <el-drawer v-model="drawer1" direction="rtl">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户名:">
          <el-input :disabled="true" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox style="margin-right: 10px;" v-model="checkAll" :indeterminate="isIndeterminate"
            @change="handleCheckAllChange">全选</el-checkbox>
          <!-- 显示角色的复选框 -->
          <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button class="drawer-btn drawer-btn-cancel" @click="drawer1 = false">取消</el-button>
        <el-button type="primary" class="drawer-btn drawer-btn-confirm" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, reactive, nextTick } from 'vue'
import {
  reqAddOrUpdateUser,
  reqAllRole,
  reqRemoveBatchUser,
  reqRemoveUser,
  reqSetUserRole,
  reqUserList
} from '@/api/acl/user'
import type {
  AllRole,
  AllRoleResponseData,
  Records,
  SetRoleData,
  User,
  UserResponseData
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
// 默认页码
let pageNo = ref<number>(1)
// 默认每页显示数量
let pageSize = ref<number>(3)
// 列表总条数
let total = ref<number>(0)
// 获取列表数据
let userArr = ref<Records>([])
// 定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: ''
})
// 控制分配角色抽屉的显示与隐藏
let drawer1 = ref<boolean>(false)
// 获取form组件实例
let formRef = ref<any>()
// 全选框状态
let checkAll = ref<boolean>(false)
// 设置不确定状态，仅负责样式控制
let isIndeterminate = ref<boolean>(true)
// 存储全部职位的数据
let allRole = ref<AllRole>([])
// 当前用户已有的角色
let userRole = ref<AllRole>([])
onMounted(() => {
  // 获取用户列表数据
  getUserList()
})

// 组件被激活时也获取数据（针对keep-alive）
onActivated(() => {
  getUserList()
})

// 获取全部已有的用户信息
const getUserList = async (pager = 1) => {
  // 收集当前的页码
  pageNo.value = pager
  let result: UserResponseData = await reqUserList(pageNo.value, pageSize.value, '')
  if (result.code === 200) {
    // 获取用户列表数据
    userArr.value = result.data.records
    // 获取总条数
    total.value = result.data.total
  }
}

// 分页器下拉菜单自定义事件回调
const handler = () => {
  getUserList()
}

// 添加用户按钮回调
const addUser = () => {
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    id: null,
    username: '',
    name: '',
    password: ''
  })
  // 清除上一次错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

// 更新已有的用户按钮回调
// row:已有的用户的账号信息
const updateUser = (row: User) => {
  drawer.value = true
  // 存储收集已有的账号信息
  Object.assign(userParams, row)
  // 清除上一次错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

// 保存用户信息回调
const save = async () => {
  // 表单校验
  let isValid = await formRef.value.validate()
  if (!isValid) return
  // 保存按钮：添加或修改
  let result = await reqAddOrUpdateUser(userParams)
  if (result.code === 200) {
    ElMessage({
      message: userParams.id ? '修改用户成功' : '添加用户成功',
      type: 'success'
    })
    // 关闭抽屉
    drawer.value = false
    // 获取用户列表数据
    // getUserList(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新页面
    window.location.reload()
  } else {
    ElMessage({
      message: userParams.id ? '修改用户失败' : '添加用户失败',
      type: 'error'
    })
    drawer.value = false
  }
}

// 取消按钮回调
const cancel = () => {
  drawer.value = false
}

// 校验用户名的回调函数
const validatorUsername = (rule: any, value: string, callback: any) => {
  // 用户名长度为5-10位
  if (value.length >= 5 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('用户名长度在 5 到 10 个字符'))
  }
}

// 校验用户昵称的回调函数
const validatorName = (rule: any, value: string, callback: any) => {
  // 用户昵称长度为1-10位
  if (value.length >= 2 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('用户昵称长度在 2 到 10 个字符'))
  }
}

// 校验用户密码的回调函数
const validatorPassword = (rule: any, value: string, callback: any) => {
  // 用户密码长度为6-15位
  if (value.length >= 6 && value.length <= 15) {
    callback()
  } else {
    callback(new Error('用户密码长度在 6 到 15 个字符'))
  }
}

// 表单校验的规则对象
const rules = {
  // 用户名
  username: [
    { required: true, trigger: 'blur', validator: validatorUsername }
  ],
  // 用户昵称
  name: [
    { required: true, trigger: 'blur', validator: validatorName }
  ],
  // 用户密码
  password: [
    { required: true, trigger: 'blur', validator: validatorPassword }
  ]
}

// 点击分配角色按钮的回调
const setRole = async (row: User) => {
  drawer1.value = true
  // 存储已有的用户信息
  Object.assign(userParams, row)
  // 获取全部的职位数据和当前用户已有职位的数据
  let result: AllRoleResponseData = await reqAllRole((userParams.id as number))
  if (result.code === 200) {
    // 获取全部职位数据
    allRole.value = result.data.allRolesList
    // 获取已有的职位数据
    userRole.value = result.data.assignRoles
    drawer1.value = true
  }
}

// 全选复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}

// 底部复选框change事件
const handleCheckedCitiesChange = (value: string[]) => {
  // 已经勾选项目的长度
  let checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

// 保存分配角色的回调
const confirmClick = async () => {
  // 收集参数
  let data: SetRoleData = {
    roleIdList: userRole.value.map(item => {
      return (item.id as number)
    }),
    userId: userParams.id as number
  }
  // 分配用户职位
  let result: any = await reqSetUserRole(data)
  if (result.code === 200) {
    ElMessage({
      message: '分配角色成功',
      type: 'success'
    })
    // 关闭抽屉
    drawer1.value = false
    // 获取用户列表数据
    getUserList(pageNo.value)
  } else {
    ElMessage({
      message: '分配角色失败',
      type: 'error'
    })
  }
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// 现代化按钮样式
.modern-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:not(:last-child) {
    margin-right: 12px;
  }

  .el-icon {
    margin-right: 6px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
  }
}

// 主要按钮样式
.modern-btn-primary {
  background-color: #409eff;
  border-color: #409eff;
  color: white;

  &:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  }

  &:active {
    background-color: #3a8ee6;
    border-color: #3a8ee6;
  }
}

// 默认按钮样式
.modern-btn-default {
  background-color: #ffffff;
  border-color: #dcdfe6;
  color: #606266;

  &:hover {
    background-color: #f5f7fa;
    border-color: #c0c4cc;
    color: #606266;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: #e9ebee;
    border-color: #dcdfe6;
  }
}

// 成功按钮样式
.modern-btn-success {
  background-color: #67c23a;
  border-color: #67c23a;
  color: white;

  &:hover {
    background-color: #85ce61;
    border-color: #85ce61;
    box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
  }

  &:active {
    background-color: #5daf34;
    border-color: #5daf34;
  }
}

// 危险按钮样式
.modern-btn-danger {
  background-color: #f56c6c;
  border-color: #f56c6c;
  color: white;

  &:hover {
    background-color: #f78989;
    border-color: #f78989;
    box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
  }

  &:active {
    background-color: #dd6161;
    border-color: #dd6161;
  }
}

// 表格内的按钮缩小版
.table-btn {
  padding: 6px 12px;
  font-size: 13px;

  &:not(:last-child) {
    margin-right: 8px;
  }

  .el-icon {
    margin-right: 4px;
    font-size: 14px;
  }
}

// 抽屉按钮样式
.drawer-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
}

.drawer-btn-cancel {
  background-color: #ffffff;
  border-color: #dcdfe6;
  color: #606266;

  &:hover {
    background-color: #f5f7fa;
    border-color: #c0c4cc;
    color: #606266;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: #e9ebee;
    border-color: #dcdfe6;
  }
}

.drawer-btn-confirm {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
  min-width: 80px;

  &:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  }

  &:active {
    background-color: #3a8ee6;
    border-color: #3a8ee6;
  }
}
</style>