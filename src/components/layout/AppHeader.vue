<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Sunny, Moon, Fold, Expand } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

const pageTitle = computed(() => route.meta.title || 'AI 学习成长助手')

const themeIcon = computed(() => (themeStore.isDark ? Sunny : Moon))
const collapseIcon = computed(() => (themeStore.sidebarCollapsed ? Expand : Fold))

function goProfile() {
  router.push({ name: 'Profile' })
}
</script>

<template>
  <header class="app-header glass-card glass-card--glow">
    <div class="app-header__left">
      <el-button :icon="collapseIcon" circle text :aria-label="themeStore.sidebarCollapsed ? '展开侧栏' : '折叠侧栏'" @click="themeStore.toggleSidebar" />
      <div>
        <h1 class="app-header__title gradient-text">{{ pageTitle }}</h1>
        <p class="app-header__breadcrumb">AI Learning Assistant / {{ pageTitle }}</p>
      </div>
    </div>
    <div class="app-header__actions">
      <el-tooltip :content="themeStore.showParticles ? '关闭粒子' : '开启粒子'" placement="bottom">
        <el-switch v-model="themeStore.showParticles" inline-prompt active-text="粒子" inactive-text="粒子" />
      </el-tooltip>
      <el-button :icon="themeIcon" circle text :aria-label="themeStore.isDark ? '切换亮色模式' : '切换深色模式'" @click="themeStore.toggleTheme" />
      <div class="app-header__user" @click="goProfile">
        <el-avatar :size="36" :src="userStore.userInfo.avatar" :alt="userStore.userInfo.nickname + '的头像'">
          {{ userStore.userInfo.nickname?.[0] || '学' }}
        </el-avatar>
        <span class="app-header__name">{{ userStore.userInfo.nickname }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $header-height;
  margin: 16px 16px 0;
  padding: 0 20px;
  border-radius: $radius-md;
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-header__title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
}

.app-header__breadcrumb {
  font-size: 12px;
  color: $color-text-muted;
  margin-top: 2px;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: $radius-sm;
  transition: background $transition-fast;

  &:hover {
    background: rgba(59, 130, 246, 0.12);
  }
}

.app-header__name {
  color: $color-text-secondary;
  font-size: 14px;
}
</style>
