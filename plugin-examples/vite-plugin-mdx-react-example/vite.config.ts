import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";

import viteMdx from "vite-plugin-mdx-react";

export default defineConfig({
  plugins: [
    viteMdx(),
    reactRefresh({
      include: /\.(mdx|jsx|tsx)/,
    }),
  ],
});
