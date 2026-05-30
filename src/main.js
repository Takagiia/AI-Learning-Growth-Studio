import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useThemeStore } from '@/stores/theme'

// Element Plus 基础样式（按需引入组件，样式仍需全局注册）
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 项目全局样式
import '@/styles/global.scss'
import '@/styles/element-override.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化主题（深色模式 + localStorage）
useThemeStore()

app.mount('#app')
