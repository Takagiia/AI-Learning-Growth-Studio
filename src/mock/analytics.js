import Mock from 'mockjs'

/** 数据分析 Mock */
export default [
  {
    url: '/api/analytics/overview',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: Mock.mock({
        totalHours: '@integer(200, 2000)',
        completedTasks: '@integer(20, 200)',
        courseCompletion: '@integer(40, 95)',
        weeklyHours: {
          'labels|7': ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          'values|7': ['@integer(1, 8)'],
        },
        taskRate: {
          done: '@integer(30, 80)',
          doing: '@integer(10, 40)',
          pending: '@integer(5, 30)',
        },
        courseProgress: {
          'list|4': [{ name: '@ctitle(4,8)', value: '@integer(20, 100)' }],
        },
        monthTrend: {
          'labels|6': ['1月', '2月', '3月', '4月', '5月', '6月'],
          'values|6': ['@integer(50, 300)'],
        },
      }),
    }),
  },
]
