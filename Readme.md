# AI 学习成长助手平台（AI Learning Assistant Platform）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 演示账号

| 字段 | 值 |
|------|-----|
| 账号 | `admin` |
| 密码 | `123456` |

登录后可访问 Dashboard、个人中心等需鉴权页面；未登录访问系统页会自动跳转 `/login`。

### 环境要求

- Node.js >= 18
- npm >= 9

### 常见问题

| 问题 | 处理方式 |
|------|----------|
| 端口 5173 被占用 | 修改 `vite.config.js` 中 `server.port` |
| Mock 接口无响应 | 请使用 `npm run dev`（仅开发环境启用 Mock） |
| 登录后刷新退出 | 检查浏览器是否禁用 localStorage |
| 图表不显示 | 确认已登录且 Mock 服务正常，查看控制台网络请求 |

### 答辩演示路线（约 5 分钟）

1. **登录** → `admin` / `123456`，展示粒子背景与表单校验  
2. **Dashboard** → 统计卡片、折线/柱状图、快捷入口跳转  
3. **学习计划** → 新增一条计划 → 切换状态 → 删除  
4. **课程管理** → 分类筛选 + 搜索防抖 → 打开详情抽屉  
5. **AI 助手** → 输入「考研」或点快捷问题 → 展示 Mock 回复  
6. **数据分析** → 多图表联动动画  
7. **个人中心** → 修改昵称保存 → 退出登录  
8. **守卫验证** → 直接访问 `/dashboard` 未登录会跳转登录页  

组件化说明详见 [`docs/COMPONENTS.md`](docs/COMPONENTS.md)。

---

## 项目进度

| 阶段 | 内容 | 状态 |
|------|------|------|
| **阶段一** | Vite 工程初始化、依赖安装、目录骨架 | ✅ 已完成 |
| **阶段二** | 基础设施：主题/布局/粒子、Pinia、Axios、Mock、AppLayout | ✅ 已完成 |
| **阶段三** | 认证与业务页面：Dashboard、计划、课程、AI、分析、个人中心 | ✅ 已完成 |
| **阶段五** | 打磨与考核：组件化复查、性能、动效、联调、文档 | ✅ 已完成 |

---

## 技术栈

### 必选（已集成）

| 技术 | 版本策略 | 用途 |
|------|----------|------|
| Vue 3 | Composition API | 核心框架 |
| Vite | 最新稳定版 | 构建与开发服务器 |
| Vue Router | 5.x | 路由、懒加载、导航守卫 |
| Pinia | 3.x | 用户 / 计划 / 主题状态 |
| Axios | 1.x | HTTP 请求封装 |
| Element Plus | 2.x | UI 组件库 |
| ECharts | 6.x | Dashboard / 数据分析页图表 |
| MockJS | 1.x | 模拟随机数据 |
| vite-plugin-mock | 3.x | 开发环境 Mock 接口 |
| Sass | - | 全局样式与变量 |

### 工程化插件

- **unplugin-auto-import**：自动导入 Vue / Router / Pinia API
- **unplugin-vue-components** + **ElementPlusResolver**：Element Plus **按需引入**组件
- **路径别名**：`@` → `src/`

### 可选（后续按需）

- Lodash
- 动画库（Motion / Animate.css）

---

## 项目结构

```
project_code/
├── public/
├── src/
│   ├── api/
│   │   ├── request.js       # Axios 封装（Loading / 401 / 错误提示）
│   │   ├── user.js
│   │   ├── dashboard.js
│   │   ├── studyPlan.js
│   │   ├── course.js
│   │   ├── ai.js
│   │   └── analytics.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── ParticleBackground.vue   # 粒子背景
│   │   │   ├── StatCard.vue             # 统计卡片
│   │   │   ├── ChartCard.vue            # ECharts 图表卡片
│   │   │   ├── QuickEntry.vue           # 快捷入口
│   │   │   ├── CourseCard.vue           # 课程卡片
│   │   │   ├── AIChatBox.vue            # AI 聊天框
│   │   │   └── LazyImage.vue            # 图片懒加载
├── docs/
│   └── COMPONENTS.md        # 组件 props/emit/slot 说明（答辩用）
│   │   └── layout/
│   │       ├── AppLayout.vue            # 主布局（router-view）
│   │       ├── AppHeader.vue
│   │       └── AppSidebar.vue
│   ├── mock/
│   │   ├── _store.js        # 内存数据仓库
│   │   ├── user.js / dashboard.js / studyPlan.js
│   │   ├── course.js / ai.js / analytics.js
│   │   └── README.md        # Mock 接口文档
│   ├── router/
│   │   ├── index.js         # 路由实例 + 导航守卫
│   │   └── routes.js        # 路由表 + 菜单配置
│   ├── stores/
│   │   ├── user.js          # 用户 / 登录
│   │   ├── studyPlan.js     # 学习计划
│   │   └── theme.js         # 主题 / 粒子 / 侧栏
│   ├── styles/
│   │   ├── variables.scss   # SCSS + CSS 变量
│   │   ├── mixins.scss      # 毛玻璃 / 渐变混入
│   │   ├── global.scss
│   │   └── element-override.scss
│   ├── utils/
│   │   ├── storage.js
│   │   ├── persist.js
│   │   └── debounce.js
│   └── views/               # 各业务页面
├── index.html
├── vite.config.js
└── package.json
```

---

## 配置说明

### 路径别名

- **Vite**：`vite.config.js` → `resolve.alias['@']`
- **IDE**：`jsconfig.json` → `paths['@/*']`

### Element Plus

- **组件**：通过 `unplugin-vue-components` 按需自动注册，无需手动 `app.use(ElementPlus)`
- **样式**：`main.js` 全局引入 `element-plus/dist/index.css` 与 `dark/css-vars.css`
- **主题覆盖**：`src/styles/element-override.scss`

### Mock 数据

- 开发环境由 `vite-plugin-mock` 拦截 `/api/**` 请求
- 各模块在 `src/mock/*.js` 按业务拆分，**MockJS** 生成随机字段
- 完整接口列表见 [`src/mock/README.md`](src/mock/README.md)

### 状态持久化（Pinia + localStorage）

| Store | Key | 持久化内容 |
|-------|-----|------------|
| user | `ai-learning-user` | token、用户信息 |
| studyPlan | `ai-learning-plans-cache` | 计划列表缓存 |
| theme | `ai-learning-theme` | 深色模式、粒子开关、侧栏折叠 |

### 布局组件

| 组件 | 说明 |
|------|------|
| `AppLayout` | 粒子背景 + 网格底纹 + Sidebar + Header + `<router-view>` |
| `AppHeader` | 标题、面包屑、主题切换、粒子开关、用户信息 |
| `AppSidebar` | 菜单导航（数据来自 `router/routes.js`） |
| `ParticleBackground` | Canvas 粒子连线动画 |

### Axios 封装能力

- `baseURL: /api`
- 请求头自动附加 `Authorization`
- 全局 `ElLoading`（可通过 `showLoading: false` 关闭）
- 业务 `code !== 200` 与 HTTP `401` 统一错误提示
- 401 自动登出并跳转登录页

---

## 路由一览

| 路径 | 名称 | 需登录 |
|------|------|--------|
| `/login` | 登录 | 否 |
| `/dashboard` | 首页 | 是 |
| `/study-plan` | 学习计划 | 是 |
| `/course` | 课程管理 | 是 |
| `/ai-assistant` | AI 助手 | 是 |
| `/analytics` | 数据分析 | 是 |
| `/profile` | 个人中心 | 是 |

- 支持 **路由懒加载**（`() => import(...)`）
- **导航守卫**：未登录访问需鉴权页面 → `/login`
- 预留 `asyncRoutes` 供后续动态路由扩展

---

## 开发阶段规划

### 阶段一（已完成）✅

- [x] Vite + Vue3 项目初始化、依赖安装、目录骨架

### 阶段二：基础设施（已完成）✅

- [x] 深色科技风 CSS 变量、毛玻璃、渐变、网格背景
- [x] `ParticleBackground` 粒子背景组件
- [x] Pinia：`userStore` / `studyPlanStore` / `themeStore` + localStorage
- [x] Axios：`request.js`（Loading、拦截器、401、错误提示）
- [x] Mock：登录、计划、课程、AI、统计、分析接口
- [x] Router：`routes.js` 统一配置、懒加载、`requiresAuth`、导航守卫
- [x] `AppLayout` + `AppHeader` + `AppSidebar` + 主内容 `<router-view>`

### 阶段三：认证与业务页面（已完成）✅

- [x] 登录：表单校验、Mock 登录、Pinia 持久化、跳转 Dashboard
- [x] 路由守卫：未登录访问系统页 → `/login`；刷新保持登录态
- [x] Dashboard：欢迎区、StatCard、ECharts 折线/柱状图、快捷入口
- [x] 学习计划：列表分页、筛选、新增/编辑/删除、优先级与状态
- [x] 课程管理：CourseCard 网格、分类筛选、防抖搜索、详情抽屉与进度条
- [x] AI 助手：AIChatBox、消息列表、Mock 关键词回复、快捷问题
- [x] 数据分析：折线/柱状/环形图，联动 `/api/analytics/overview`
- [x] 个人中心：资料编辑、学习统计、退出登录

### 阶段五：打磨与考核点（已完成）✅

- [x] **组件化复查**：StatCard / ChartCard / CourseCard / AIChatBox 规范使用 props、emit、slot（见 `docs/COMPONENTS.md`）
- [x] **性能**：路由懒加载 + chunk 命名；`LazyImage` 图片懒加载；课程/计划搜索防抖 400ms；ECharts 异步加载 + 构建分包
- [x] **动效**：顶层 `page-fade` + 布局内 `fade-slide` 路由过渡；`hover-lift` 卡片悬停；图表 `animation` 入场
- [x] **联调自测**：`npm install` → `npm run dev` / `npm run build` 通过
- [x] **代码规范**：关键模块注释、统一命名、README 演示路线与 FAQ

---

## 功能验证清单

| 场景 | 操作 | 预期 |
|------|------|------|
| 登录 | admin / 123456 | 跳转 Dashboard，token 写入 localStorage |
| 刷新 | F5 任意系统页 | 保持登录，不跳转登录页 |
| 未登录访问 | 直接打开 `/dashboard` | 重定向 `/login?redirect=...` |
| 学习计划 | 新增/编辑/删除/切换状态 | Mock CRUD 生效，列表刷新 |
| 课程 | 分类 + 搜索 | 防抖 400ms 后请求过滤 |
| AI | 输入「考研」或点快捷问题 | 返回预设学习建议 |
| 个人中心 | 修改昵称保存 | localStorage 与页面同步更新 |
| 退出 | 点击退出登录 | 清空状态，跳转登录页 |
| 构建 | `npm run build` | 无报错，dist 可 `npm run preview` 预览 |

### 技术考核覆盖自查

| 考核项 | 实现 |
|--------|------|
| Vue3 Composition API | 全部页面 `<script setup>` |
| Vue Router | 懒加载、守卫、`meta.requiresAuth` |
| Pinia | user / studyPlan / theme + localStorage |
| Axios | 统一封装、拦截器、Mock |
| Element Plus | 按需引入 + 深色主题 |
| ECharts | Dashboard、数据分析页 |
| 组件化 props/emit/slot | 见 `docs/COMPONENTS.md` |
| MockJS | `src/mock` + vite-plugin-mock |

---

# 需求说明（课程考核原文）

## 项目背景

这是一个基于 Vue3 的 Web 前端课程项目，需要实现一个具有科技感和现代 UI 风格的 AI 学习成长助手平台。项目重点用于课程考核，因此需要覆盖 Vue3 前端开发核心技术，包括 Vue Router、Pinia、Axios、组件化开发、动态路由、状态管理等。项目无需真实后端，可使用 Mock 数据实现。

## 项目目标

开发一个具有科技风、高级动态感的学习助手平台，主要面向大学生用户，帮助用户完成学习规划、课程管理、学习数据可视化、AI 学习辅助、知识整理等功能。

## 整体要求

项目必须基于 Vue3 开发，必须使用：

- Vue3（Composition API）
- Vite
- Vue Router
- Pinia
- Axios
- Element Plus
- ECharts
- MockJS（本项目已采用）

可选：Lodash、动画库（如 Motion / Animate.css）

项目必须可运行：`npm install` → `npm run dev` 后可直接运行，不能报错。

## 项目风格要求

### 整体风格

现代科技风、未来感、深色系高级 UI。

### 推荐设计方向

- 黑色 / 深蓝色背景
- 渐变高光、卡片式布局、毛玻璃效果
- 动态背景粒子、平滑页面切换动画
- 数字仪表盘风格

要求整体视觉统一，不能像传统管理系统一样单调。

## 页面设计要求

### 登录页

**功能**：账号密码登录、表单验证、登录状态保存、未登录自动跳转  

**技术**：Element Plus Form、Pinia、Router 导航守卫  

**UI**：科技感登录界面、动态背景、轻微动画

### 首页 Dashboard

**功能**：欢迎区、学习统计、今日时长、任务数、完成率、趋势图、快捷入口  

**技术**：ECharts、组件化、响应式布局  

**展示**：折线图、柱状图、进度卡片、统计卡片

### 学习计划模块

**功能**：新增 / 编辑 / 删除、完成状态、按优先级分类  

**技术**：CRUD、表单验证、Pinia、Mock、列表分页  

**字段**：标题、学习内容、截止时间、优先级、状态

### 课程管理模块

**功能**：课程展示、详情、学习进度、分类、搜索  

**技术**：动态组件、computed、watch、Axios + Mock

### AI 学习助手模块（核心展示）

**功能**：模拟 AI 问答、快捷问题推荐（无需真实 AI，Mock 预设回复）  

**技术**：聊天界面、消息气泡、异步请求、Axios + Mock

### 数据分析模块

**功能**：学习时长、任务完成率、课程完成、趋势分析  

**技术**：ECharts 折线 / 柱状 / 环形图、动态动画

### 个人中心模块

**功能**：用户信息、学习统计、头像昵称签名、设置、退出登录  

**技术**：Pinia 用户状态、页面模块化

## 路由设计

建议路径：`/login`、`/dashboard`、`/study-plan`、`/course`、`/ai-assistant`、`/analytics`、`/profile`

**要求**：Vue Router、动态路由、路由懒加载、导航守卫、未登录禁止访问系统页

## 状态管理要求

使用 Pinia：用户状态、登录信息、学习计划状态、系统主题状态；localStorage 持久化

## 网络请求要求

统一 Axios 封装：请求/响应拦截器、错误处理、Loading；Mock 模拟接口

## 组件化要求

建议组件：Header、Sidebar、StatCard、ChartCard、AIChatBox、CourseCard、TaskCard、ProgressPanel  

组件间使用 props、emit、slot

## 性能优化要求

图片懒加载、路由懒加载、防抖搜索、代码模块化

## 最终交付要求

- 完整 Vue3 项目源码，可直接运行
- 页面完整、无明显 Bug，核心功能可演示
- 整体 UI 有科技感与动态效果，代码结构规范

## 重点目标

项目看起来高级、有动态感，同时实现 Vue3 技术覆盖。
