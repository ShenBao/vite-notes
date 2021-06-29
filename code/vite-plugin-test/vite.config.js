import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

import testPlugin from "./plugins/test-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // testPlugin
    testPlugin(),
    // reactRefresh
    reactRefresh(),
  ],
});
