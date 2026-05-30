# Mock 接口说明

开发环境由 `vite-plugin-mock` 拦截 `/api/**`，数据由 **MockJS** 与内存仓库 `_store.js` 提供。

| 模块 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 用户 | POST | `/api/user/login` | 登录（admin/123456） |
| 用户 | GET | `/api/user/profile` | 用户资料 |
| 用户 | PUT | `/api/user/profile` | 更新用户资料 |
| 首页 | GET | `/api/dashboard/stats` | Dashboard 统计 |
| 计划 | GET | `/api/study-plan/list` | 计划列表（分页/筛选） |
| 计划 | POST | `/api/study-plan` | 新增计划 |
| 计划 | PUT | `/api/study-plan/:id` | 更新计划 |
| 计划 | DELETE | `/api/study-plan/:id` | 删除计划 |
| 课程 | GET | `/api/course/list` | 课程列表 |
| 课程 | GET | `/api/course/:id` | 课程详情 |
| AI | POST | `/api/ai/chat` | 模拟问答 |
| AI | GET | `/api/ai/quick-questions` | 快捷问题 |
| 分析 | GET | `/api/analytics/overview` | 数据分析总览（含热力图） |

## 内存数据规模

| 数据 | 数量 | 说明 |
|------|:--:|------|
| 学习计划 | 8 条 | 预设 3 种优先级 × 3 种状态 |
| 课程 | 6 门 | 前端×3 / 计算机基础×2 / 语言×1 |
| AI 问答 | 5 组关键词 | 考研/英语/Vue/时间管理/算法 |
| 每门课程章节 | 5~8 章 | 课程专属有意义标题 |
| 每门课程知识点 | 5 个 | 技术标签展示 |

## 数据一致性

- **用户资料**：登录时写入 `_store.js` 内存，profile 接口返回同一份数据
- **totalHours**：`analytics/overview` 与 `user/profile` 共享 `currentUserProfile.totalHours`
- **统计指标**：Dashboard 与 Analytics 共享 `sharedMetrics` 基数（todayMinutes/totalTasks/completedRate）
- **课程详情**：正则精确匹配 `/api/course/\d+`，不与 `/api/course/list` 冲突
