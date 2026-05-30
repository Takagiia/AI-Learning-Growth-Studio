import Mock from 'mockjs'
import { currentUserProfile, setCurrentUserProfile } from './_store'

/**
 * 生成一份固定的用户资料（仅首次调用时创建）
 * 后续 profile 请求始终返回同一份数据，解决「每次刷新随机变化」的问题
 */
function ensureProfile() {
  if (!currentUserProfile) {
    setCurrentUserProfile({
      id: Mock.mock('@id'),
      username: 'admin',
      nickname: 'AI 学习者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      signature: '专注学习，持续成长',
      studyDays: 128,
      totalHours: 486,
    })
  }
  return currentUserProfile
}

/** 用户模块 Mock 接口 */
export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body || {}
      if (username === 'admin' && password === '123456') {
        // 登录时初始化/更新内存中的用户资料，确保 profile 接口返回一致
        const profile = ensureProfile()
        return {
          code: 200,
          message: '登录成功',
          data: {
            token: Mock.mock('@guid'),
            userInfo: { ...profile },
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
      data: { ...ensureProfile() },
    }),
  },
  {
    url: '/api/user/profile',
    method: 'put',
    response: ({ body }) => {
      // 更新内存中的用户资料，保证下次 get 返回最新值
      if (currentUserProfile) {
        Object.assign(currentUserProfile, body)
      }
      return {
        code: 200,
        message: '保存成功',
        data: {
          ...body,
          id: body.id || '1',
          username: body.username || 'admin',
        },
      }
    },
  },
]
