<template>
  <el-card>
    <el-table border style="margin: 10px 0;" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
      <el-table-column label="名称" width="300px" show-overfolw-tooltip align="center" prop="skuName"></el-table-column>
      <el-table-column label="描述" width="300px" show-overfolw-tooltip align="center" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" width="250px" align="center">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="150px" align="center" prop="weight"></el-table-column>
      <el-table-column label="价格" width="150px" align="center" prop="price"></el-table-column>
      <el-table-column label="操作" width="350px" align="center" fixed="right">
        <template #="{ row, $index }">
          <el-button :type="row.isSale == 1 ? 'warning' : 'primary'" size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            :class="row.isSale == 1 ? 'sku-button sku-button--down' : 'sku-button sku-button--up'"
            @click="updateSale(row)">
            {{ row.isSale == 1 ? '下架' : '上架' }}
          </el-button>
          <el-button type="success" size="small" icon="Edit" class="sku-button sku-button--edit"
            @click="updateSku">编辑</el-button>
          <el-button type="info" size="small" icon="InfoFilled" class="sku-button sku-button--info"
            @click="findSku(row)">详情</el-button>
          <el-popconfirm :title="`你确定要删除${row.skuName}吗？`" @confirm="removeSku(row)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" class="sku-button sku-button--delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
      :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="total" @current-change="getHasSku"
      @size-change="changeSize" />
    <!-- 抽屉组件：展示商品详情 -->
    <el-drawer v-model="drawer" direction="rtl">
      <template #header>
        <h4>商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 5px 5px;" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{ item.valueName
            }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag type="success" style="margin: 5px 5px;" v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id">{{ item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="width: 100%; height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入请求
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku'
import type { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
// 分页器当前页码
let pageNo = ref<number>(1)
// 分页器每页显示的条数
let pageSize = ref<number>(5)
// 总共几条数据
let total = ref<number>(0)
// 存放已存在的SKU数据
let skuArr = ref<SkuData[]>([])
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
// 获取已有SKU列表数据
let skuInfo = ref<SkuData>({})
// 组件挂载完毕
onMounted(() => {
  getHasSku()
})
const getHasSku = async (pager = 1) => {
  // 当前分页器的页码
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    // 获取SKU列表数据
    skuArr.value = result.data.records
    // 获取总条数
    total.value = result.data.total
  }
}

// 分页器下拉菜单发生变化时触发
const changeSize = (size: number) => {
  pageSize.value = size
  getHasSku()
}
// 商品上架与下架的操作
const updateSale = async (row: SkuData) => {
  if (row.isSale === 1) {
    // 当前是上架状态，点击按钮进行下架
    await reqCancelSale((row.id as number))
    ElMessage.success('商品下架成功')
    getHasSku(pageNo.value)
  } else {
    // 当前是下架状态，点击按钮进行上架
    await reqSaleSku((row.id as number))
    ElMessage.success('商品上架成功')
    getHasSku(pageNo.value)
  }
}
// 编辑按钮
const updateSku = () => {
  ElMessage.success('程序员正在努力开发中...')
}
// 详情按钮
const findSku = async (row: SkuData) => {
  drawer.value = true
  // 获取已有商品详情数据
  let result: SkuInfoData = await reqSkuInfo((row.id as number))
  // 存储已有的sku
  skuInfo.value = result.data
}
// 删除按钮
const removeSku = async (row: SkuData) => {
  try {
    console.log('正在删除SKU，ID:', row.id);
    let result = await reqRemoveSku((row.id as number))
    console.log('删除SKU响应:', result);
    if (result.code === 200) {
      ElMessage.success('删除成功')
      getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
      ElMessage.error('删除失败: ' + (result.message || '未知错误'))
    }
  } catch (error) {
    console.error('删除SKU时发生异常:', error);
    ElMessage.error('删除失败: ' + (error as Error).message)
  }
}
</script>

<style scoped lang="scss">
.sku-button {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  margin: 0 4px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  i {
    margin-right: 4px;
    font-size: 12px;
  }
}

.sku-button--up {
  background: linear-gradient(135deg, #409eff, #1b75d0);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #66b1ff, #409eff);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
  }
}

.sku-button--down {
  background: linear-gradient(135deg, #e6a23c, #b88230);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #ebb563, #e6a23c);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(230, 162, 60, 0.3);
  }
}

.sku-button--edit {
  background: linear-gradient(135deg, #67c23a, #3b9e1d);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #85ce61, #67c23a);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(103, 194, 58, 0.3);
  }
}

.sku-button--info {
  background: linear-gradient(135deg, #909399, #696c72);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #a6a9ad, #909399);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(144, 147, 153, 0.3);
  }
}

.sku-button--delete {
  background: linear-gradient(135deg, #f56c6c, #d93a3a);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #f78989, #f56c6c);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(245, 108, 108, 0.3);
  }
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>