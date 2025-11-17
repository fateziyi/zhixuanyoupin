// 用于项目logo|标题配置
const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : import.meta.env.BASE_URL + '/'

export default {
  title: '智选优品运营平台',
  logo: BASE + 'logo.jpg',
  logoHidden: false
}