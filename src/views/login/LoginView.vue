<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import ParticleBackground from '@/components/common/ParticleBackground.vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { loginApi } from '@/api/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const themeStore = useThemeStore()
const loading = ref(false)

const form = reactive({
  username: 'admin',
  password: '123456',
})

const rules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度 3-20 位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 32, message: '密码长度 6-32 位', trigger: 'blur' },
  ],
}

const formRef = ref()

async function handleLogin() {
  await formRef.value?.validate()
  loading.value = true
  try {
    const res = await loginApi(form)
    userStore.setLogin({
      token: res.data.token,
      userInfo: res.data.userInfo,
    })
    ElMessage.success('登录成功')
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch {
    // 错误已在拦截器提示
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page tech-grid-bg">
    <ParticleBackground v-if="themeStore.showParticles" color="59, 130, 246" :count="80" />
    <div class="login-page__glow" />
    <el-card class="login-card gradient-border-card" shadow="never">
      <h2 class="gradient-text login-card__title">AI 学习成长助手</h2>
      <p class="login-card__subtitle">科技风学习平台 · 课程演示项目</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="handleLogin">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="admin" size="large" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="123456" size="large" show-password />
        </el-form-item>
        <el-button type="primary" size="large" class="login-card__btn" :loading="loading" native-type="submit">
          登 录
        </el-button>
      </el-form>
      <p class="login-card__hint">演示账号：admin / 123456</p>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-page__glow {
  position: absolute;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent 70%);
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
}

.login-card {
  position: relative;
  z-index: 2;
  width: 420px;
  padding: 12px 8px 8px;
}

.login-card__title {
  font-size: 26px;
  text-align: center;
  margin-bottom: 8px;
}

.login-card__subtitle {
  text-align: center;
  color: $color-text-secondary;
  font-size: 14px;
  margin-bottom: 28px;
}

.login-card__btn {
  width: 100%;
  margin-top: 8px;
}

.login-card__hint {
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: $color-text-muted;
}
</style>
