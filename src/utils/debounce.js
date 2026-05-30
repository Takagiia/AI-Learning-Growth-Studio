/** 防抖函数（用于搜索等场景） */
export function debounce(fn, delay = 300) {
  let timer = null
  return function debounced(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
