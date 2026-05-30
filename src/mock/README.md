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
| 分析 | GET | `/api/analytics/overview` | 数据分析总览 |
