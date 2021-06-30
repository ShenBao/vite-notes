import {defineComponent} from 'vue';

import Demo from './Demo.mdx';

export default defineComponent ({
  name: 'App',
  setup () {
    return () => (
      <div>
        <p>
          Edit <code>App.jsx</code> and save to test HMR updates.
        </p>
        <Demo />
      </div>
    );
  },
});
