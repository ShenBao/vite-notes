import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

import viteMdx from 'vite-plugin-mdx-pro'

export default defineConfig({
  plugins: [
    viteMdx(),
    vueJsx({ include: /\.(jsx|tsx|mdx)/ })
  ]
})
