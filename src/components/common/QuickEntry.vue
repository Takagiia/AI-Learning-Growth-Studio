<script setup>
/**
 * Dashboard 快捷入口
 * @emit navigate - 点击入口时触发，参数为 path
 */
import { useRouter } from 'vue-router'
import {
  Calendar,
  Reading,
  ChatDotRound,
  DataAnalysis,
} from '@element-plus/icons-vue'
import { QUICK_ENTRIES } from '@/utils/constants'

const emit = defineEmits(['navigate'])

const router = useRouter()
const iconMap = { Calendar, Reading, ChatDotRound, DataAnalysis }

function navigate(path) {
  emit('navigate', path)
  router.push(path)
}
</script>

<template>
  <el-card class="quick-entry glass-card hover-lift" shadow="never">
    <template #header>快捷入口</template>
    <div class="quick-entry__grid">
      <div
        v-for="item in QUICK_ENTRIES"
        :key="item.path"
        class="quick-entry__item"
        @click="navigate(item.path)"
      >
        <div class="quick-entry__icon" :style="{ background: `${item.color}22`, color: item.color }">
          <el-icon :size="22"><component :is="iconMap[item.icon]" /></el-icon>
        </div>
        <span>{{ item.title }}</span>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.quick-entry__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.quick-entry__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 8px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-normal;
  color: $color-text-secondary;

  &:hover {
    background: rgba(59, 130, 246, 0.12);
    color: $color-text-primary;
    transform: translateY(-4px);
  }
}

.quick-entry__icon {
  width: 48px;
  height: 48px;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform $transition-fast;
}

.quick-entry__item:hover .quick-entry__icon {
  transform: scale(1.1);
}
</style>
