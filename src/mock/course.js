import Mock from 'mockjs'
import { courses } from './_store'

const CATEGORY_MAP = {
  frontend: '前端开发',
  cs: '计算机基础',
  language: '语言学习',
  all: '全部',
}

/** 课程管理 Mock */
export default [
  {
    url: '/api/course/list',
    method: 'get',
    response: ({ query }) => {
      const { category, keyword } = query || {}
      let list = [...courses]
      if (category && category !== 'all') {
        list = list.filter((c) => c.category === category)
      }
      if (keyword) {
        const kw = String(keyword).toLowerCase()
        list = list.filter(
          (c) =>
            c.title.toLowerCase().includes(kw) ||
            c.description.toLowerCase().includes(kw) ||
            c.teacher.toLowerCase().includes(kw),
        )
      }
      return {
        code: 200,
        message: 'ok',
        data: {
          list,
          categories: Object.entries(CATEGORY_MAP).map(([value, label]) => ({ value, label })),
        },
      }
    },
  },
  {
    url: /\/api\/course\/[\w-]+/,
    method: 'get',
    response: ({ url }) => {
      const id = url.split('/').pop()
      const course = courses.find((c) => c.id === id)
      if (!course) return { code: 404, message: '课程不存在', data: null }
      return {
        code: 200,
        message: 'ok',
        data: {
          ...course,
          chapters: Mock.mock({
            'list|5-8': [
              {
                id: '@id',
                title: '第@integer(1,12)章 @ctitle(4, 10)',
                duration: '@integer(20, 90)分钟',
                done: '@boolean',
              },
            ],
          }).list,
        },
      }
    },
  },
]
