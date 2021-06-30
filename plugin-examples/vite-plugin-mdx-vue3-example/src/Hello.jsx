import {defineComponent} from 'vue';

export default defineComponent ({
  name: 'Hello',
  setup () {
    return () => (
      <div>
        <p>
          Component Hello.jsx
        </p>
      </div>
    );
  },
});
