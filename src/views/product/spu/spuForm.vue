<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select class="spu-select" placeholder="请选择" v-model="SpuParams.tmId">
          <el-option v-for="(item, index) in AllTradeMark" :key="item.id" :label="item.tmName"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input placeholder="请输入相关描述" type="textarea" v-model="SpuParams.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <!-- 展示销售属性的下拉菜单 -->
        <el-select class="spu-select" placeholder="请选择">
          <el-option label="华为"></el-option>
        </el-select>
        <el-button class="spu-button add-value-button" style="margin-left: 10px;" type="primary" size="default"
          icon="Plus">添加属性值</el-button>
        <!-- 展示销售属性与属性值 -->
        <el-table border style="margin: 10px 0;">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" align="center"></el-table-column>
          <el-table-column label="属性值" align="center"></el-table-column>
          <el-table-column label="操作" width="120px" align="center">
            <template #default>
              <el-button class="spu-button save-button" type="primary" size="small">保存</el-button>
              <el-button class="spu-button delete-button" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button class="spu-button save-button" type="primary" size="default">保存</el-button>
        <el-button @click="cancel" class="spu-button cancel-button" type="info" size="default">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SpuData } from '@/api/product/spu/type'
import { reqAllTrademark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr } from '@/api/product/spu'
import type { AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, Trademark, SpuImg, SaleAttr, HasSaleAttr } from '@/api/product/spu/type'

let $emit = defineEmits(['changeScene'])
// 点击取消按钮：通知父组件切换场景为1，展示已有的SPU数据
const cancel = () => {
  $emit('changeScene', 0)
}
// 存储已有的SPU数据
let AllTradeMark = ref<Trademark[]>([])
// 商品图片
let imgList = ref<SpuImg[]>([])
// 已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
// 存储全部销售属性数据
let allSaleAttr = ref<HasSaleAttr[]>([])
// 存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})

const initHasSpuData = async (spu: SpuData) => {
  // 存储已有的SPU对象，将来在模版中展示
  SpuParams.value = { ...spu }
  // spu:父组件传递过来的已有的SPU数据【不完整】
  // 获取全部品牌数据
  let result: AllTradeMark = await reqAllTrademark()
  // 获取某一品牌旗下所有售卖商品的图片
  let result1: SpuHasImg = await reqSpuImageList((spu.id as number))
  // 获取某一品牌下所有销售属性
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number))
  // 获取全部销售属性数据
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  // 存储全部品牌的数据
  AllTradeMark.value = result.data
  // 存储某一品牌旗下所有售卖商品的图片
  imgList.value = result1.data
  // 存储已有的SPU销售属性
  saleAttr.value = result2.data
  // 存储全部销售属性数据
  allSaleAttr.value = result3.data
}

defineExpose({
  initHasSpuData
})
</script>

<style scoped lang="scss">
// SPU表单中选择器样式
.spu-select {
  width: 200px;
}

// SPU表单按钮基础样式
.spu-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
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
    margin-right: 6px;
  }
}

// 特定按钮样式
.save-button {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: white;

  &:hover {
    background-color: var(--el-color-primary-dark-2);
    border-color: var(--el-color-primary-dark-2);
    color: white;
  }

  &:active {
    color: white;
  }
}

.cancel-button {
  background-color: var(--el-color-info);
  border-color: var(--el-color-info);
  color: white;

  &:hover {
    background-color: var(--el-color-info-dark-2);
    border-color: var(--el-color-info-dark-2);
    color: white;
  }

  &:active {
    color: white;
  }
}

.add-value-button {
  padding: 8px 16px;
  font-size: 13px;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: white;

  &:hover {
    background-color: var(--el-color-primary-dark-2);
    border-color: var(--el-color-primary-dark-2);
    color: white;
  }

  &:active {
    color: white;
  }
}

.delete-button {
  background-color: var(--el-color-danger);
  border-color: var(--el-color-danger);
  color: white;

  &:hover {
    background-color: var(--el-color-danger-dark-2);
    border-color: var(--el-color-danger-dark-2);
    color: white;
  }

  &:active {
    color: white;
  }
}
</style>