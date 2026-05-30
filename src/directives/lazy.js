/**
 * 自定义指令 v-lazy（考核点：自定义指令 + IntersectionObserver）
 *
 * 用法：<img v-lazy src="..." alt="..." />
 * 当图片进入视口时才开始加载，加载完成后渐显
 */
let observer = null

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const img = entry.target
          // 将 data-src 赋值给 src 触发真实加载
          const realSrc = img.getAttribute('data-src')
          if (realSrc) {
            img.src = realSrc
            img.removeAttribute('data-src')
          }
          observer.unobserve(img)
        })
      },
      { rootMargin: '100px' },
    )
  }
  return observer
}

const vLazy = {
  mounted(el, binding) {
    // 暂存真实 src 到 data-src，清空 src 避免立即加载
    const src = binding.value || el.getAttribute('src')
    if (src) {
      el.setAttribute('data-src', src)
      el.removeAttribute('src')
    }
    // 添加渐显样式
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.4s ease'
    getObserver().observe(el)
    // 加载完成回调
    el.addEventListener('load', () => {
      el.style.opacity = '1'
    })
    el.addEventListener('error', () => {
      el.style.opacity = '1'
    })
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}

export default vLazy
