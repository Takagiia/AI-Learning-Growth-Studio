/**
 * Mock 内存数据仓库（供各模块接口读写）
 * 开发环境重启后会重置为初始数据
 */

let planIdSeed = 100
let courseIdSeed = 200

/** 当前登录用户的内存快照，用于保证 profile 与 login 返回一致 */
export let currentUserProfile = null

/** 设置当前用户资料（解决 ES module import 不可变问题） */
export function setCurrentUserProfile(profile) {
  currentUserProfile = profile
}

/** 共享统计指标种子，保证 Dashboard 与 Analytics 数据一致 */
export const sharedMetrics = {
  todayMinutes: 90,       // 今日学习分钟（Dashboard + Analytics 共用）
  totalTasks: 12,         // 任务总数（Dashboard taskCount 与 Analytics completedTasks 关联）
  completedRate: 72,      // 完成率%（两页共用基数）
}

export const studyPlans = [
  {
    id: '1',
    title: 'Vue3 组件化实战',
    content: '完成 Composition API 与 Pinia 练习',
    deadline: '2026-06-01',
    priority: 'high',
    status: 'pending',
    createdAt: '2026-05-20',
  },
  {
    id: '2',
    title: '前端工程化复习',
    content: 'Vite 配置、路由懒加载、Mock 方案',
    deadline: '2026-05-30',
    priority: 'medium',
    status: 'doing',
    createdAt: '2026-05-18',
  },
  {
    id: '3',
    title: 'ECharts 可视化练习',
    content: '折线图、柱状图、环形图各一个',
    deadline: '2026-06-10',
    priority: 'low',
    status: 'done',
    createdAt: '2026-05-15',
  },
  {
    id: '4',
    title: 'JavaScript 算法刷题',
    content: 'LeetCode 简单/中等题每日 2 道，整理解题思路',
    deadline: '2026-06-15',
    priority: 'high',
    status: 'doing',
    createdAt: '2026-05-22',
  },
  {
    id: '5',
    title: 'Element Plus 组件库学习',
    content: '掌握 el-table、el-form、el-dialog 等常用组件',
    deadline: '2026-06-08',
    priority: 'medium',
    status: 'pending',
    createdAt: '2026-05-25',
  },
  {
    id: '6',
    title: 'CSS 动画与过渡练习',
    content: '实现页面切换动画、hover 效果、loading 骨架屏',
    deadline: '2026-06-20',
    priority: 'low',
    status: 'pending',
    createdAt: '2026-05-28',
  },
  {
    id: '7',
    title: 'TypeScript 入门',
    content: '基础类型、接口、泛型，为 Vue3+TS 项目做准备',
    deadline: '2026-07-01',
    priority: 'medium',
    status: 'pending',
    createdAt: '2026-05-30',
  },
  {
    id: '8',
    title: '项目部署与 CI/CD',
    content: '学习 Vite 构建优化、Nginx 配置、GitHub Actions',
    deadline: '2026-06-30',
    priority: 'low',
    status: 'pending',
    createdAt: '2026-05-26',
  },
]

export const courses = [
  {
    id: '1',
    title: 'Vue3 前端开发',
    category: 'frontend',
    cover: 'https://picsum.photos/seed/vue3/400/240',
    description: '掌握 Vue3 核心语法、组件化与状态管理。',
    progress: 72,
    teacher: '张老师',
    lessons: 48,
    knowledgePoints: ['Composition API', 'Pinia 状态管理', 'Vue Router', '组件通信', '响应式原理'],
  },
  {
    id: '2',
    title: 'JavaScript 高级程序设计',
    category: 'frontend',
    cover: 'https://picsum.photos/seed/js/400/240',
    description: '深入理解原型、异步、模块化与性能优化。',
    progress: 45,
    teacher: '李老师',
    lessons: 60,
    knowledgePoints: ['原型链与继承', 'Promise/async-await', 'ES6 模块化', '闭包与作用域', '事件循环'],
  },
  {
    id: '3',
    title: '数据结构与算法',
    category: 'cs',
    cover: 'https://picsum.photos/seed/dsa/400/240',
    description: '数组、链表、树、图及常见算法题型。',
    progress: 30,
    teacher: '王老师',
    lessons: 80,
    knowledgePoints: ['数组与链表', '二叉树遍历', '动态规划', '贪心算法', '哈希表'],
  },
  {
    id: '4',
    title: '大学英语四级备考',
    category: 'language',
    cover: 'https://picsum.photos/seed/english/400/240',
    description: '词汇、听力、阅读与写作系统训练。',
    progress: 58,
    teacher: '陈老师',
    lessons: 36,
    knowledgePoints: ['高频词汇', '听力精听', '阅读理解', '写作模板', '真题演练'],
  },
  {
    id: '5',
    title: 'Python 数据分析',
    category: 'cs',
    cover: 'https://picsum.photos/seed/python/400/240',
    description: '使用 Pandas、Matplotlib 进行数据清洗与可视化分析。',
    progress: 25,
    teacher: '赵老师',
    lessons: 40,
    knowledgePoints: ['Pandas', 'NumPy', 'Matplotlib', '数据清洗', '可视化'],
  },
  {
    id: '6',
    title: 'UI/UX 设计基础',
    category: 'frontend',
    cover: 'https://picsum.photos/seed/design/400/240',
    description: '学习设计规范、组件化设计思维与 Figma 工具使用。',
    progress: 15,
    teacher: '刘老师',
    lessons: 32,
    knowledgePoints: ['色彩理论', '排版布局', '组件设计', 'Figma', '设计系统'],
  },
]

/** AI 预设问答库 */
export const aiReplyMap = [
  {
    keywords: ['考研', '研究生', '择校'],
    reply:
      '考研备考建议：① 明确目标院校与专业；② 制定 3 轮复习计划（基础-强化-冲刺）；③ 每天固定英语学习时间；④ 真题演练 + 错题本；⑤ 关注招生简章与复试要求。',
  },
  {
    keywords: ['英语', '四级', '六级', '单词'],
    reply:
      '英语学习建议：每天背诵 30-50 个高频词，结合听力精听 20 分钟，阅读一篇外刊摘要，周末做一套真题并复盘错题。',
  },
  {
    keywords: ['Vue', '前端', '项目'],
    reply:
      '前端项目学习路径：HTML/CSS 基础 → JavaScript ES6+ → Vue3 + Vite → Router/Pinia → Axios + Mock → 组件化与可视化，建议每周完成一个小模块并写学习笔记。',
  },
  {
    keywords: ['计划', '时间管理', '效率'],
    reply:
      '时间管理技巧：使用番茄工作法（25 分钟专注 + 5 分钟休息），按优先级排列任务（高/中/低），每晚复盘完成情况并调整次日计划。',
  },
  {
    keywords: ['算法', '数据结构', '刷题'],
    reply:
      '算法学习建议：先掌握数组、链表、栈队列、二叉树，再按标签刷 LeetCode 简单→中等题，每题总结时间复杂度与思路模板。',
  },
]

export const defaultAiReply =
  '感谢你的提问！作为 AI 学习助手，我建议你将目标拆解为可执行的小任务，设定截止日期并定期复盘。如需更具体的建议，可尝试询问「考研」「英语学习」「Vue 项目」等话题。'

export function nextPlanId() {
  planIdSeed += 1
  return String(planIdSeed)
}

export function nextCourseId() {
  courseIdSeed += 1
  return String(courseIdSeed)
}
