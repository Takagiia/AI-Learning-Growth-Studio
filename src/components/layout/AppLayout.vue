<script setup>
import { computed, provide } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ParticleBackground from '@/components/common/ParticleBackground.vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import PomodoroTimer from '@/components/common/PomodoroTimer.vue'

const themeStore = useThemeStore()

// 通过 provide 向深层组件注入响应式主题配置（考核点：provide/inject 跨级通信）
provide(
  'themeConfig',
  computed(() => ({
    isDark: themeStore.isDark,
  })),
)

const layoutClass = computed(() => ({
  'app-layout': true,
  'app-layout--collapsed': themeStore.sidebarCollapsed,
}))
</script>

<template>
  <div :class="layoutClass">
    <ParticleBackground v-if="themeStore.showParticles" class="app-layout__particles" />
    <div class="app-layout__overlay tech-grid-bg" />
    <div class="app-layout__body">
      <AppSidebar />
      <div class="app-layout__main-wrap">
        <AppHeader />
        <main class="app-layout__main">
          <router-view v-slot="{ Component, route }">
            <transition name="fade-slide" mode="out-in">
              <!-- KeepAlive 缓存已访问页面，避免重复挂载与数据请求（考核点：KeepAlive） -->
              <keep-alive>
                <component :is="Component" :key="route.path" />
              </keep-alive>
            </transition>
          </router-view>
        </main>
      </div>
    </div>
    
    <!-- 全局番茄钟悬浮工具 -->
    <div class="app-layout__floating-tool">
      <transition name="el-zoom-in-bottom">
        <PomodoroTimer />
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.app-layout__particles {
  z-index: 0;
}

.app-layout__overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
}

.app-layout__body {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 100vh;
}

.app-layout__main-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-layout__main {
  flex: 1;
  overflow: auto;
  @include scrollbar-dark;
}

.app-layout--collapsed {
  --sidebar-width: var(--sidebar-collapsed-width);
}

.app-layout__floating-tool {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;
  pointer-events: auto;
}
</style>
