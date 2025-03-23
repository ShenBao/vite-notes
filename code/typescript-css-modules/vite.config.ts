import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// 转义类名防正则冲突
const escapeName = (name: string) =>
  name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      scopeBehaviour: "local",

      // camelCase 支持驼峰和原名两种写法
      // 'camelCaseOnly' 表示只生成驼峰写法
      localsConvention: "camelCase",

      // hashPrefix: '__hashPrefix__',

      // hashPrefix: "my-app-v1",
      // generateScopedName: "_react-scss--[name]__[local]___[hash:base64:5]",

      // generateScopedName: "[name]__[local]___[hash:base64:5]",
      // generateScopedName: "[name]__[local]", // local 会包含 _L12

      // generateScopedName:
      //   process.env.NODE_ENV === "production"
      //     ? "[hash:base64:8]"
      //     : "[name]__[local]",

      exportGlobals: true,

      generateScopedName:
        process.env.NODE_ENV !== "production"
          ? "app_[hash:base64:10]"
          : (name, filename /* , css */) => {
              const safeName = escapeName(name);

              // 读取源 SCSS
              const sourceLines = fs.readFileSync(filename, "utf8").split("\n");

              // 匹配 .类名 或 &.类名（嵌套）
              const regex = new RegExp(
                `(\\.${safeName}|&\\.${safeName})(\\s|\\{|\\.|:)`
              );

              const lineNumber =
                sourceLines.findIndex((line) => regex.test(line)) + 1;

              const fileBase = path.basename(filename, path.extname(filename));
              const linePart = lineNumber > 0 ? `L${lineNumber}` : "L?";

              return `app_${fileBase}__${name}__${linePart}`;
            },
    },
  },
});
