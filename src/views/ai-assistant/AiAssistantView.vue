<script setup>
import { onMounted, ref } from 'vue'
import AIChatBox from '@/components/common/AIChatBox.vue'
import { sendAiChatApi, getQuickQuestionsApi } from '@/api/ai'

const messages = ref([
  {
    id: 'welcome',
    role: 'assistant',
    content: '你好！我是 AI 学习助手，可以为你提供考研、英语、Vue 项目、时间管理等学习建议。试试下面的快捷问题吧～',
    time: formatTime(new Date()),
  },
])
const quickQuestions = ref([])
const loading = ref(false)
const isDev = import.meta.env.DEV

function formatTime(date) {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function pushMessage(role, content) {
  messages.value.push({
    id: `${Date.now()}_${Math.random()}`,
    role,
    content,
    time: formatTime(new Date()),
  })
}

async function handleSend(text) {
  if (loading.value) return
  pushMessage('user', text)
  loading.value = true

  // 保证 loading 动画至少展示 300ms，避免一闪而过
  const minDelay = new Promise((resolve) => setTimeout(resolve, 300))

  try {
    const res = await sendAiChatApi({ question: text })
    await minDelay
    pushMessage('assistant', res.data.content)
  } catch (err) {
    console.error('[AI] 请求失败:', err.message || err)
    await minDelay
    pushMessage('assistant', '请求失败，请稍后重试。')
  } finally {
    loading.value = false
  }
}

function handleQuick(q) {
  handleSend(q)
}

onMounted(async () => {
  try {
    const res = await getQuickQuestionsApi()
    quickQuestions.value = res.data
  } catch {
    quickQuestions.value = ['如何准备考研？', '怎样提高英语学习效率？']
  }
})
</script>

<template>
  <div class="page-container ai-page">
    <el-card class="glass-card ai-page__card" shadow="never">
      <template #header>
        <div class="ai-page__header">
          <span class="gradient-text">AI 学习助手</span>
          <el-tag v-if="isDev" effect="plain" type="success" size="small">Mock 智能回复</el-tag>
        </div>
      </template>
      <AIChatBox
        :messages="messages"
        :quick-questions="quickQuestions"
        :loading="loading"
        @send="handleSend"
        @quick="handleQuick"
      />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.ai-page__card {
  :deep(.el-card__body) {
    padding: 0;
  }
}

.ai-page__header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
}
</style>
