import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";

import viteMdx, { Framework } from "vite-plugin-mdx-pro";

export default defineConfig({
  plugins: [
    viteMdx({
      framework: Framework.React,
    }),
    reactRefresh({
      include: /\.(mdx|jsx|tsx)/,
    }),
  ],
});
