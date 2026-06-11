import request from './request'

export function getWrongQuestionListApi(params) {
  return request.get('/wrongQuestion/list', { params })
}

export function getWrongQuestionDetailApi(id) {
  return request.get(`/wrongQuestion/detail/${id}`)
}

export function createWrongQuestionApi(data) {
  return request.post('/wrongQuestion/create', data)
}

export function updateWrongQuestionApi(id, data) {
  return request.put(`/wrongQuestion/update/${id}`, data)
}

export function deleteWrongQuestionApi(id) {
  return request.delete(`/wrongQuestion/delete/${id}`)
}

export function markAsMasteredApi(id) {
  return request.post(`/wrongQuestion/master/${id}`)
}

export function getWrongQuestionCategoriesApi() {
  return request.get('/wrongQuestion/categories')
}
