<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Timer, List, Trophy, Calendar, ChatDotRound, Clock, Document, Warning, Reading, MagicStick } from '@element-plus/icons-vue'
import QuickEntry from '@/components/common/QuickEntry.vue'
import { getDashboardStatsApi } from '@/api/dashboard'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const stats = ref(null)
const loading = ref(true)

// 每日励志名言
const dailyQuotes = [
  "学习如逆水行舟，不进则退！",
  "今天的努力是明天的实力！",
  "千里之行，始于足下！",
  "知识就是力量！",
  "学无止境，勇攀高峰！"
]

const todayQuote = computed(() => {
  const day = new Date().getDate()
  return dailyQuotes[day % dailyQuotes.length]
})

// 即将解锁的成就
const upcomingAchievements = ref([
  { title: '笔记达人', progress: 75, target: 100, points: 25 },
  { title: '持续学习', progress: 60, target: 100, points: 50 }
])

// 正在进行的课程
const ongoingCourses = ref([
  { id: 'c1', name: 'Vue3 核心技术实战', progress: 85, cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=100', teacher: '尤雨溪', lessons: 48 },
  { id: 'c2', name: 'Java 后端开发入门', progress: 45, cover: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=100', teacher: '张老师', lessons: 64 },
  { id: 'c4', name: 'React 18 全面指南', progress: 60, cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100', teacher: 'Dan Abramov', lessons: 56 }
])

// 待处理任务
const pendingTasks = ref([
  { id: 1, title: '完成 Vue3 组件化练习', priority: 'high', deadline: '2026-06-18', type: 'plan' },
  { id: 2, title: '复习前端工程化', priority: 'medium', deadline: '2026-06-25', type: 'plan' },
  { id: 3, title: '整理算法题每日打卡', priority: 'high', deadline: '2026-07-30', type: 'plan' },
  { id: 4, title: '复习 JVM 垃圾回收算法', priority: 'medium', deadline: '2026-06-20', type: 'wrong' }
])

// 未完成的错题
const pendingWrongQuestions = ref([
  { id: 'w1', title: '关于 JVM 垃圾回收算法', category: '计算机', difficulty: '困难', wrongCount: 3 },
  { id: 'w2', title: 'Vue3 响应式系统', category: '前端', difficulty: '中等', wrongCount: 2 }
])

// 最近笔记
const recentNotes = ref([
  { id: 'n1', title: 'Vue3 响应式原理', category: 'study', updatedAt: '2026-06-11' },
  { id: 'n2', title: 'Java 并发编程心得', category: 'thought', updatedAt: '2026-06-10' },
  { id: 'n3', title: 'CSS Grid 布局技巧', category: 'study', updatedAt: '2026-06-09' }
])

onMounted(async () => {
  loading.value = true
  try {
    const res = await getDashboardStatsApi()
    stats.value = res.data
  } finally {
    loading.value = false
  }
})

// 打开对应模块跳转
const goTo = (path) => {
  // 如果路径已经以 / 开头，直接使用；否则添加 /
  const fullPath = path.startsWith('/') ? path : `/${path}`
  router.push(fullPath)
}
</script>

<template>
  <div v-loading="loading" class="page-container dashboard">
    <!-- 欢迎区域 -->
    <div class="page-hero">
      <div class="page-hero__content">
        <div class="page-badge">
          <el-icon :size="16"><Calendar /></el-icon>
          <span>{{ new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
        </div>
        <h1 class="page-title gradient-text">欢迎回来，{{ userStore.userInfo.nickname }} 👋</h1>
        <p class="page-subtitle">{{ todayQuote }}</p>
        <div class="page-actions">
          <el-tag size="large" type="info" class="badge-tag">
            <el-icon><Trophy /></el-icon>
            已学习 {{ userStore.userInfo.studyDays || 0 }} 天
          </el-tag>
          <el-tag size="large" type="success" class="badge-tag">
            <el-icon><Timer /></el-icon>
            累计 {{ userStore.userInfo.totalHours || 0 }} 小时
          </el-tag>
        </div>
      </div>
      <div class="page-hero__aside">
        <div class="page-hero__card">
          <div class="page-hero__eyebrow">今日目标</div>
          <div class="page-hero__metric">{{ stats?.todayMinutes || '0' }}<span class="page-hero__metric-unit">分钟</span></div>
          <div class="page-hero__hint">继续保持，你离目标更近了！</div>
        </div>
      </div>
    </div>

    <!-- AI 推荐卡片 -->
    <el-card class="glass-card hover-lift ai-recommend" shadow="never">
      <div class="ai-recommend__header">
        <div class="ai-recommend__icon">
          <el-icon :size="24"><MagicStick /></el-icon>
        </div>
        <div class="ai-recommend__content">
          <h3 class="ai-recommend__title">AI 学习推荐</h3>
          <p class="ai-recommend__desc">根据你的学习习惯，今天建议重点复习 Vue3 响应式原理，并继续学习 React 18 新特性</p>
        </div>
        <el-button type="primary" @click="goTo('/ai-assistant')">
          <el-icon><ChatDotRound /></el-icon>
          咨询 AI
        </el-button>
      </div>
    </el-card>

    <!-- 快速操作区 -->
    <div class="quick-actions">
      <el-card class="glass-card hover-lift quick-card" shadow="never" @click="goTo('/pomodoro')">
        <div class="quick-card__icon" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6);">
          <el-icon :size="28"><Timer /></el-icon>
        </div>
        <h4>番茄专注</h4>
        <span>快速开始</span>
      </el-card>
      <el-card class="glass-card hover-lift quick-card" shadow="never" @click="goTo('/course')">
        <div class="quick-card__icon" style="background: linear-gradient(135deg, #22c55e, #10b981);">
          <el-icon :size="28"><Reading /></el-icon>
        </div>
        <h4>继续学习</h4>
        <span>上次课程</span>
      </el-card>
      <el-card class="glass-card hover-lift quick-card" shadow="never" @click="goTo('/note')">
        <div class="quick-card__icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
          <el-icon :size="28"><Document /></el-icon>
        </div>
        <h4>记笔记</h4>
        <span>随手记录</span>
      </el-card>
      <el-card class="glass-card hover-lift quick-card" shadow="never" @click="goTo('/ai-assistant')">
        <div class="quick-card__icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
          <el-icon :size="28"><MagicStick /></el-icon>
        </div>
        <h4>AI 助手</h4>
        <span>解答疑问</span>
      </el-card>
    </div>

    <!-- 今日概览 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="16">
        <!-- 正在进行的课程 -->
        <el-card class="glass-card hover-lift section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <h3><el-icon><Reading /></el-icon> 正在进行的课程</h3>
              <el-button type="primary" link @click="goTo('/course')">查看全部</el-button>
            </div>
          </template>
          <div class="course-list">
            <div v-for="course in ongoingCourses" :key="course.id" class="course-item" @click="goTo('/course')">
              <img :src="course.cover" :alt="course.name" class="course-cover" />
              <div class="course-info">
                <h4 class="course-name">{{ course.name }}</h4>
                <p class="course-meta">{{ course.teacher }} · {{ course.lessons }} 课时</p>
                <div class="course-progress">
                  <el-progress :percentage="course.progress" :stroke-width="6" :show-text="false" style="flex: 1;" />
                  <span class="progress-text">{{ course.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <!-- 即将解锁的成就 -->
        <el-card class="glass-card hover-lift section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <h3><el-icon><Trophy /></el-icon> 即将解锁</h3>
            </div>
          </template>
          <div class="achievement-list">
            <div v-for="(ach, idx) in upcomingAchievements" :key="idx" class="achievement-item">
              <div class="achievement-info">
                <h4>{{ ach.title }}</h4>
                <el-progress :percentage="ach.progress" :stroke-width="8" :show-text="false" />
              </div>
              <span class="achievement-points">+{{ ach.points }}分</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待办事项 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="12">
        <el-card class="glass-card hover-lift section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <h3><el-icon><List /></el-icon> 待处理任务</h3>
              <el-button type="primary" link @click="goTo('/study-plan')">查看全部</el-button>
            </div>
          </template>
          <div class="task-list">
            <div v-for="task in pendingTasks" :key="task.id" class="task-item" @click="goTo('/study-plan')">
              <div class="task-priority" :class="'priority-' + task.priority"></div>
              <div class="task-content">
                <h4>{{ task.title }}</h4>
                <span class="task-deadline">截止: {{ task.deadline }}</span>
              </div>
              <el-icon><Clock /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="glass-card hover-lift section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <h3><el-icon><Warning /></el-icon> 待复习错题</h3>
              <el-button type="primary" link @click="goTo('/wrong-question')">查看全部</el-button>
            </div>
          </template>
          <div class="wrong-question-list">
            <div v-for="q in pendingWrongQuestions" :key="q.id" class="wrong-question-item" @click="goTo('/wrong-question')">
              <div class="wrong-question-info">
                <h4>{{ q.title }}</h4>
                <div class="wrong-question-meta">
                  <el-tag size="small" type="info">{{ q.category }}</el-tag>
                  <el-tag size="small" :type="q.difficulty === '困难' ? 'danger' : 'warning'">{{ q.difficulty }}</el-tag>
                  <span>错 {{ q.wrongCount }} 次</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近笔记 -->
    <el-card class="glass-card hover-lift section-card" shadow="never">
      <template #header>
        <div class="section-header">
          <h3><el-icon><Document /></el-icon> 最近笔记</h3>
          <el-button type="primary" link @click="goTo('/note')">查看全部</el-button>
        </div>
      </template>
      <div class="notes-grid">
        <div v-for="note in recentNotes" :key="note.id" class="note-item" @click="goTo('/note')">
          <div class="note-icon">
            <el-icon :size="20"><Document /></el-icon>
          </div>
          <div class="note-content">
            <h4>{{ note.title }}</h4>
            <span class="note-time">{{ note.updatedAt }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-hero {
  margin: 0;
}

.page-title {
  font-size: 32px;
}

.badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.ai-recommend {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.ai-recommend__header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ai-recommend__icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.ai-recommend__content {
  flex: 1;
}

.ai-recommend__title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.ai-recommend__desc {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.quick-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
  }
}

.quick-card__icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.quick-card h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.quick-card span {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.section-card {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(139, 92, 246, 0.05);
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(139, 92, 246, 0.1);
  }
}

.course-cover {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.course-name {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
}

.course-meta {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.course-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-text {
  font-size: 14px;
  font-weight: 500;
  color: #8b5cf6;
  min-width: 40px;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
}

.achievement-points {
  font-size: 14px;
  font-weight: 600;
  color: #f59e0b;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.05);
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }
}

.task-priority {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  
  &.priority-high {
    background: #ef4444;
  }
  &.priority-medium {
    background: #f59e0b;
  }
  &.priority-low {
    background: #22c55e;
  }
}

.task-content {
  flex: 1;
}

.task-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
}

.task-deadline {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.wrong-question-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wrong-question-item {
  padding: 12px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.05);
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
}

.wrong-question-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
}

.wrong-question-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.note-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.05);
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(245, 158, 11, 0.1);
  }
}

.note-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  flex-shrink: 0;
}

.note-content {
  flex: 1;
}

.note-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
}

.note-time {
  font-size: 13px;
  color: var(--color-text-secondary);
}

@media (max-width: 1200px) {
  .quick-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .notes-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .notes-grid {
    grid-template-columns: 1fr;
  }
  .page-title {
    font-size: 24px;
  }
}
</style>