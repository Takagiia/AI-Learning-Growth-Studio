/** 业务常量映射 */

export const PLAN_PRIORITY = {
  high: { label: '高', type: 'danger' },
  medium: { label: '中', type: 'warning' },
  low: { label: '低', type: 'info' },
}

export const PLAN_STATUS = {
  pending: { label: '待开始', type: 'info' },
  doing: { label: '进行中', type: 'primary' },
  done: { label: '已完成', type: 'success' },
}

export const QUICK_ENTRIES = [
  { title: '学习计划', path: '/study-plan', icon: 'Calendar', color: '#3b82f6' },
  { title: '课程管理', path: '/course', icon: 'Reading', color: '#8b5cf6' },
  { title: 'AI 助手', path: '/ai-assistant', icon: 'ChatDotRound', color: '#22c55e' },
  { title: '数据分析', path: '/analytics', icon: 'DataAnalysis', color: '#f59e0b' },
]
