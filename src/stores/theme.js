import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'

const THEME_STORAGE_KEY = 'ai-learning-theme'

const defaultTheme = () => ({
  isDark: true,
  showParticles: true,
  sidebarCollapsed: false,
})

/** 系统主题状态 */
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true)
  const showParticles = ref(true)
  const sidebarCollapsed = ref(false)

  function loadFromStorage() {
    const cached = getStorage(THEME_STORAGE_KEY)
    if (cached) {
      isDark.value = cached.isDark ?? true
      showParticles.value = cached.showParticles ?? true
      sidebarCollapsed.value = cached.sidebarCollapsed ?? false
    }
    applyTheme()
  }

  function persist() {
    setStorage(THEME_STORAGE_KEY, {
      isDark: isDark.value,
      showParticles: showParticles.value,
      sidebarCollapsed: sidebarCollapsed.value,
    })
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
    document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme()
    persist()
  }

  function toggleParticles() {
    showParticles.value = !showParticles.value
    persist()
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    persist()
  }

  watch([isDark, showParticles, sidebarCollapsed], persist)

  loadFromStorage()

  return {
    isDark,
    showParticles,
    sidebarCollapsed,
    toggleTheme,
    toggleParticles,
    toggleSidebar,
    loadFromStorage,
  }
})
