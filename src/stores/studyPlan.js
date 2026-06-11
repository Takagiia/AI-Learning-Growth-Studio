import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getStudyPlanListApi,
  createStudyPlanApi,
  updateStudyPlanApi,
  deleteStudyPlanApi,
} from '@/api/studyPlan'

/** 学习计划状态 */
export const useStudyPlanStore = defineStore('studyPlan', () => {
  const plans = ref([])
  const total = ref(0)
  const loading = ref(false)
  const query = ref({ page: 1, pageSize: 10, priority: '', status: '', keyword: '' })

  const pendingCount = computed(() => plans.value.filter((p) => p.status === 'pending').length)
  const doneCount = computed(() => plans.value.filter((p) => p.status === 'done').length)

  async function fetchPlans(params = {}) {
    loading.value = true
    query.value = { ...query.value, ...params }
    try {
      const res = await getStudyPlanListApi(query.value)
      plans.value = res.data.list
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  async function addPlan(data) {
    const res = await createStudyPlanApi(data)
    await fetchPlans()
    return res.data
  }

  async function editPlan(id, data) {
    const res = await updateStudyPlanApi(id, data)
    await fetchPlans()
    return res.data
  }

  async function removePlan(id) {
    await deleteStudyPlanApi(id)
    await fetchPlans()
  }

  async function toggleStatus(id) {
    const plan = plans.value.find((p) => p.id === id)
    if (!plan) return
    const statusMap = { pending: 'doing', doing: 'done', done: 'pending' }
    return editPlan(id, { status: statusMap[plan.status] || 'pending' })
  }

  return {
    plans,
    total,
    loading,
    query,
    pendingCount,
    doneCount,
    fetchPlans,
    addPlan,
    editPlan,
    removePlan,
    toggleStatus,
  }
})
