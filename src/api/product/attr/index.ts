// 属性相关的API文件
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData } from './type'
// 属性管理模块的地址
enum API {
  // 获取一级分类接口地址
  C1_URL = '/admin/product/getCategory1',
  // 获取二级分类接口地址
  C2_URL = '/admin/product/getCategory2',
  // 获取三级分类接口地址
  C3_URL = '/admin/product/getCategory3',
  // 获取属性接口地址
  ATTR_URL = '/admin/product/attrInfoList',
}

// 获取一级分类接口的方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
// 获取二级分类接口的方法
export const reqC2 = (c1Id: number | string) => request.get<any, CategoryResponseData>(`${API.C2_URL}/${c1Id}`)
// 获取三级分类接口的方法
export const reqC3 = (c2Id: number | string) => request.get<any, CategoryResponseData>(`${API.C3_URL}/${c2Id}`)
// 获取属性接口的方法
export const reqAttr = (c1Id: number | string, c2Id: number | string, c3Id: number | string) => request.get<any, AttrResponseData>(`${API.ATTR_URL}/${c1Id}/${c2Id}/${c3Id}`)