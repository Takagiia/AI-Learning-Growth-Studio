import request from './request'

export function getAnalyticsOverviewApi() {
  return request.get('/analytics/overview')
}
