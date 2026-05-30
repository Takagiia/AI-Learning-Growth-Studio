import Mock from 'mockjs'
import { courses } from './_store'

const CATEGORY_MAP = {
  frontend: '前端开发',
  cs: '计算机基础',
  language: '语言学习',
  all: '全部',
}

/** 各课程专属章节标题库（保证有意义的独立标题） */
const COURSE_CHAPTERS = {
  '1': [
    'Vue3 核心基础',
    '组件化开发实战',
    '路由与状态管理',
    'Composition API 深入',
    '项目部署与优化',
    'Vue3 高级特性',
    '实战项目构建',
    '单元测试入门',
  ],
  '2': [
    '原型与继承',
    '异步编程与 Promise',
    '模块化开发',
    '性能优化技巧',
    'ES6+ 新特性详解',
    '闭包与作用域',
    '事件循环机制',
    '错误处理与调试',
  ],
  '3': [
    '数组与链表',
    '栈与队列',
    '树与二叉树',
    '图论基础',
    '排序与搜索算法',
    '动态规划入门',
    '贪心算法',
    '哈希表与集合',
  ],
  '4': [
    '高频词汇记忆',
    '听力专项训练',
    '阅读理解技巧',
    '写作模板与练习',
    '翻译技巧精讲',
    '真题模拟与解析',
    '口语表达训练',
    '语法重点突破',
  ],
}

/** 生成课程专属章节列表（按自然顺序排列） */
function buildChapters(courseId) {
  const templates = COURSE_CHAPTERS[courseId] || ['章节主题']
  const count = Mock.mock('@integer(5, 8)')
  return templates.slice(0, count).map((title, i) => ({
    id: Mock.mock('@id'),
    title: `第${i + 1}章：${title}`,
    duration: `${Mock.mock('@integer(20, 90)')}分钟`,
    done: Mock.mock('@boolean'),
  }))
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
    url: /\/api\/course\/\d+/,
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
          chapters: buildChapters(course.id),
        },
      }
    },
  },
]
