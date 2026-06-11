import request from './request'

export function getAnalyticsOverviewApi() {
  return request.get('/analytics/overview')
}

export function getDashboardStatsApi() {
  return request.get('/analytics/dashboard')
}

export function getTaskStatsApi() {
  return request.get('/analytics/tasks')
}

export function getResourceStatsApi() {
  return request.get('/analytics/resources')
}
