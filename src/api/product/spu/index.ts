// SPU管理模块的接口
import request from '@/utils/request'
import type { HasSpuResponseData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, SpuData, SkuData, SkuInfoData } from './type'
enum API {
  // 获取已有的SPU的数据
  HASSPU_URL = '/admin/product',
  // 获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某一个SPU的图片数据
  IMAGE_URL = '/admin/product/spuImageList',
  // 获取某个SPU下全部已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList',
  // 获取全部销售属性的接口地址
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 添加SPU的接口地址
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 修改SPU的接口地址
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 追加一个新增的SKU地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 获取某一个SPU下的全部已有的SKU数据
  SKUINFO_URL = '/admin/product/findBySpuId',
  // 删除SPU的接口地址
  REMOVESPU_URL = '/admin/product/deleteSpu',
}

// 获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (page: number, limit: number, category3Id: number | string) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `/${page}/${limit}?category3Id=${category3Id}`,)
// 获取全部品牌数据
export const reqAllTrademark = () => request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
// 获取某个SPU的图片数据
export const reqSpuImageList = (spuId: number | string) => request.get<any, SpuHasImg>(API.IMAGE_URL + `/${spuId}`)
// 获取某个SPU下全部已有的销售属性接口
export const reqSpuHasSaleAttr = (spuId: number | string) => request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + `/${spuId}`)
// 获取全部的销售属性
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
// 添加或修改SPU的接口
// data：即为新增的SPU或者已有的SPU数据
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 判断是否有id，有id则为修改，没有id则为添加
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}
// 添加SKU的请求方法
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_URL, data)
// 获取某一个SPU下的全部已有的SKU数据
export const reqSkuList = (spuId: number | string) => request.get<any, any>(API.SKUINFO_URL + `/${spuId}`)
// 删除SPU的接口
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(API.REMOVESPU_URL + `/${spuId}`)
