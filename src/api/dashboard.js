import request from './request'

export function getDashboardStatsApi() {
  return request.get('/dashboard/stats', { showLoading: false })
}
