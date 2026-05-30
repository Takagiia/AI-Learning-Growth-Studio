/** localStorage 读写封装 */

export function getStorage(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return defaultValue
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('[storage] 写入失败:', error)
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('[storage] 删除失败:', error)
  }
}
