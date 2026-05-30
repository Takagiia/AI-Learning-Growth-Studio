<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import StatCard from '@/components/common/StatCard.vue'
import { useUserStore } from '@/stores/user'
import { updateUserProfileApi } from '@/api/user'
import { Timer, Calendar, Edit } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const saving = ref(false)
const formRef = ref()

const form = reactive({
  nickname: '',
  signature: '',
  avatar: '',
})

const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
}

onMounted(async () => {
  await userStore.fetchProfile()
  Object.assign(form, {
    nickname: userStore.userInfo.nickname,
    signature: userStore.userInfo.signature,
    avatar: userStore.userInfo.avatar,
  })
})

async function handleSave() {
  await formRef.value?.validate()
  saving.value = true
  try {
    const res = await updateUserProfileApi({
      ...userStore.userInfo,
      ...form,
    })
    userStore.updateProfile(res.data)
    ElMessage.success('资料已保存')
  } finally {
    saving.value = false
  }
}

function handleLogout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="page-container profile">
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="8">
        <StatCard label="学习天数" :value="userStore.userInfo.studyDays ?? 0" unit="天" :icon="Calendar" color="#3b82f6" />
      </el-col>
      <el-col :xs="24" :sm="8">
        <StatCard label="累计学时" :value="userStore.userInfo.totalHours ?? 0" unit="小时" :icon="Timer" color="#8b5cf6" />
      </el-col>
      <el-col :xs="24" :sm="8">
        <StatCard label="账号" :value="userStore.userInfo.username || 'admin'" :icon="Edit" color="#22c55e" />
      </el-col>
    </el-row>

    <el-card class="glass-card profile__card" shadow="never">
      <template #header>个人资料</template>
      <div class="profile__main">
        <el-avatar :size="96" :src="form.avatar || userStore.userInfo.avatar">
          {{ form.nickname?.[0] || '学' }}
        </el-avatar>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="profile__form">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" />
          </el-form-item>
          <el-form-item label="个性签名">
            <el-input v-model="form.signature" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item label="头像 URL">
            <el-input v-model="form.avatar" placeholder="可选，输入头像图片地址" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="saving" @click="handleSave">保存资料</el-button>
            <el-button type="danger" plain @click="handleLogout">退出登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.stat-row {
  margin-bottom: 20px;
}

.profile__main {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.profile__form {
  flex: 1;
  min-width: 280px;
}
</style>
