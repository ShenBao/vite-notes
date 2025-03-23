import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
    },
    modules: {
      // camelCase 支持驼峰和原名两种写法
      // 'camelCaseOnly' 表示只生成驼峰写法
      localsConvention: "camelCase",

      // generateScopedName: "[name]__[local]___[hash:base64:5]",
      generateScopedName: "[name]__[local]", // local 会包含 _L12
    },
  },
});
