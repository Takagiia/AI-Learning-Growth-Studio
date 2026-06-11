import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getWrongQuestionListApi,
  getWrongQuestionDetailApi,
  createWrongQuestionApi,
  updateWrongQuestionApi,
  deleteWrongQuestionApi,
  markAsMasteredApi,
  getWrongQuestionCategoriesApi,
} from '@/api/wrongQuestion'

export const useWrongQuestionStore = defineStore('wrongQuestion', () => {
  const wrongQuestions = ref([])
  const categories = ref([])
  const total = ref(0)
  const loading = ref(false)
  const query = ref({ page: 1, pageSize: 10, category: '', difficulty: '', status: '', keyword: '' })

  async function fetchWrongQuestions(params = {}) {
    loading.value = true
    query.value = { ...query.value, ...params }
    try {
      const res = await getWrongQuestionListApi(query.value)
      wrongQuestions.value = res.data.list
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  async function fetchWrongQuestionDetail(id) {
    return await getWrongQuestionDetailApi(id)
  }

  async function fetchCategories() {
    const res = await getWrongQuestionCategoriesApi()
    categories.value = res.data
  }

  async function addWrongQuestion(data) {
    const res = await createWrongQuestionApi(data)
    await fetchWrongQuestions()
    return res.data
  }

  async function editWrongQuestion(id, data) {
    const res = await updateWrongQuestionApi(id, data)
    await fetchWrongQuestions()
    return res.data
  }

  async function removeWrongQuestion(id) {
    await deleteWrongQuestionApi(id)
    await fetchWrongQuestions()
  }

  async function markAsMastered(id) {
    const res = await markAsMasteredApi(id)
    await fetchWrongQuestions()
    return res.data
  }

  const masteredCount = computed(() => wrongQuestions.value.filter(q => q.status === 'mastered').length)
  const reviewingCount = computed(() => wrongQuestions.value.filter(q => q.status === 'reviewing').length)
  const newCount = computed(() => wrongQuestions.value.filter(q => q.status === 'new').length)

  return {
    wrongQuestions,
    categories,
    total,
    loading,
    query,
    masteredCount,
    reviewingCount,
    newCount,
    fetchWrongQuestions,
    fetchWrongQuestionDetail,
    fetchCategories,
    addWrongQuestion,
    editWrongQuestion,
    removeWrongQuestion,
    markAsMastered,
  }
})
