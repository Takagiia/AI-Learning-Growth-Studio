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
        heatmap: Mock.mock({
          'data|100-200': [
            ['2026-@date("MM-dd")', '@integer(0, 180)'],
          ],
        }).data,
      }),
    }),
  },
]
