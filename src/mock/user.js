import Mock from 'mockjs'

/** 用户模块 Mock 接口 */
export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body || {}
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          message: '登录成功',
          data: {
            token: Mock.mock('@guid'),
            userInfo: {
              id: Mock.mock('@id'),
              username: 'admin',
              nickname: 'AI 学习者',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
              signature: '专注学习，持续成长',
            },
          },
        }
      }
      return {
        code: 401,
        message: '账号或密码错误（演示账号：admin / 123456）',
        data: null,
      }
    },
  },
  {
    url: '/api/user/profile',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: Mock.mock({
        id: '@id',
        username: 'admin',
        nickname: '@cname',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=profile',
        signature: '@csentence(8, 20)',
        studyDays: '@integer(30, 365)',
        totalHours: '@integer(100, 2000)',
      }),
    }),
  },
  {
    url: '/api/user/profile',
    method: 'put',
    response: ({ body }) => ({
      code: 200,
      message: '保存成功',
      data: {
        ...body,
        id: body.id || '1',
        username: body.username || 'admin',
      },
    }),
  },
]
