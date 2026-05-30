<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Odometer,
  Calendar,
  Reading,
  ChatDotRound,
  DataAnalysis,
  User,
} from '@element-plus/icons-vue'
import { getMenuItems } from '@/router/routes'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()
const themeStore = useThemeStore()

const iconMap = {
  Odometer,
  Calendar,
  Reading,
  ChatDotRound,
  DataAnalysis,
  User,
}

const menuItems = computed(() =>
  getMenuItems().map((item) => ({
    ...item,
    icon: iconMap[item.icon] || Odometer,
  })),
)

function isActive(path) {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <aside
    class="app-sidebar glass-card"
    :class="{ 'app-sidebar--collapsed': themeStore.sidebarCollapsed }"
  >
    <div class="app-sidebar__brand">
      <span class="gradient-text app-sidebar__logo">AI</span>
      <span v-show="!themeStore.sidebarCollapsed" class="app-sidebar__title">Learning</span>
    </div>
    <nav class="app-sidebar__nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="app-sidebar__item"
        :class="{ 'is-active': isActive(item.path) }"
        :title="item.title"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <span v-show="!themeStore.sidebarCollapsed">{{ item.title }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
.app-sidebar {
  width: var(--sidebar-width, #{$sidebar-width});
  margin: 16px 0 16px 16px;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  border-radius: $radius-lg;
  transition: width $transition-normal;
  flex-shrink: 0;
}

.app-sidebar--collapsed {
  width: var(--sidebar-collapsed-width, #{$sidebar-collapsed-width});

  .app-sidebar__item {
    justify-content: center;
    padding: 12px;
  }
}

.app-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 24px;
  font-weight: 700;
}

.app-sidebar__logo {
  font-size: 22px;
}

.app-sidebar__title {
  font-size: 16px;
  color: $color-text-secondary;
}

.app-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.app-sidebar__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: $radius-sm;
  color: $color-text-secondary;
  transition: all $transition-fast;

  &:hover {
    color: $color-text-primary;
    background: rgba(59, 130, 246, 0.12);
  }

  &.is-active {
    color: $color-text-primary;
    background: rgba(59, 130, 246, 0.2);
    box-shadow: inset 3px 0 0 $color-accent;
  }
}
</style>
