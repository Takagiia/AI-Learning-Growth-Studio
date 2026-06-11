import request from './request'

export function getAchievementListApi() {
  return request.get('/achievement/list')
}

export function getAchievementStatsApi() {
  return request.get('/achievement/stats')
}

export function unlockAchievementApi(id) {
  return request.post(`/achievement/unlock/${id}`)
}

export function initAchievementsApi(reset = false) {
  return request.post('/achievement/init', null, {
    params: { reset },
  })
}
