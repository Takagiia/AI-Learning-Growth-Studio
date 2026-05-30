<script setup>
/**
 * 图片懒加载组件
 * @props src - 图片地址
 * @props alt - 替代文本
 * @props fit - object-fit 模式
 * @emit load - 加载完成
 * @emit error - 加载失败
 */
import { ref } from 'vue'

defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  fit: { type: String, default: 'cover' },
})

const emit = defineEmits(['load', 'error'])

const loaded = ref(false)
const errored = ref(false)

function onLoad() {
  loaded.value = true
  emit('load')
}

function onError() {
  errored.value = true
  emit('error')
}
</script>

<template>
  <div class="lazy-image" :class="{ 'is-loaded': loaded, 'is-error': errored }">
    <img
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
      :style="{ objectFit: fit }"
      @load="onLoad"
      @error="onError"
    />
    <div v-if="!loaded && !errored" class="lazy-image__placeholder" />
  </div>
</template>

<style scoped lang="scss">
.lazy-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgba(30, 41, 59, 0.5);

  img {
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  &.is-loaded img {
    opacity: 1;
  }

  &.is-error {
    background: rgba(30, 41, 59, 0.8);
  }
}

.lazy-image__placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(30, 41, 59, 0.4) 0%,
    rgba(59, 130, 246, 0.15) 50%,
    rgba(30, 41, 59, 0.4) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
