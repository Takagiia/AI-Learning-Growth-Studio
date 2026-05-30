import { watch } from 'vue'
import { getStorage, setStorage } from './storage'

/**
 * Pinia 状态持久化辅助
 * @param {import('vue').Ref|object} state - 响应式对象或 ref
 * @param {string} key - localStorage 键名
 * @param {object} options
 */
export function usePersist(state, key, options = {}) {
  const { paths = null, immediate = true } = options

  function load() {
    const cached = getStorage(key)
    if (!cached) return
    if (paths && typeof cached === 'object') {
      paths.forEach((p) => {
        if (cached[p] !== undefined && state[p] !== undefined) {
          state[p] = cached[p]
        }
      })
    } else if (state.value !== undefined) {
      state.value = cached
    } else {
      Object.assign(state, cached)
    }
  }

  function save() {
    let payload
    if (paths) {
      payload = {}
      paths.forEach((p) => {
        payload[p] = state[p]?.value ?? state[p]
      })
    } else if (state.value !== undefined) {
      payload = state.value
    } else {
      payload = { ...state }
    }
    setStorage(key, payload)
  }

  load()

  if (immediate) {
    watch(
      () => (paths ? paths.map((p) => state[p]?.value ?? state[p]) : state.value ?? state),
      () => save(),
      { deep: true },
    )
  }

  return { load, save }
}
