import request from './request'

export function getNoteListApi(params) {
  return request.get('/note/list', { params })
}

export function getNoteDetailApi(id) {
  return request.get(`/note/detail/${id}`)
}

export function createNoteApi(data) {
  return request.post('/note/create', data)
}

export function updateNoteApi(id, data) {
  return request.put(`/note/update/${id}`, data)
}

export function deleteNoteApi(id) {
  return request.delete(`/note/delete/${id}`)
}

export function getNoteCategoriesApi() {
  return request.get('/note/categories')
}
