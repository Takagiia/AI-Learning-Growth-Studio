import Mock from 'mockjs'
import { currentUserProfile, courses, sharedMetrics } from './_store'

/** 数据分析 Mock（与 dashboard 共享指标基数） */
export default [
  {
    url: '/api/analytics/overview',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: Mock.mock({
        totalHours: currentUserProfile?.totalHours ?? 486,
        completedTasks: sharedMetrics.totalTasks + Mock.mock('@integer(10, 40)'),
        courseCompletion: sharedMetrics.completedRate + Mock.mock('@integer(-15, 15)'),
        weeklyHours: {
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          values: [2, 4, 6, 7, 5, 3, 1],
        },
        taskRate: {
          done: '@integer(30, 80)',
          doing: '@integer(10, 40)',
          pending: '@integer(5, 30)',
        },
        courseProgress: {
          list: courses.map((c) => ({ name: c.title, value: c.progress })),
        },
        monthTrend: {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
          values: [120, 180, 220, 260, 310, 340],
        },
        // 学习热力图数据（日历形式，日期 → 学习分钟）
        heatmap: generateYearHeatmapData(),
      }),
    }),
  },
]

function generateYearHeatmapData(year = new Date().getFullYear()) {
  const data = []
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    data.push([formatDate(d), Mock.mock('@integer(0, 180)')])
  }

  return data
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
