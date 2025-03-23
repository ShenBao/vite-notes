import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import license from "rollup-plugin-license";
// import { terser } from 'vite-plugin-terser';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vite.dev/config/
export default defineConfig({
  build: {
    // minify: 'esbuild',
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,  // 可选：移除 console.log
        drop_debugger: true, // 可选：移除 debugger
        pure_funcs: ['console.log'], // 更彻底移除
      },
      format: {
        comments: false, // 移除注释（包括 license 注释）
      },
    },
    sourcemap: false,
    rollupOptions: {
      output: {
        // 自定义 chunk 文件名
        chunkFileNames: "assets/js/chunks/[name]-[hash].js",
        // 你也可以同时配置其他文件名
        entryFileNames: "assets/[name]-[hash].js", // 入口文件
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]", // 静态资源 (css, img等)
        // assetFileNames: (chunkInfo) => {
        //   console.log('chunkInfo:', chunkInfo);
        //   return 'assets/[ext]/[name]-[hash].[ext]';
        // },
      },
    },
  },
  // esbuild: {
  //   // 关键配置：将 license 注释提取到外部文件
  //   // legalComments: 'external',
  // },
  plugins: [
    react(),
    license({
      thirdParty: {
        output: 'dist/licenses.txt',
      },
    }),
    createHtmlPlugin({
      minify: true, // 启用压缩
    }),
    // terser({
    //   compress: {
    //     drop_console: true, // 可选：移除 console
    //     drop_debugger: true,
    //   },
    //   format: {
    //     comments: false, // 移除注释
    //     // 确保不插入换行
    //     beautifier: false,
    //     keep_quoted_props: true,
    //   },
    // }),
//     license({
//       // 输出许可证信息到 dist/LICENSE.txt
//       banner: {
//         content: `Third-party licenses
// This software uses open-source libraries distributed under various licenses.
// See third-party-licenses.txt for details.`,
//       },
//       // 将所有依赖的 license 写入此文件
//       thirdParty: {
//         output: "dist/licenses.txt",
//         // 可选：只包含生产依赖
//         includePrivate: false,
//         // 可选：自定义输出格式
//         // format: (content) => {
//         //   return content
//         //     .map(({ packageJson, license, licenseText }) => {
//         //       const name = packageJson.name || "Unknown";
//         //       const version = packageJson.version || "Unknown";
//         //       const lic = license || "UNLICENSED";
//         //       return `Package: ${name}@${version}\nLicense: ${lic}\n\n${licenseText}\n\n`;
//         //     })
//         //     .join("");
//         // },
//       },
//     }),
  ],
});
