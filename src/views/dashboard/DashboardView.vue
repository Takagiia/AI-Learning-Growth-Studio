<script setup>
import { computed, onMounted, ref } from 'vue'
import { Timer, List, CircleCheck } from '@element-plus/icons-vue'
import StatCard from '@/components/common/StatCard.vue'
import ChartCard from '@/components/common/ChartCard.vue'
import QuickEntry from '@/components/common/QuickEntry.vue'
import { getDashboardStatsApi } from '@/api/dashboard'
import { useUserStore } from '@/stores/user'
import { buildLineOption, buildBarOption } from '@/utils/echarts'

const userStore = useUserStore()
const stats = ref(null)
const loading = ref(false)

const lineOption = computed(() => {
  if (!stats.value?.weekTrend) return {}
  return buildLineOption({
    labels: stats.value.weekTrend.labels,
    values: stats.value.weekTrend.values,
    seriesName: '学习分钟',
  })
})

const barOption = computed(() => {
  if (!stats.value?.weekTrend) return {}
  return buildBarOption({
    labels: stats.value.weekTrend.labels,
    values: stats.value.weekTrend.values.map((v) => Math.round(v / 10)),
    seriesName: '任务强度',
  })
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await getDashboardStatsApi()
    stats.value = res.data
    await userStore.fetchProfile()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-loading="loading" class="page-container dashboard">
    <el-card class="glass-card welcome-card hover-lift" shadow="never">
      <div class="welcome-card__inner">
        <div>
          <h2 class="gradient-text">欢迎回来，{{ userStore.userInfo.nickname }} 👋</h2>
          <p class="welcome-card__desc">{{ userStore.userInfo.signature }}</p>
          <div class="welcome-card__tags">
            <el-tag effect="plain" type="info">学习 {{ userStore.userInfo.studyDays || 0 }} 天</el-tag>
            <el-tag effect="plain" type="success">累计 {{ userStore.userInfo.totalHours || 0 }} 小时</el-tag>
          </div>
        </div>
        <el-avatar :size="72" :src="userStore.userInfo.avatar" :alt="userStore.userInfo.nickname + '的头像'">
          {{ userStore.userInfo.nickname?.[0] }}
        </el-avatar>
      </div>
    </el-card>

    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="8">
        <StatCard label="今日学习" :value="stats?.todayMinutes ?? '--'" unit="分钟" :icon="Timer" color="#3b82f6" />
      </el-col>
      <el-col :xs="24" :sm="8">
        <StatCard label="学习任务" :value="stats?.taskCount ?? '--'" unit="项" :icon="List" color="#8b5cf6" />
      </el-col>
      <el-col :xs="24" :sm="8">
        <StatCard label="完成率" :value="stats?.completedRate ?? '--'" unit="%" :icon="CircleCheck" color="#22c55e" />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :lg="12">
        <ChartCard title="本周学习趋势（折线图）" :option="lineOption" :loading="loading" height="300px" />
      </el-col>
      <el-col :xs="24" :lg="12">
        <ChartCard title="本周任务强度（柱状图）" :option="barOption" :loading="loading" height="300px" />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="bottom-row">
      <el-col :xs="24" :lg="8">
        <QuickEntry />
      </el-col>
      <el-col :xs="24" :lg="16">
        <el-card class="glass-card" shadow="never">
          <template #header>学习建议</template>
          <p class="dashboard__tip">
            根据你的学习数据，建议今日专注完成 2-3 个高优先级任务，并保持至少 60 分钟深度学习时间。
            可通过左侧快捷入口进入 AI 助手获取个性化建议。
          </p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.welcome-card {
  margin-bottom: 20px;
}

.welcome-card__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  h2 {
    font-size: 22px;
    margin-bottom: 8px;
  }
}

.welcome-card__desc {
  color: $color-text-secondary;
  margin-bottom: 12px;
}

.welcome-card__tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-row {
  margin-bottom: 20px;
}

.bottom-row {
  margin-top: 20px;
}

.dashboard__tip {
  color: $color-text-secondary;
  line-height: 1.8;
  font-size: 14px;
}
</style>
