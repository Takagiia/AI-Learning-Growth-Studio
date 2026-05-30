import request from './request'

export function getStudyPlanListApi(params) {
  return request.get('/study-plan/list', { params })
}

export function createStudyPlanApi(data) {
  return request.post('/study-plan', data)
}

export function updateStudyPlanApi(id, data) {
  return request.put(`/study-plan/${id}`, data)
}

export function deleteStudyPlanApi(id) {
  return request.delete(`/study-plan/${id}`)
}
