/**
 * 路由与侧边栏菜单统一配置
 * 使用动态 import 实现路由懒加载（按页面拆分 chunk）
 * icon 对应 @element-plus/icons-vue 组件名
 */

/** 需登录的布局子路由 */
export const layoutRoutes = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/DashboardView.vue'),
    meta: { title: '首页', icon: 'Odometer', requiresAuth: true },
  },
  {
    path: 'study-plan',
    name: 'StudyPlan',
    component: () => import(/* webpackChunkName: "study-plan" */ '@/views/study-plan/StudyPlanView.vue'),
    meta: { title: '学习计划', icon: 'Calendar', requiresAuth: true },
  },
  {
    path: 'pomodoro',
    name: 'Pomodoro',
    component: () => import(/* webpackChunkName: "pomodoro" */ '@/views/pomodoro/PomodoroView.vue'),
    meta: { title: '番茄专注', icon: 'AlarmClock', requiresAuth: true },
  },
  {
    path: 'course',
    name: 'Course',
    component: () => import(/* webpackChunkName: "course" */ '@/views/course/CourseView.vue'),
    meta: { title: '课程管理', icon: 'Reading', requiresAuth: true },
  },
  {
    path: 'note',
    name: 'Note',
    component: () => import(/* webpackChunkName: "note" */ '@/views/note/NoteView.vue'),
    meta: { title: '笔记管理', icon: 'Document', requiresAuth: true },
  },
  {
    path: 'wrong-question',
    name: 'WrongQuestion',
    component: () => import(/* webpackChunkName: "wrong-question" */ '@/views/wrongQuestion/WrongQuestionView.vue'),
    meta: { title: '错题本', icon: 'Warning', requiresAuth: true },
  },
  {
    path: 'resource',
    name: 'Resource',
    component: () => import(/* webpackChunkName: "resource" */ '@/views/resource/ResourceView.vue'),
    meta: { title: '学习资源', icon: 'FolderOpened', requiresAuth: true },
  },
  {
    path: 'achievement',
    name: 'Achievement',
    component: () => import(/* webpackChunkName: "achievement" */ '@/views/achievement/AchievementView.vue'),
    meta: { title: '成就系统', icon: 'Trophy', requiresAuth: true },
  },
  {
    path: 'ai-assistant',
    name: 'AiAssistant',
    component: () => import(/* webpackChunkName: "ai-assistant" */ '@/views/ai-assistant/AiAssistantView.vue'),
    meta: { title: 'AI 助手', icon: 'ChatDotRound', requiresAuth: true },
  },
  {
    path: 'analytics',
    name: 'Analytics',
    component: () => import(/* webpackChunkName: "analytics" */ '@/views/analytics/AnalyticsView.vue'),
    meta: { title: '数据分析', icon: 'DataAnalysis', requiresAuth: true },
  },
  {
    path: 'profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/ProfileView.vue'),
    meta: { title: '个人中心', icon: 'User', requiresAuth: true },
  },
]

/** 侧边栏菜单项（由 layoutRoutes 派生） */
export function getMenuItems() {
  return layoutRoutes.map((route) => ({
    path: `/${route.path}`,
    name: route.name,
    title: route.meta.title,
    icon: route.meta.icon,
  }))
}

/** 动态路由扩展预留（如后续需按角色/权限动态注入路由，通过 router.addRoute 添加此数组中的路由配置） */
export const asyncRoutes = []
