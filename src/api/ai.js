import request from './request'

export function sendAiChatApi(data) {
  return request.post('/ai/chat', data, { showLoading: false })
}

export function getQuickQuestionsApi() {
  return request.get('/ai/quick-questions', { showLoading: false })
}
