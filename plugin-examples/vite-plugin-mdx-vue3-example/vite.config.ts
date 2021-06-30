import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

import viteMdx from 'vite-plugin-mdx-vue3'

export default defineConfig({
  plugins: [
    viteMdx(),
    vueJsx({ include: /\.(jsx|tsx|mdx)/ })
  ]
})
