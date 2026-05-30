import Mock from 'mockjs'

/** 首页统计 Mock */
export default [
  {
    url: '/api/dashboard/stats',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: Mock.mock({
        todayMinutes: '@integer(30, 240)',
        taskCount: '@integer(3, 15)',
        completedRate: '@integer(40, 95)',
        weekTrend: {
          'labels|7': ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          'values|7': ['@integer(30, 180)'],
        },
      }),
    }),
  },
]
