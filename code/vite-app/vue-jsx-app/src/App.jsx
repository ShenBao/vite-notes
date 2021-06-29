import { defineComponent } from "vue";

import logo from "./assets/logo.png";

export default defineComponent({
  setup() {
    return () => {
      return (
        <div>
          <h3>Hello Vue3 App</h3>
          <img alt="Vue logo" src={logo} />
        </div>
      );
    };
  },
});
