# 组件化说明（考核点：props / emit / slot）

本文档说明核心业务组件的接口设计，便于答辩时讲解组件化思想。

## 布局组件 `components/layout/`

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
