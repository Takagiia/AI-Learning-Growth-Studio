import request from './request'

/** 用户相关接口 */
export function loginApi(data) {
  return request.post('/user/login', data)
}

export function getUserProfileApi() {
  return request.get('/user/profile')
}

export function updateUserProfileApi(data) {
  return request.put('/user/profile', data)
}
