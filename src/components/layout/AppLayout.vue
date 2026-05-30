<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import ParticleBackground from '@/components/common/ParticleBackground.vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const themeStore = useThemeStore()

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
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </main>
      </div>
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
</style>
