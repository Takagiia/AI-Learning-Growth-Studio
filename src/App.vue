<script setup>
/** 根组件：顶层路由出口（登录页与系统布局切换） */
</script>

<template>
  <div class="app-root">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  background: var(--color-bg-primary, #0a0e1a);
}
</style>
