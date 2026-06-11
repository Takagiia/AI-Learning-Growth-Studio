import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getResourceListApi,
  getResourceDetailApi,
  createResourceApi,
  uploadResourceApi,
  deleteResourceApi,
  getResourceCategoriesApi,
} from '@/api/resource'

export const useResourceStore = defineStore('resource', () => {
  const resources = ref([])
  const categories = ref([])
  const total = ref(0)
  const loading = ref(false)
  const query = ref({ page: 1, pageSize: 12, category: '', keyword: '', type: '' })

  async function fetchResources(params = {}) {
    loading.value = true
    query.value = { ...query.value, ...params }
    try {
      const res = await getResourceListApi(query.value)
      resources.value = res.data.list
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  async function fetchResourceDetail(id) {
    return await getResourceDetailApi(id)
  }

  async function fetchCategories() {
    const res = await getResourceCategoriesApi()
    categories.value = res.data
  }

  async function addResource(data) {
    const res = await createResourceApi(data)
    await fetchResources()
    return res.data
  }

  async function uploadResource(formData) {
    const res = await uploadResourceApi(formData)
    await fetchResources()
    return res.data
  }

  async function removeResource(id) {
    await deleteResourceApi(id)
    await fetchResources()
  }

  return {
    resources,
    categories,
    total,
    loading,
    query,
    fetchResources,
    fetchResourceDetail,
    fetchCategories,
    addResource,
    uploadResource,
    removeResource,
  }
})
