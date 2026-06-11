import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'

const POMODORO_STORAGE_KEY = 'ai-learning-pomodoro'

/** 阶段类型 */
export const PHASE = {
  FOCUS: 'focus',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
}

const PHASE_LABEL = {
  [PHASE.FOCUS]: '专注时光',
  [PHASE.SHORT_BREAK]: '短休',
  [PHASE.LONG_BREAK]: '长休',
}

const PHASE_COLOR = {
  [PHASE.FOCUS]: '#3b82f6',
  [PHASE.SHORT_BREAK]: '#22c55e',
  [PHASE.LONG_BREAK]: '#8b5cf6',
}

const defaultSettings = () => ({
  focusDuration: 25, // 分钟
  shortBreakDuration: 5,
  longBreakDuration: 15,
  roundsForLongBreak: 4, // 每多少轮进入一次长休
  autoStartNext: false,
})

const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const isSameDay = (a, b) => {
  const da = new Date(a)
  const db = new Date(b)
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate()
}

export const usePomodoroStore = defineStore('pomodoro', () => {
  // 计时核心状态
  const phase = ref(PHASE.FOCUS)
  const timeLeft = ref(25 * 60) // 秒
  const isRunning = ref(false)
  const endAt = ref(0) // 计时模式下基于 Date.now 的结束时刻
  let tickHandle = null

  // 本轮上下文
  const currentTask = ref({ type: 'free', id: '', title: '' })
  const completedRounds = ref(0) // 完成的专注轮数（用于长休判断）

  // 设置与历史
  const settings = ref(defaultSettings())
  const logs = ref([]) // 全部番茄记录

  function persist() {
    setStorage(POMODORO_STORAGE_KEY, {
      settings: settings.value,
      logs: logs.value,
    })
  }

  function hydrate() {
    const cached = getStorage(POMODORO_STORAGE_KEY)
    if (cached) {
      if (cached.settings) settings.value = { ...defaultSettings(), ...cached.settings }
      if (Array.isArray(cached.logs)) logs.value = cached.logs
    }
    // 初始化当前阶段的时间
    timeLeft.value = getPhaseDuration(phase.value)
  }

  // 自动持久化
  watch(settings, persist, { deep: true })
  watch(logs, persist, { deep: true })

  // === 派生数据 ===
  const phaseLabel = computed(() => PHASE_LABEL[phase.value])
  const phaseColor = computed(() => PHASE_COLOR[phase.value])
  const displayTime = computed(() => {
    const m = Math.floor(timeLeft.value / 60)
    const s = timeLeft.value % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })
  const progress = computed(() => {
    const total = getPhaseDuration(phase.value)
    return ((total - timeLeft.value) / total) * 100
  })
  const isFocusing = computed(() => phase.value === PHASE.FOCUS)
  const todayLogs = computed(() => logs.value.filter((l) => isSameDay(l.startAt, Date.now())))
  const todayCount = computed(() => todayLogs.value.filter((l) => l.completed).length)
  const todayMinutes = computed(() =>
    todayLogs.value
      .filter((l) => l.completed)
      .reduce((sum, l) => sum + Math.round(l.durationSec / 60), 0),
  )
  const streakDays = computed(() => {
    // 连续 N 天每天至少 1 个完成的番茄
    const days = new Set(
      logs.value
        .filter((l) => l.completed)
        .map((l) => {
          const d = new Date(l.startAt)
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        }),
    )
    let count = 0
    const cursor = new Date()
    while (true) {
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`
      if (days.has(key)) {
        count += 1
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    return count
  })

  // 今日完成率 / 中断率 / 平均评分
  const todayCompletionRate = computed(() => {
    const todays = todayLogs.value
    if (!todays.length) return 0
    return Math.round((todays.filter((l) => l.completed).length / todays.length) * 100)
  })
  const todayInterruptRate = computed(() => {
    const todays = todayLogs.value
    if (!todays.length) return 0
    return Math.round((todays.filter((l) => l.interruptReason).length / todays.length) * 100)
  })
  const todayAvgRating = computed(() => {
    const rated = todayLogs.value.filter((l) => l.reflection?.mood)
    if (!rated.length) return 0
    return (rated.reduce((s, l) => s + l.reflection.mood, 0) / rated.length).toFixed(1)
  })

  // 7 天趋势
  const weeklyTrend = computed(() => {
    const days = []
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      const items = logs.value.filter((l) => {
        const ld = new Date(l.startAt)
        return ld.getFullYear() === d.getFullYear() && ld.getMonth() === d.getMonth() && ld.getDate() === d.getDate()
      })
      const completed = items.filter((l) => l.completed).length
      const minutes = items.filter((l) => l.completed).reduce((s, l) => s + Math.round(l.durationSec / 60), 0)
      days.push({ date: key, label: `${d.getMonth() + 1}/${d.getDate()}`, count: completed, minutes })
    }
    return days
  })

  // 课程投入分布
  const courseDistribution = computed(() => {
    const map = new Map()
    logs.value
      .filter((l) => l.completed && l.taskType === 'course')
      .forEach((l) => {
        const key = l.taskTitle || '未命名课程'
        map.set(key, (map.get(key) || 0) + Math.round(l.durationSec / 60))
      })
    return Array.from(map.entries()).map(([name, minutes]) => ({ name, minutes }))
  })

  // 专注高峰（按小时）
  const focusPeak = computed(() => {
    const arr = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0 }))
    logs.value
      .filter((l) => l.completed)
      .forEach((l) => {
        const h = new Date(l.startAt).getHours()
        arr[h].count += 1
      })
    return arr
  })

  // === 行为 ===
  function getPhaseDuration(p) {
    if (p === PHASE.FOCUS) return settings.value.focusDuration * 60
    if (p === PHASE.SHORT_BREAK) return settings.value.shortBreakDuration * 60
    if (p === PHASE.LONG_BREAK) return settings.value.longBreakDuration * 60
    return 25 * 60
  }

  function setTask(task) {
    currentTask.value = { type: task?.type || 'free', id: task?.id || '', title: task?.title || '' }
  }

  function tick() {
    const remaining = Math.round((endAt.value - Date.now()) / 1000)
    if (remaining <= 0) {
      timeLeft.value = 0
      completePhase()
    } else {
      timeLeft.value = remaining
    }
  }

  function start() {
    if (isRunning.value) return
    endAt.value = Date.now() + timeLeft.value * 1000
    isRunning.value = true
    if (tickHandle) clearInterval(tickHandle)
    tickHandle = setInterval(tick, 1000)
    // 后台标签页校准
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisible)
    }
  }

  function pause() {
    if (!isRunning.value) return
    isRunning.value = false
    if (tickHandle) {
      clearInterval(tickHandle)
      tickHandle = null
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', onVisible)
    }
  }

  function reset() {
    pause()
    timeLeft.value = getPhaseDuration(phase.value)
  }

  function skip() {
    pause()
    switchPhase(true)
  }

  function onVisible() {
    if (document.visibilityState === 'visible' && isRunning.value) {
      tick()
    }
  }

  function notify(title, body) {
    if (typeof window === 'undefined') return
    if (window.Notification && Notification.permission === 'granted') {
      try {
        new Notification(title, { body })
      } catch {
        /* noop */
      }
    }
  }

  function completePhase() {
    pause()
    const now = Date.now()
    const phaseDuration = getPhaseDuration(phase.value)
    // 写入一条日志（仅专注阶段记入统计）
    if (phase.value === PHASE.FOCUS) {
      const log = {
        id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
        startAt: now - phaseDuration * 1000,
        endAt: now,
        durationSec: phaseDuration,
        taskType: currentTask.value.type,
        taskId: currentTask.value.id,
        taskTitle: currentTask.value.title,
        completed: true,
        interruptReason: '',
        reflection: null,
        date: todayKey(),
      }
      logs.value.unshift(log)
      completedRounds.value += 1
      notify('专注完成', '休息一下吧，继续保持节奏！')
    } else {
      notify('休息结束', '准备好开始下一个专注周期了吗？')
    }
    switchPhase(true)
  }

  function switchPhase(autoStart = false) {
    if (phase.value === PHASE.FOCUS) {
      const useLong =
        completedRounds.value > 0 && completedRounds.value % settings.value.roundsForLongBreak === 0
      phase.value = useLong ? PHASE.LONG_BREAK : PHASE.SHORT_BREAK
    } else {
      phase.value = PHASE.FOCUS
    }
    timeLeft.value = getPhaseDuration(phase.value)
    if (autoStart && settings.value.autoStartNext) {
      start()
    }
  }

  function interrupt(reason) {
    if (phase.value !== PHASE.FOCUS || isRunning.value) {
      // 还未开始的也允许标记为中断
      pause()
    }
    const now = Date.now()
    const elapsed = getPhaseDuration(phase.value) - timeLeft.value
    if (elapsed <= 0) return
    const log = {
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      startAt: now - elapsed * 1000,
      endAt: now,
      durationSec: elapsed,
      taskType: currentTask.value.type,
      taskId: currentTask.value.id,
      taskTitle: currentTask.value.title,
      completed: false,
      interruptReason: reason || '未说明',
      reflection: null,
      date: todayKey(),
    }
    logs.value.unshift(log)
    // 中断后回到专注
    phase.value = PHASE.FOCUS
    timeLeft.value = getPhaseDuration(PHASE.FOCUS)
  }

  function saveReflection(logId, reflection) {
    const log = logs.value.find((l) => l.id === logId)
    if (log) {
      log.reflection = reflection
    }
  }

  function clearHistory() {
    logs.value = []
  }

  // 应用启动时请求通知权限
  function requestNotification() {
    if (typeof window === 'undefined') return
    if (window.Notification && Notification.permission === 'default') {
      try {
        Notification.requestPermission()
      } catch {
        /* noop */
      }
    }
  }

  hydrate()
  requestNotification()

  return {
    // state
    phase,
    timeLeft,
    isRunning,
    currentTask,
    completedRounds,
    settings,
    logs,
    // computed
    phaseLabel,
    phaseColor,
    displayTime,
    progress,
    isFocusing,
    todayLogs,
    todayCount,
    todayMinutes,
    streakDays,
    todayCompletionRate,
    todayInterruptRate,
    todayAvgRating,
    weeklyTrend,
    courseDistribution,
    focusPeak,
    // actions
    setTask,
    start,
    pause,
    reset,
    skip,
    interrupt,
    switchPhase,
    saveReflection,
    clearHistory,
    getPhaseDuration,
    hydrate,
  }
})
