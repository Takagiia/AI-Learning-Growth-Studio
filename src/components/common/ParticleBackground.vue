<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  /** 粒子数量 */
  count: { type: Number, default: 60 },
  /** 粒子颜色 */
  color: { type: String, default: '59, 130, 246' },
  /** 是否启用连线 */
  linkLines: { type: Boolean, default: true },
  /** 透明度 0-1 */
  opacity: { type: Number, default: 0.6 },
})

const canvasRef = ref(null)
let animationId = null
let particles = []
let width = 0
let height = 0

function initParticles() {
  particles = Array.from({ length: props.count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    r: Math.random() * 2 + 1,
  }))
}

function draw(ctx) {
  ctx.clearRect(0, 0, width, height)

  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0 || p.x > width) p.vx *= -1
    if (p.y < 0 || p.y > height) p.vy *= -1

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${props.color}, ${props.opacity})`
    ctx.fill()
  }

  if (props.linkLines) {
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i]
        const b = particles[j]
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(${props.color}, ${0.15 * (1 - dist / 120)})`
          ctx.stroke()
        }
      }
    }
  }

  animationId = requestAnimationFrame(() => draw(ctx))
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = canvas.parentElement
  width = parent?.clientWidth || window.innerWidth
  height = parent?.clientHeight || window.innerHeight
  canvas.width = width
  canvas.height = height
  initParticles()
}

function start() {
  const canvas = canvasRef.value
  if (!canvas) return
  resize()
  const ctx = canvas.getContext('2d')
  if (animationId) cancelAnimationFrame(animationId)
  draw(ctx)
}

function stop() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

onMounted(() => {
  start()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  stop()
  window.removeEventListener('resize', resize)
})

watch(
  () => props.count,
  () => {
    initParticles()
  },
)
</script>

<template>
  <canvas ref="canvasRef" class="particle-bg" aria-hidden="true" />
</template>

<style scoped>
.particle-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
