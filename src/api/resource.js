import request from './request'

export function getResourceListApi(params) {
  return request.get('/resource/list', { params })
}

export function getResourceDetailApi(id) {
  return request.get(`/resource/detail/${id}`)
}

export function createResourceApi(data) {
  return request.post('/resource/create', data)
}

export function uploadResourceApi(formData) {
  return request.post('/resource/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function deleteResourceApi(id) {
  return request.delete(`/resource/delete/${id}`)
}

export function downloadResourceApi(id) {
  return request.get(`/resource/download/${id}`, {
    responseType: 'blob'
  })
}

export function getResourceCategoriesApi() {
  return request.get('/resource/categories')
}
