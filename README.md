智选优品运营平台（前端）

一个基于 Vue 3 + Vite + TypeScript 的中后台管理与数据可视化平台。包含登录与权限路由、菜单导航、数据大屏（游客趋势、年龄占比、性别分布、热门景区排行、年度对比、雷达统计、全国地图等）。

技术栈（分类）

- 框架与语言：Vue 3、TypeScript
- 路由与状态：Vue Router、Pinia
- 构建与工具：Vite 7、ESLint、Prettier、Stylelint、Husky
- UI 组件：Element Plus、Element Plus Icons
- 可视化：ECharts、echarts-liquidfill
- 网络与数据：Axios、Mock

功能模块：顶部导航与面包屑；左侧菜单与 Logo 展示；商品管理（品牌、属性、SPU、SKU）；数据大屏（地图、趋势、性别、年龄、排行、年度对比、雷达）。

权限管理

- 路由权限：按后端返回的 `routes` 过滤异步路由，动态 `addRoute` 注入，生成菜单 `menuRoutes`
  - 参考：`src/store/modules/user.ts:43-80`、`src/router/routes.ts`
- 按钮权限：自定义指令 `v-has`，依据用户 `buttons` 数组移除无权限按钮
  - 参考：`src/directive/has.ts:5-15`
- 登录鉴权：登录成功后存储 `token`，请求拦截器统一携带 `token`；退出登录清理本地状态
  - 参考：`src/utils/token.ts`、`src/utils/request.ts`、`src/views/login/index.vue`

相关代码目录

```
src/
  api/
    user/                 # 登录/用户信息/退出
    acl/                  # 用户、角色、菜单权限接口
  router/                 # 常量/异步/任意路由配置
  store/modules/user.ts   # 动态路由过滤、token与用户信息
  directive/has.ts        # 按钮权限指令
  utils/request.ts        # Axios 拦截器与错误处理
  utils/token.ts          # token 本地存取

```

代码目录结构

```
src/
  layout/                # 布局（Logo、Menu、Tabbar、Main）
  router/                # 路由配置
  store/                 # Pinia 仓库
  views/
    screen/              # 数据大屏（top/left/center/right）
    product/             # 商品管理（trademark/attr/spu/sku）
    acl/              # 用户/角色/菜单管理页面
  styles/                # 全局样式与变量
  setting.ts             # 标题与 Logo 配置
public/
  logo.jpg               # 侧边栏 Logo
```

环境变量：`.env.development`、`.env.test`、`.env.production`；`VITE_APP_BASE_API` 为代理前缀，`VITE_SERVE` 为后端服务地址（默认 `http://127.0.0.1:12086`）。

运行：安装依赖 `npm install`，开发 `npm run dev`，构建 `npm run build`，预览 `npm run preview`。

规范：ESLint `npm run lint:eslint`，Stylelint `npm run lint:style`，格式化 `npm run format`。

基础路径与静态资源：`vite.config.ts` 配置了 `base`；Logo 通过 `BASE_URL` 访问（`src/setting.ts` 使用 `logo: BASE + 'logo.jpg'`）。如需部署到不同子目录，调整 `base` 即可。

后端参考仓库：`https://github.com/WangJian3306/vue3_admin_backend.git`（致谢作者 WangJian3306）。请确保后端服务与 `.env.*` 配置一致。
