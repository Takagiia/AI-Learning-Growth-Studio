/**
 * ESLint 基础配置（考核点：代码规范 ESLint）
 * 使用 ESLint 9.x flat config 格式
 */
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        console: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        import: 'readonly',
        // Vite env
        'import.meta': 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'no-undef': 'error',
    },
  },
  {
    // 忽略 node_modules 和 dist
    ignores: ['node_modules/', 'dist/'],
  },
]
