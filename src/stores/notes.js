import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getNoteListApi,
  getNoteDetailApi,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
  getNoteCategoriesApi,
} from '@/api/note'

export const useNoteStore = defineStore('note', () => {
  const notes = ref([])
  const categories = ref([])
  const total = ref(0)
  const loading = ref(false)
  const currentNote = ref(null)
  const query = ref({ page: 1, pageSize: 10, category: '', keyword: '' })

  async function fetchNotes(params = {}) {
    loading.value = true
    query.value = { ...query.value, ...params }
    try {
      const res = await getNoteListApi(query.value)
      notes.value = res.data.list
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  async function fetchNoteDetail(id) {
    const res = await getNoteDetailApi(id)
    currentNote.value = res.data
    return res.data
  }

  async function fetchCategories() {
    const res = await getNoteCategoriesApi()
    categories.value = res.data
  }

  async function addNote(data) {
    const res = await createNoteApi(data)
    await fetchNotes()
    return res.data
  }

  async function editNote(id, data) {
    const res = await updateNoteApi(id, data)
    await fetchNotes()
    return res.data
  }

  async function removeNote(id) {
    await deleteNoteApi(id)
    await fetchNotes()
  }

  return {
    notes,
    categories,
    total,
    loading,
    currentNote,
    query,
    fetchNotes,
    fetchNoteDetail,
    fetchCategories,
    addNote,
    editNote,
    removeNote,
  }
})
