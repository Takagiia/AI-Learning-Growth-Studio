import Mock from 'mockjs'
import { currentUserProfile, courses } from './_store'

/** 数据分析 Mock */
export default [
  {
    url: '/api/analytics/overview',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: Mock.mock({
        totalHours: currentUserProfile?.totalHours ?? 486,
        completedTasks: '@integer(20, 200)',
        courseCompletion: '@integer(40, 95)',
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
      }),
    }),
  },
]
