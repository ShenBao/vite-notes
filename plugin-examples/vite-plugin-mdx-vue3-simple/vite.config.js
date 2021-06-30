import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import vueMdx from './plugins/vite-mdx';

export default defineConfig ({
  plugins: [vueMdx (), vue (), vueJsx ({include: /\.(jsx|tsx|mdx)/})],
});
