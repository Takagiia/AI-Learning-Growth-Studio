import { studyPlans, nextPlanId } from './_store'

function paginate(list, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    page: Number(page),
    pageSize: Number(pageSize),
  }
}

/** 学习计划 Mock */
export default [
  {
    url: '/api/study-plan/list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, priority, status, keyword } = query || {}
      let filtered = [...studyPlans]
      if (priority) filtered = filtered.filter((p) => p.priority === priority)
      if (status) filtered = filtered.filter((p) => p.status === status)
      if (keyword) {
        const kw = String(keyword).toLowerCase()
        filtered = filtered.filter(
          (p) => p.title.toLowerCase().includes(kw) || p.content.toLowerCase().includes(kw),
        )
      }
      return { code: 200, message: 'ok', data: paginate(filtered, page, pageSize) }
    },
  },
  {
    url: '/api/study-plan',
    method: 'post',
    response: ({ body }) => {
      const plan = {
        id: nextPlanId(),
        title: body.title,
        content: body.content || '',
        deadline: body.deadline || '',
        priority: body.priority || 'medium',
        status: body.status || 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      }
      studyPlans.unshift(plan)
      return { code: 200, message: '创建成功', data: plan }
    },
  },
  {
    url: /\/api\/study-plan\/[\w-]+/,
    method: 'put',
    response: ({ body, url }) => {
      const id = url.split('/').pop()
      const index = studyPlans.findIndex((p) => p.id === id)
      if (index === -1) return { code: 404, message: '计划不存在', data: null }
      studyPlans[index] = { ...studyPlans[index], ...body }
      return { code: 200, message: '更新成功', data: studyPlans[index] }
    },
  },
  {
    url: /\/api\/study-plan\/[\w-]+/,
    method: 'delete',
    response: ({ url }) => {
      const id = url.split('/').pop()
      const index = studyPlans.findIndex((p) => p.id === id)
      if (index === -1) return { code: 404, message: '计划不存在', data: null }
      const removed = studyPlans.splice(index, 1)[0]
      return { code: 200, message: '删除成功', data: removed }
    },
  },
]
