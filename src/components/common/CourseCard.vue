<script setup>
/**
 * 课程卡片
 * @props course - 课程对象 { id, title, cover, description, progress, teacher, lessons, category }
 * @emit click - 点击卡片，参数为 course 对象
 */
import LazyImage from './LazyImage.vue'

defineProps({
  course: { type: Object, required: true },
})

const emit = defineEmits(['click'])

const categoryLabels = {
  frontend: '前端',
  cs: '计算机',
  language: '语言',
}
</script>

<template>
  <el-card class="course-card glass-card glass-card--glow hover-lift" shadow="never" @click="emit('click', course)">
    <div class="course-card__cover">
      <LazyImage :src="course.cover" :alt="course.title" />
      <el-tag size="small" class="course-card__tag">{{ categoryLabels[course.category] || course.category }}</el-tag>
    </div>
    <div class="course-card__body">
      <h3 class="course-card__title">{{ course.title }}</h3>
      <p class="course-card__desc">{{ course.description }}</p>
      <div class="course-card__meta">
        <span>{{ course.teacher }}</span>
        <span>{{ course.lessons }} 课时</span>
      </div>
      <div class="course-card__progress">
        <span>学习进度</span>
        <span>{{ course.progress }}%</span>
      </div>
      <el-progress :percentage="course.progress" :stroke-width="6" :show-text="false" />
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.course-card {
  cursor: pointer;
  height: 100%;
}

.course-card__cover {
  position: relative;
  height: 140px;
  overflow: hidden;
  border-radius: $radius-sm $radius-sm 0 0;
  margin: -20px -20px 12px;

  :deep(.lazy-image) {
    height: 140px;
  }

  &:hover :deep(img) {
    transform: scale(1.05);
  }
}

.course-card__tag {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.course-card__title {
  font-size: 16px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-card__desc {
  font-size: 13px;
  color: $color-text-secondary;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
  margin-bottom: 12px;
}

.course-card__meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: $color-text-muted;
  margin-bottom: 12px;
}

.course-card__progress {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: $color-text-secondary;
  margin-bottom: 6px;
}
</style>
