import Mock from 'mockjs'
import { sharedMetrics } from './_store'

/** 首页统计 Mock（与 analytics 共享指标基数） */
export default [
  {
    url: '/api/dashboard/stats',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: Mock.mock({
        todayMinutes: sharedMetrics.todayMinutes + Mock.mock('@integer(-20, 20)'),
        taskCount: sharedMetrics.totalTasks,
        completedRate: sharedMetrics.completedRate + Mock.mock('@integer(-10, 10)'),
        weekTrend: {
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          values: [45, 80, 120, 155, 130, 95, 50],
        },
        heatmap: generateHeatmapData(),
      }),
    }),
  },
]

function generateHeatmapData() {
  const data = []
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - 6) // 半年数据
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    data.push([
      formatDate(d),
      Mock.mock('@integer(0, 5)')
    ])
  }
  return data
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
