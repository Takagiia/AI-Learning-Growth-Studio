<script setup>
import { computed, onMounted, ref } from 'vue'
import StatCard from '@/components/common/StatCard.vue'
import ChartCard from '@/components/common/ChartCard.vue'
import { getAnalyticsOverviewApi } from '@/api/analytics'
import { buildLineOption, buildBarOption, buildPieOption, buildHeatmapOption } from '@/utils/echarts'
import { Timer, DocumentChecked, Reading } from '@element-plus/icons-vue'

const loading = ref(false)
const data = ref(null)

const lineOption = computed(() => {
  if (!data.value?.monthTrend) return {}
  return buildLineOption({
    title: '近6月学习时长趋势',
    labels: data.value.monthTrend.labels,
    values: data.value.monthTrend.values,
    seriesName: '学习时长',
  })
})

const barOption = computed(() => {
  if (!data.value?.weeklyHours) return {}
  return buildBarOption({
    title: '本周每日学习（小时）',
    labels: data.value.weeklyHours.labels,
    values: data.value.weeklyHours.values,
    seriesName: '小时',
  })
})

const pieOption = computed(() => {
  if (!data.value?.taskRate) return {}
  const { done, doing, pending } = data.value.taskRate
  return buildPieOption({
    title: '任务完成分布',
    data: [
      { name: '已完成', value: done },
      { name: '进行中', value: doing },
      { name: '待开始', value: pending },
    ],
  })
})

const courseBarOption = computed(() => {
  if (!data.value?.courseProgress?.list) return {}
  const list = data.value.courseProgress.list
  return buildBarOption({
    title: '课程完成进度',
    labels: list.map((i) => i.name),
    values: list.map((i) => i.value),
    seriesName: '进度%',
  })
})

const heatmapOption = computed(() => {
  if (!data.value?.heatmap) return {}
  return buildHeatmapOption({ data: data.value.heatmap })
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await getAnalyticsOverviewApi()
    data.value = res.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-loading="loading" class="page-container analytics">
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="8">
        <StatCard label="累计学习" :value="data?.totalHours ?? '--'" unit="小时" :icon="Timer" color="#3b82f6" />
      </el-col>
      <el-col :xs="24" :sm="8">
        <StatCard label="完成任务" :value="data?.completedTasks ?? '--'" unit="项" :icon="DocumentChecked" color="#8b5cf6" />
      </el-col>
      <el-col :xs="24" :sm="8">
        <StatCard label="课程完成率" :value="data?.courseCompletion ?? '--'" unit="%" :icon="Reading" color="#22c55e" />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :lg="12">
        <ChartCard title="月度学习趋势" :option="lineOption" :loading="loading" height="320px" />
      </el-col>
      <el-col :xs="24" :lg="12">
        <ChartCard title="本周学习时长" :option="barOption" :loading="loading" height="320px" />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="12">
        <ChartCard title="任务完成分布" :option="pieOption" :loading="loading" height="340px" />
      </el-col>
      <el-col :xs="24" :lg="12">
        <ChartCard title="课程进度" :option="courseBarOption" :loading="loading" height="340px" />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24">
        <ChartCard title="学习热力图" :option="heatmapOption" :loading="loading" height="220px" />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.stat-row {
  margin-bottom: 20px;
}

.chart-row {
  margin-top: 20px;
}
</style>
