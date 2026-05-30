<script setup>
import { ref, nextTick, watch } from 'vue'
import { Promotion } from '@element-plus/icons-vue'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  quickQuestions: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['send', 'quick'])

const inputText = ref('')
const listRef = ref(null)

async function scrollToBottom() {
  await nextTick()
  if (listRef.value) {
    listRef.value.scrollTop = listRef.value.scrollHeight
  }
}

watch(
  () => props.messages.length,
  () => scrollToBottom(),
)

function handleSend() {
  const text = inputText.value.trim()
  if (!text || props.loading) return
  emit('send', text)
  inputText.value = ''
}

function handleQuick(q) {
  if (props.loading) return
  emit('quick', q)
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="ai-chat glass-card">
    <div ref="listRef" class="ai-chat__messages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="ai-chat__bubble"
        :class="`ai-chat__bubble--${msg.role}`"
      >
        <div class="ai-chat__avatar">{{ msg.role === 'user' ? '我' : 'AI' }}</div>
        <div class="ai-chat__content">
          <p>{{ msg.content }}</p>
          <span class="ai-chat__time">{{ msg.time }}</span>
        </div>
      </div>
      <div v-if="loading" class="ai-chat__typing">
        <span /><span /><span />
      </div>
    </div>

    <div v-if="quickQuestions.length" class="ai-chat__quick">
      <el-tag
        v-for="q in quickQuestions"
        :key="q"
        class="ai-chat__quick-tag"
        :class="{ 'ai-chat__quick-tag--disabled': loading }"
        effect="plain"
        round
        @click="handleQuick(q)"
      >
        {{ q }}
      </el-tag>
    </div>

    <div class="ai-chat__input">
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="2"
        placeholder="输入学习问题，Enter 发送..."
        :disabled="loading"
        resize="none"
        @keydown="onKeydown"
      />
      <el-button type="primary" :icon="Promotion" :loading="loading" :disabled="loading" @click="handleSend">发送</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ai-chat {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
  min-height: 480px;
  padding: 16px;
}

.ai-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  @include scrollbar-dark;
}

.ai-chat__bubble {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;

  &--user {
    flex-direction: row-reverse;

    .ai-chat__content {
      background: rgba(59, 130, 246, 0.25);
      border-color: rgba(59, 130, 246, 0.4);
    }

    .ai-chat__time {
      text-align: right;
    }
  }

  &--assistant .ai-chat__content {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.3);
  }
}

.ai-chat__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: $color-accent-gradient;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.ai-chat__content {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  line-height: 1.6;
  font-size: 14px;
}

.ai-chat__time {
  display: block;
  font-size: 11px;
  color: $color-text-muted;
  margin-top: 6px;
}

.ai-chat__typing {
  display: flex;
  gap: 4px;
  padding: 12px 16px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $color-accent;
    animation: bounce 1.2s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.ai-chat__quick {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 0;
  border-top: 1px solid $color-border;
}

.ai-chat__quick-tag {
  cursor: pointer;

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
}

.ai-chat__input {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  padding-top: 12px;
  border-top: 1px solid $color-border;

  .el-textarea {
    flex: 1;
  }
}
</style>
