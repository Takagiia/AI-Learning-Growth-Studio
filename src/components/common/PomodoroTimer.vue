<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { AlarmClock, VideoPlay, VideoPause, RefreshRight, ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const TOTAL_WORK_TIME = 25 * 60 // 25 minutes
const TOTAL_REST_TIME = 5 * 60 // 5 minutes

const timeLeft = ref(TOTAL_WORK_TIME)
const isRunning = ref(false)
const isResting = ref(false)
const isCollapsed = ref(false)
let timer = null

const displayTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const progress = computed(() => {
  const total = isResting.value ? TOTAL_REST_TIME : TOTAL_WORK_TIME
  return ((total - timeLeft.value) / total) * 100
})

function toggleTimer() {
  if (isRunning.value) {
    clearInterval(timer)
  } else {
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        handleTimerEnd()
      }
    }, 1000)
  }
  isRunning.value = !isRunning.value
}

function handleTimerEnd() {
  clearInterval(timer)
  isRunning.value = false
  
  // Notification (Simple alert for now)
  const title = isResting.value ? '休息结束' : '专注结束'
  const message = isResting.value ? '准备好开始下一个专注周期了吗？' : '太棒了！休息 5 分钟吧。'
  
  if (window.Notification && Notification.permission === 'granted') {
    new Notification(title, { body: message })
  } else {
    ElMessage.success(title + ': ' + message)
  }

  // Switch mode
  isResting.value = !isResting.value
  timeLeft.value = isResting.value ? TOTAL_REST_TIME : TOTAL_WORK_TIME
}

function resetTimer() {
  clearInterval(timer)
  isRunning.value = false
  isResting.value = false
  timeLeft.value = TOTAL_WORK_TIME
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// Request notification permission
if (window.Notification && Notification.permission === 'default') {
  Notification.requestPermission()
}
</script>

<template>
  <div class="pomodoro-timer glass-card" :class="{ collapsed: isCollapsed }">
    <div class="pomodoro-timer__header">
      <el-icon><AlarmClock /></el-icon>
      <span v-if="!isCollapsed">{{ isResting ? '休息时间' : '专注时光' }}</span>
      <span v-else>{{ displayTime }}</span>
      <el-button class="collapse-btn" link @click="toggleCollapse">
        <el-icon><ArrowUp v-if="isCollapsed" /><ArrowDown v-else /></el-icon>
      </el-button>
    </div>
    
    <div v-if="!isCollapsed" class="pomodoro-timer__display">
      <el-progress 
        type="circle" 
        :percentage="progress" 
        :stroke-width="8"
        :color="isResting ? '#22c55e' : '#3b82f6'"
        :width="120"
      >
        <div class="time-text">{{ displayTime }}</div>
      </el-progress>
    </div>

    <div v-if="!isCollapsed" class="pomodoro-timer__actions">
      <el-button 
        circle 
        size="large" 
        :type="isRunning ? 'warning' : 'primary'"
        @click="toggleTimer"
      >
        <el-icon :size="20">
          <VideoPause v-if="isRunning" />
          <VideoPlay v-else />
        </el-icon>
      </el-button>
      
      <el-button circle size="large" @click="resetTimer">
        <el-icon :size="20"><RefreshRight /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pomodoro-timer {
  padding: 16px;
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
  }
  
  &.collapsed {
    width: auto;
    padding: 8px 12px;
  }
}

.pomodoro-timer__header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  width: 100%;
  justify-content: space-between;
}

.collapse-btn {
  padding: 0;
  margin-left: auto;
  
  &:hover {
    background: transparent;
  }
}

.pomodoro-timer__display {
  margin: 8px 0;
}

.time-text {
  font-size: 20px;
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;
}

.pomodoro-timer__actions {
  display: flex;
  gap: 12px;
}
</style>
