# 组件化说明（考核点：props / emit / slot）

本文档说明核心业务组件的接口设计，便于答辩时讲解组件化思想。

---

## 组件树（考核点：组件树）

```
App.vue
└── <router-view>
    ├── LoginView                          # /login（无布局壳）
    │   └── ParticleBackground             # Canvas 粒子动画
    │
    └── AppLayout                          # 系统主壳（provide themeConfig）
        ├── ParticleBackground             # 全局粒子背景
        ├── AppSidebar                     # 侧栏导航（component :is 动态图标）
        │   └── <router-link> × 6
        ├── AppHeader                      # 顶栏（aria-label 无障碍）
        │   ├── el-button（折叠侧栏）
        │   ├── el-switch（粒子开关）
        │   ├── el-button（主题切换）
        │   └── el-avatar（用户头像 → /profile）
        │
        └── <router-view>  →  <transition>  →  <keep-alive>  →  <component :is>
            ├── DashboardView              # /dashboard
            │   ├── StatCard × 3           # props: label/value/unit/icon/color
            │   ├── ChartCard × 2          # inject: themeConfig; async import echarts
            │   └── QuickEntry             # component :is 动态图标; emit: navigate
            │
            ├── StudyPlanView              # /study-plan
            │   └── el-table / el-pagination
            │
            ├── CourseView                 # /course
            │   ├── CourseCard × N         # props: course; emit: click
            │   │   └── LazyImage          # props: src/alt/fetchpriority
            │   └── el-drawer（详情）
            │       └── el-timeline
            │
            ├── AiAssistantView            # /ai-assistant
            │   └── AIChatBox              # props: messages/loading; emit: send/quick
            │
            ├── AnalyticsView              # /analytics
            │   ├── StatCard × 3
            │   └── ChartCard × 4
            │
            └── ProfileView                # /profile
                ├── StatCard × 3
                └── el-form（资料编辑）
```

---

## 考核技术点分布

| 考核项 | 实现位置 | 说明 |
|--------|---------|------|
| **KeepAlive** | `AppLayout.vue` | `<keep-alive>` 包裹 `<component :is>`，缓存已访问页面 |
| **自定义指令 v-lazy** | `src/directives/lazy.js` → `main.js` 全局注册 | IntersectionObserver 懒加载 + 渐显 |
| **provide/inject** | `AppLayout` → `ChartCard` | provide `themeConfig`，ChartCard 深层 inject 获取 `isDark` |
| **动态组件** | `QuickEntry.vue`、`AppSidebar.vue` | `<component :is="iconMap[item.icon]">` 动态渲染图标 |
| **插槽（Slot）** | `StatCard`（default/footer）、`ChartCard`（extra/default） | 具名插槽 + 默认插槽 |
| **Lodash** | `src/utils/debounce.js` | 封装 `_.debounce`，CourseView/StudyPlanView 搜索防抖 |
| **ESLint** | `eslint.config.js` | 基础规则 + `npm run lint` 脚本 |
| **路由懒加载** | `router/routes.js` | 动态 `import()` + chunk 命名 |
| **导航守卫** | `router/index.js` | `beforeEach` 鉴权 + 重定向 |
| **Pinia 持久化** | `stores/user.js`、`stores/theme.js`、`stores/studyPlan.js` | localStorage 读写 |

---

| 组件 | 说明 | 通信方式 |
|------|------|----------|
| `AppLayout` | 系统主壳：粒子背景 + 侧栏 + 顶栏 + `<router-view>` | 使用 `themeStore` |
| `AppHeader` | 顶栏标题、主题/粒子开关 | 无 props，读取 store + route |
| `AppSidebar` | 侧边菜单 | `getMenuItems()` 配置驱动 |

## 通用组件 `components/common/`

### StatCard

| 类型 | 名称 | 说明 |
|------|------|------|
| props | `label` | 指标名称（必填） |
| props | `value` / `unit` | 数值与单位 |
| props | `icon` / `color` | 图标与主题色 |
| props | `clickable` | 是否可点击 |
| emit | `click` | 卡片点击 |
| slot | `default` | 自定义数值区域 |
| slot | `footer` | 底部扩展 |

### ChartCard

| 类型 | 名称 | 说明 |
|------|------|------|
| props | `title` / `height` / `option` | 标题、高度、ECharts 配置 |
| props | `loading` | 加载骨架 |
| emit | `ready` | 图表实例就绪 |
| slot | `extra` | 标题栏右侧 |
| slot | `default` | 图表下方扩展 |

**性能**：内部 `import('echarts')` 异步加载，避免非图表页打包体积过大。

### CourseCard

| 类型 | 名称 | 说明 |
|------|------|------|
| props | `course` | 课程对象 |
| emit | `click` | 点击卡片，回传 `course` |

内部使用 `LazyImage` 实现图片懒加载。

### AIChatBox

| 类型 | 名称 | 说明 |
|------|------|------|
| props | `messages` | 消息列表 `{ id, role, content, time }` |
| props | `quickQuestions` | 快捷问题数组 |
| props | `loading` | 发送中状态 |
| emit | `send` | 发送消息，参数为文本 |
| emit | `quick` | 点击快捷问题 |

### QuickEntry

| 类型 | 名称 | 说明 |
|------|------|------|
| emit | `navigate` | 跳转前触发，参数为 `path` |

### LazyImage

| 类型 | 名称 | 说明 |
|------|------|------|
| props | `src` / `alt` / `fit` | 图片属性 |
| emit | `load` / `error` | 加载成功/失败 |

原生 `loading="lazy"` + 渐显占位动画。

**与 `v-lazy` 指令的关系**：项目提供两套懒加载方案，各有用武之地：
- `v-lazy` 全局指令（`src/directives/lazy.js`）— IntersectionObserver + 渐显，适用于任意 `<img>` 元素，无需包裹组件
- `LazyImage` 组件 — 原生 `loading="lazy"` + CSS shimmer 占位动画，适用于需要美观加载态的场景（课程封面等）

### v-lazy 指令

| 类型 | 名称 | 说明 |
|------|------|------|
| 注册 | `main.js` 全局 `app.directive('lazy', vLazy)` | IntersectionObserver 懒加载 |
| 用法 | `v-lazy` 或 `v-lazy="src"` | 图片进入视口 100px 前开始加载 |

### ParticleBackground

| 类型 | 名称 | 说明 |
|------|------|------|
| props | `count` / `color` / `linkLines` | 粒子数量、颜色、连线 |

---

## 页面与组件关系

```
DashboardView
  ├── StatCard × 3
  ├── ChartCard × 2
  └── QuickEntry

CourseView
  └── CourseCard × N  →  emit click → Drawer 详情

AiAssistantView
  └── AIChatBox  →  emit send / quick

AnalyticsView
  ├── StatCard × 3
  └── ChartCard × 4
```

---

## 性能优化对照

| 考核要求 | 实现位置 |
|----------|----------|
| 路由懒加载 | `router/routes.js` 动态 `import()` + chunk 命名 |
| 图片懒加载 | `LazyImage.vue`、`CourseCard` |
| 搜索防抖 | `CourseView`（400ms）、`StudyPlanView`（400ms） |
| ECharts 分包 | `ChartCard` 异步 import + `vite.config.js` manualChunks |

---

## 主题系统说明

项目支持深色/浅色双模式，通过 `themeStore.toggleTheme()` 切换。

### 实现方式

| 层级 | 深色模式 | 浅色模式 | 切换方式 |
|------|---------|---------|---------|
| CSS 变量 | `:root` 默认值 | `:root[data-theme='light']` 覆盖 | `dataset.theme` |
| Element Plus | `:root` CSS 变量 | `:root:not(.dark)` 覆盖 | `classList.toggle('dark')` |
| 全局组件 | `glass-card`, `gradient-text` | 对应浅色覆盖 | `[data-theme='light']` 选择器 |
| ECharts | `darkChartTheme` | `lightChartTheme` | ChartCard inject `isDark` 联动 |

### 浅色模式配色

| 元素 | 深色 | 浅色 |
|------|------|------|
| 页面背景 | `#0b1020` | `#eef0f4` |
| 卡片 | 半透明深色 + 毛玻璃 | 不透明白色 + 轻阴影 |
| 主文字 | `#f1f5f9` | `#2d3748` |
| 次文字 | `#cbd5e1` | `#4a5568` |
| 品牌色 | `#6366f1` | `#6366f1`（不变） |
| 边框 | 透明白 | 透明黑 |
| 阴影 | 强黑色阴影 | 轻灰色阴影 |

### 浅色模式适配清单

- `styles/variables.scss` — 浅色变量定义
- `styles/global.scss` — body/卡片/渐变文字/网格/悬停覆盖
- `styles/element-override.scss` — Element Plus 组件浅色变量 + 标签/表格/输入框
- `stores/theme.js` — `dataset.theme` 切换 + localStorage 持久化
- `ParticleBackground.vue` — 透明度降至 0.18
- `AIChatBox.vue` — 聊天气泡浅色背景
- `echarts.js` — 浅色图表主题 + 坐标轴样式
- `ChartCard.vue` — 主题联动 watch + dispose/reinit
- `CourseView.vue` — 章节时间轴颜色图例
