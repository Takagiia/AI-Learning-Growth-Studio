import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'
import {
  getStudyPlanListApi,
  createStudyPlanApi,
  updateStudyPlanApi,
  deleteStudyPlanApi,
} from '@/api/studyPlan'

const PLAN_STORAGE_KEY = 'ai-learning-plans-cache'

/** 学习计划状态 */
export const useStudyPlanStore = defineStore('studyPlan', () => {
  const plans = ref([])
  const total = ref(0)
  const loading = ref(false)
  const query = ref({ page: 1, pageSize: 10, priority: '', status: '', keyword: '' })

  const pendingCount = computed(() => plans.value.filter((p) => p.status === 'pending').length)
  const doneCount = computed(() => plans.value.filter((p) => p.status === 'done').length)

  function loadCacheFromStorage() {
    const cached = getStorage(PLAN_STORAGE_KEY)
    if (cached?.list) {
      plans.value = cached.list
      total.value = cached.total || cached.list.length
    }
  }

  function persistCache() {
    setStorage(PLAN_STORAGE_KEY, { list: plans.value, total: total.value })
  }

  async function fetchPlans(params = {}) {
    loading.value = true
    query.value = { ...query.value, ...params }
    try {
      const res = await getStudyPlanListApi(query.value)
      plans.value = res.data.list
      total.value = res.data.total
      persistCache()
    } finally {
      loading.value = false
    }
  }

  async function addPlan(data) {
    const res = await createStudyPlanApi(data)
    plans.value.unshift(res.data)
    total.value += 1
    persistCache()
    return res.data
  }

  async function editPlan(id, data) {
    const res = await updateStudyPlanApi(id, data)
    const index = plans.value.findIndex((p) => p.id === id)
    if (index !== -1) plans.value[index] = res.data
    persistCache()
    return res.data
  }

  async function removePlan(id) {
    await deleteStudyPlanApi(id)
    plans.value = plans.value.filter((p) => p.id !== id)
    total.value = Math.max(0, total.value - 1)
    persistCache()
  }

  async function toggleStatus(id) {
    const plan = plans.value.find((p) => p.id === id)
    if (!plan) return
    const statusMap = { pending: 'doing', doing: 'done', done: 'pending' }
    return editPlan(id, { status: statusMap[plan.status] || 'pending' })
  }

  loadCacheFromStorage()

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
    loadCacheFromStorage,
  }
})
