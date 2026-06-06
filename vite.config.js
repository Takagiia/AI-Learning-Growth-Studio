import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import viteCompression from 'vite-plugin-compression'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    viteMockServe({
      mockPath: 'src/mock',
      enable: command === 'serve',
      watchFiles: true,
      logger: true,
    }),
    // 构建时生成 .gz / .br 压缩文件，配合部署服务器直接返回预压缩资源
    viteCompression({ algorithm: 'gzip', ext: '.gz', threshold: 1024, deleteOriginFile: false }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024, deleteOriginFile: false }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;\n@use "@/styles/mixins.scss" as *;\n`,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/echarts')) return 'echarts'
          if (id.includes('node_modules/element-plus')) return 'element-plus'
          if (id.includes('node_modules/vue') || id.includes('node_modules/@vue')) return 'vue-vendor'
        },
      },
    },
  },
}))
