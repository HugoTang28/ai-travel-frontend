import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default [
  // 忽略文件（原 .eslintignore）
  {
    ignores: ['node_modules/', 'dist/', '*.d.ts', 'public/', 'dist.zip']
  },
  // JS 基础推荐规则
  js.configs.recommended,
  // Vue3 推荐规则
  ...vue.configs['flat/recommended'],
  // Prettier 集成（关闭冲突规则 + 启用 prettier 报错）
  prettier,
  // 全局配置
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      // ============ Prettier 格式化 ============
      'prettier/prettier': 'error',

      // ============ JS 基础规则 ============
      'no-var': 'error',
      'prefer-const': 'error',
      // 'no-console': 'warn',
      'no-debugger': 'warn',
      eqeqeq: ['error', 'always'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-duplicate-imports': 'error',
      'no-useless-escape': 'warn',
      'no-multi-spaces': 'warn',
      'no-trailing-spaces': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 2 }],

      // ============ Vue 规则 ============
      'vue/multi-word-component-names': 'off',
      'vue/require-v-for-key': 'error',
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'warn',
      'vue/attributes-order': 'warn',
      'vue/v-bind-style': 'error',
      'vue/v-on-style': 'error',
      'vue/component-name-in-template-casing': [
        'warn',
        'PascalCase',
        { registeredComponentsOnly: false }
      ],
      'vue/no-template-key': 'error',
      'vue/no-textarea-mustache': 'error',
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off'
    }
  },
  // 针对特定文件的覆盖配置
  {
    files: ['*.config.js', 'eslint.config.js'],
    languageOptions: {
      globals: { ...globals.node }
    },
    rules: {
      'no-console': 'off'
    }
  },
  {
    files: ['src/main.js'],
    rules: {
      'no-console': 'off'
    }
  }
]
