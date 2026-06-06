import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNoteStore = defineStore('notes', () => {
  const notes = ref(JSON.parse(localStorage.getItem('ai_notes') || '[]'))

  function addNote(content) {
    const newNote = {
      id: Date.now(),
      content,
      time: new Date().toLocaleString(),
    }
    notes.value.unshift(newNote)
    localStorage.setItem('ai_notes', JSON.stringify(notes.value))
  }

  function deleteNote(id) {
    notes.value = notes.value.filter(n => n.id !== id)
    localStorage.setItem('ai_notes', JSON.stringify(notes.value))
  }

  return {
    notes,
    addNote,
    deleteNote
  }
})
