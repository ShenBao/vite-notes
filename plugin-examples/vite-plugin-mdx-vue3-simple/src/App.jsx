import { defineComponent } from 'vue'

import Demo from './Demo.mdx'

export default defineComponent({
  name: 'App',
  setup () {
    return () => (
      <div>
        <div>vue3 Jsx App.jsx in vite</div>
        <Demo />
      </div>
    )
  }
})
