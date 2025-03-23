# Vite 配置技巧

- https://cn.vitejs.dev/

如官网所说，Vite 是一种新型前端构建工具，能够显著提升前端开发体验，它主要由两部分组成：

- 一个开发服务器，它基于 原生 ES 模块 提供了 丰富的内建功能，如速度快到惊人的 模块热替换（HMR）。
- 一套构建指令，它使用 Rollup 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

## vite 配置别名

首先安装为 Node.js 提供类型定义的包，也是解决 "找不到模块 path 或其相对应的类型声明" 问题

```bash
pnpm add @types/node --save-dev
```

在 vite.config.ts 中配置 resolve.alias ，使用 @ 符号代表 src

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

```

也可以是这样的：

```js
import { defineConfig } from 'vite'
import type { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {

  const root: string = process.cwd(); //获取当前工作目录的路径
  const pathResolve = (dir: string): string => {
    return resolve(root, ".", dir);
  };
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": pathResolve("src"),
      },
    },
  };
};
```

如果使用了 TypeScript 的话，需要在 tsconfig.json 中配置：

```json
{
  "compilerOptions": {
    "baseUrl": ".", //使用相对路径，当前根目录
    "paths": {
      "@/*": ["src/*"],
    }
  }
}
```

## 省略拓展名列表

不建议忽略自定义导入类型的扩展名 .vue ，会影响 IDE 和类型支持

```js
import { defineConfig } from "vite";
export default defineConfig({
  resolve: {
    //导入文件时省略的扩展名列表
    extensions: [
      ".mjs",
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".json",
    ],
  },
});

```

## vite 插件

在 plugins 中可以添加你的插件，它是一个数组

一些插件：

- @vitejs/plugin-vue-jsx JSX、TSX 语法支持
- vite-plugin-mock Mock 支持
- vite-plugin-svg-icons svg 图标
- unplugin-auto-import/vite 按需自动导入
- unplugin-vue-components/vite 按需组件自动导入
- unocss/vite 原子化 css
- ...

- 官方插件：https://cn.vitejs.dev/plugins/
- 社区插件：https://github.com/vitejs/awesome-vite#plugins

### gzip 压缩打包

安装 vite-plugin-compression

```bash
pnpm add vite-plugin-compression -D
```

```js
//vite.config.ts
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    vue(),
    //默认压缩gzip，生产.gz文件
    viteCompression({
      deleteOriginFile: false, //压缩后是否删除源文件
    }),
  ],
});
```

一般来说，真正想使用 gzip 压缩来优化项目，还需要在 nginx 中开启 gzip 并进行相关配置，这一步交给后端来处理。请自行百度

### 打包分析可视化

安装 rollup-plugin-visualizer

```bash
pnpm add rollup-plugin-visualizer -D
```

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true, //build后，是否自动打开分析页面，默认false
      gzipSize: true, //是否分析gzip大小
      brotliSize: true, //是否分析brotli大小
      //filename: 'stats.html'//分析文件命名
    }),
  ],
});
```

使用命令 pnpm build 后，分析图 html 文件会在根目录下生成，默认命名为 stats.html

把分析文件加入 .gitignore ，不提交到 git 仓库中

### 集成按需引入配置

首先，需要先引入 unplugin-vue-components 和 unplugin-auto-import

```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

这里以 ElementPlus 组件库为例子，在 vite.config.ts 中配置如下：

请先确保你已安装了 ElementPlus 组件库, ant-design-vue 组件库同理.

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import {
  AntDesignVueResolver,
  ElementPlusResolver,
} from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        //AntDesignVueResolver({ importStyle: "less" }),
        ElementPlusResolver({ importStyle: "sass" }),
      ],
      dts: "src/typings/components.d.ts", //自定义生成 components.d.ts 路径
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        //一些全局注册的hook等，无需局部引入
        {
          // "@/hooks/useMessage": ["useMessage"],
        },
      ], 
      resolvers: [ElementPlusResolver()], //AntDesignVueResolver()
      dts: "src/typings/auto-imports.d.ts", //自定义生成 auto-imports.d.ts 路径
    }),
  ],
});
```

AntDesignVue 组件库同理设置

通过以上配置：

- unplugin-vue-components 会在 src/typings 文件夹下生成 components.d.ts 类型文件
- unplugin-auto-import 会在 src/typings 文件夹下生成 auto-imports.d.ts 类型文件

unplugin-vue-components 插件会自动引入 UI 组件及 src 文件夹下的 components 组件，规则是 src/components/*.{vue}

请确保你的项目中拥有 src/typings 文件夹，或者更改上述配置项的 dts 路径

## TS 类型

使用按需引入的话，不要忘了在 tsconfig.json 中引入组件库的类型声明文件

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "types": ["node", "vite/client", "element-plus/global"]
  }
}
```

如果你使用的是 AntDesignVue 组件库，将 "element-plus/global" 替换成 "ant-design-vue/typings/global" 即可

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "types": ["node", "vite/client", "ant-design-vue/typings/global"]
  }
}
```

## 环境变量

### 基础配置

环境变量。顾名思义，在不同环境下呈现不同的变量值

Vite 在一个特殊的  import.meta.env  对象上暴露环境变量，这些变量在构建时会被静态地替换掉。这里有一些在所有情况下都可以使用的内建变量：

- import.meta.env.MODE: {string} 应用运行的模式。
- import.meta.env.BASE_URL: {string} 部署应用时的基本 URL。他由base  配置项决定。
- import.meta.env.PROD: {boolean} 应用是否运行在生产环境（使用  NODE_ENV='production'  运行开发服务器或构建应用时使用  NODE_ENV='production' ）。
- import.meta.env.DEV: {boolean} 应用是否运行在开发环境 (永远与  import.meta.env.PROD相反)。
- import.meta.env.SSR: {boolean} 应用是否运行在  server  上。

也可以打印 import.meta.env 对象查看拥有的属性

- BASE_URL：应用程序的基本 URL 路径，默认为 /
- DEV：当前是否处于开发模式，在生产环境，这个值为 false
- MODE：当前的运行模式，development 表示开发模式，生产环境，是 production
- prod：与 DEV 相反，表示是否处于生产模式，在生产环境，这个值是 true
- SSR：当前是否运行在服务器端渲染环境，如果使用 SSR，服务器端运行时这个值是 true

### 配置文件

在 Vite 中，只有以 VITE_ 为前缀的变量才会交给 Vite 来处理，比如

```
VITE_KEY = 123;
```

如果要改前缀的话，在 vite.config.ts 中设置 envPrefix ，它可以是一个字符串或者字符串数组

定义环境变量，首先先创建几个环境变量存放的文件，一般是放在根目录下：

Vite 也提供了 envDir 用来自定义环境文件存放目录

- 新建 .env 文件，表示通用的环境变量，优先级较低，会被其他环境文件覆盖
- 新建 .env.development 文件，表示开发环境下的环境变量
- 新建 .env.production 文件，表示生产环境下的环境变量

需要的话，你可以加入更多的环境，比如 预发布环境 .env.staging (它的配置一般与生产环境无异，只是 url 变化) 和 测试环境 .env.testing

.env 文件：
```txt
# 网站标题
VITE_GLOB_APP_TITLE = clean Admin

# 在本地打开时的端口号
VITE_PROT = 8888
```

.env.development 文件：
```txt
# 本地环境

# API 请求URL
VITE_API_URL = ""
```

.env.production 文件：
```
# 生产环境

# API 请求URL
VITE_API_URL = ""
```

在默认情况下，运行的脚本 dev 命令(pnpm dev)是会加载 .env.developmen 中的环境变量
而脚本 build 命令是加载 .env.production 中的环境变量

最常见的业务场景就是，前端与后端的接口联调，本地开发环境与线上环境用的接口地址不同，这时只需要定义不同环境文件的相同变量即可.

也可以通过在 package.json 中改写脚本命令来自定义加载你想要的环境文件，关键词是 --mode

```json
//package.json
{
    "scripts": {
    "dev": "vite --mode production"
    "build": "vue-tsc -b && vite build",
    "build:dev": "vue-tsc -b && vite build --mode development",
  },
}
```

## TS 智能提示

如果项目中用上了 TS，那么可以为环境变量提供智能提示

在 src/typings 目录下新建一个 env.d.ts，写入以下内容

```js
//环境变量-类型提示
interface ImportMetaEnv {
   /** 全局标题 */
   readonly VITE_APP_TITLE: string;
   /** 本地开发-端口号 */
   readonly VITE_DEV_PORT: number;
   //加入更多环境变量...
  }
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}
```

即可得到类型提示，鼠标停留在变量上也会显示注释

记得在 tsconfig 文件中配置 include 引入类型声明文件，typings 代表你的类型文件目录名称

```js
{
  // "compilerOptions": {},
  "include": ["typings/**/*.d.ts","typings/**/*.ts"]
}
```

### .env 文件折叠(可选)

在根目录下新建一个 .vscode 文件夹，在此文件夹中新增 settings.json 文件，写入以下配置：

```js
{
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.expand": false,
  "explorer.fileNesting.patterns": {
    "*.env": ".env.*"
  }
}
```

- explorer.fileNesting.enabled 是否开启文件嵌套，默认 false
- explorer.fileNesting.expand 是否默认展开
- explorer.fileNesting.patterns 文件嵌套规则

## 在 vite.config.ts 中使用环境变量

```js
import { loadEnv } from "vite";
import type { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default ({ mode }: ConfigEnv): UserConfig => {
  const root: string = process.cwd();
  const env = loadEnv(mode, root);
  console.log(env);
  return {
    plugins: [vue()],
  };
};
```

这里重点关注 const env = loadEnv(mode, root)

loadEnv 函数是用来加载 envDir 中的 .env 文件(一般是放在根目录下)，

loadEnv 接受三个参数：

- mode：当前环境模式，开发环境、生产环境等
- envDir：env 文件目录地址
- prefixes：环境变量前缀，默认是VITE_

并且返回一个对象，键值对都是字符串类型，TS类型是 Record<string, string>

通过 console.log(env) 把这个 env 变量打印在终端查看输出，这个对象是这样的：

记得启动项目 pnpm dev，或者在项目运行情况下重新保存 vite.config.ts 文件

在这个对象里，值全部是字符串类型，有时我们需要通过环境变量来控制 Vite 中的配置项，比如 server.port​ 需要一个 number 类型的值而不是一个 string，针对这种情况，我们可以写个工具函数，来将值统一调整回该有的类型，先定义一个 processEnv 函数：

核心思路就是将对象的 value 转换类型

```js
/**
 * 处理环境变量的值类型
 * @param env 环境变量对象
 * @returns 返回一个类型正确的环境变量
 */
const processEnv = (env: RecordType<string>): ImportMetaEnv => {
  const metaEnv: any = {};
  for (const key in env) {
    const wrapValue = env[key].trim().replace(/\\n/g, '\n');
    metaEnv[key] = env[key];

    if (wrapValue === 'true' || wrapValue === 'false') metaEnv[key] = wrapValue === 'true';
    if (!isNaN(Number(wrapValue)) && wrapValue !== '') metaEnv[key] = Number(wrapValue);
  }
  return metaEnv;
};
```

那么，刚刚的配置项我们可以写成这样：

```js
import { loadEnv } from "vite";
import type { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { processEnv } from './build/utils';

export default ({ mode }: ConfigEnv): UserConfig => {
  const root: string = process.cwd();
  const env = processEnv(loadEnv(mode, root));
  const { VITE_DEV_PORT } = env;
  return {
    plugins: [vue()],
    server: {
      port: VITE_DEV_PORT, // 端口号
    },
  };
};
```

注意，我这里将 processEnv 函数放在 build/utils 里，你可以自由调整路径

上述中的 processEnv 方法是进一步封装的方案，如果你不想折腾太多，那么这样做也是可以：

```js
    server: {
	  // 假设你有一个 VITE_BROWSER_OPEN 环境变量
      open: VITE_BROWSER_OPEN === "true", // 项目启动时是否自动在浏览器中打开应用程序
    },
```

## CSS 配置

在有些情况下，我们需要让 css 变量可以在全局的样式中通用，

比如在文件夹 styles/variables.less 存在着一些变量：

```css
@while: #fff;
@menu-bg-color: #001529;
@@header-height: 64px;
```

在 main.ts 中引入这个 variables.less 文件，是无效的，会报 [less] variable @变量名 is undefined 即变量未定义问题

Vite 提供了一个 css.preprocessorOptions 选项，用来指定传递给 CSS 预处理器选项：css-preprocessoroptions

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      //less: {
	  //  additionalData: '@import "@/styles/variable.less";',
      //  javascriptEnabled: true,
      //},
      scss: {
	    api: 'modern-compiler',
        additionalData: `@use "@/styles/variables.scss" as *;`,
        javascriptEnabled: true
      },
    },
  },
});
```

## 依赖预构建配置

### 什么是预构建

在 Vite 中，依赖预构建是指将第三方依赖预先编译和优化，以便在开发过程中更快地构建和加载这些依赖。这种预构建的方式有助于减少开发服务器在启动和重新加载时的延迟，并且可以利用现代浏览器的 ES 模块支持来更高效地加载模块.

这种方式带来几个显著的优势：

- 更快的开发启动时间
- 更快的热更新
- 现代浏览器的 ES 模块支持

### 预构建的目的

1. CommonJS 和 UMD 兼容性:  在开发阶段中，Vite 的开发服务器将所有代码视为原生 ES 模块。因此，Vite 必须先将以 CommonJS 或 UMD 形式提供的依赖项转换为 ES 模块。通俗易懂就是要将非  ESM  规范的代码转换为符合  ESM  规范的代码
2. 性能：  为了提高后续页面的加载性能，Vite 将那些具有许多内部模块的 ESM 依赖项转换为单个模块。

默认情况下，预构建结果会保存到  node_modules  的  .vite  目录下。

### 自定义构建行为

有时候，Vite 的依赖预构建算法并不是那么准确理想的，比如一些动态的 import 导入，常常无法进行预构建，而是会触发二次预构建，严重拖慢程序速度

二次预构建完成后，会通知浏览器进行 reload ，即重新加载页面，这样频繁的刷新页面，对于我们的开发来说简直是不能忍受！

Vite 提供了 optimizeDeps 配置项允许我们自定义预构建的配置，依赖优化选项

在这里，我们着重关注两个属性：

- optimizeDeps.include：强制预构建链接的包
- optimizeDeps.exclude ：在预构建中强制排除的依赖项

```js
import type { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default ({ mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [vue()],
    optimizeDeps: {
      include: [
        "qs",
        "echarts",
        "@vueuse/core",
        "nprogress",
        "lodash-es",
        "dayjs",
      ],
      exclude: [],
    },
  };
};
```

### 注意点

Vite 将预构建的依赖项缓存到  node_modules/.vite  中，如果你想强制重建预构建缓存：

- 在 package.json 的 scripts 中脚本命令指定 --force
- 删除 node_modules 目录下的 .vite 缓存文件夹

### 了解更多？

- https://juejin.cn/post/7128212841064038414?searchId=20240704155624C50214123832C4A9E115
- https://juejin.cn/post/7129160452377935903
- https://juejin.cn/post/7064853960636989454

## 打包配置

生产环境去除 console.log、debugger(esbuild 模式)

```js
//vite.config.ts
import type { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default ({ mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [vue()],

    esbuild: {
      drop: ["debugger"],
      pure: ["console.log"],
    },
  };
};
```

## 分包策略

### 什么是分包策略

分包策略，就是根据不同的规则和逻辑来分割成大大小小的包，把一些固定，常规不更新的文件，进行分割切包处理

### 分包的作用

分包是一种优化程序加载速度，性能的策略和操作

试想一下，你有一个安装了多个依赖包的项目，当你进行打包时，这些代码都打包成了一个 js 文件，当你修改了其中的一些文件时要重新打包上线，浏览器会重新加载你的这个 js 文件，可是，你只修改了项目其中一部分，却要把整个文件都重新加载一边，是否合理呢？特别是当项目越来越大时，你就会发现页面的加载速度越来越慢

所以，分包策略的作用在于：

- 减少代码体积和加载时间: 当你的项目包含多个模块或者依赖项时，将它们分割成多个包可以减少单个包的体积。并且只重新加载修改的文件，减少加载时间
- 提高缓存利用率:处理部分包而不是全部，分包可以提高浏览器的缓存命中率，从而减少不必要的网络请求，加快页面加载速度
- 优化资源结构: 对于大型项目或者复杂的应用程序，通过合理划分功能模块和依赖项，有利于管理项目的整理结构和维护

### 分包策略的建议

分包策略根据项目不同，会呈现出不同的策略，这里提供一些通用的思路

- 按功能或模块分包
- 按页面或路由分包
- 按第三方依赖分包
- 公共代码分包
- 按环境分包

项目体量越大，分包效果越明显

### 在 Vite 中的示例分包

这一部分会需要一定的前端工程化及性能优化知识，参阅 Rollup

在 Vite.config.ts 中的简单分包：

```js
//vite.config.ts
import type { UserConfig, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default ({ mode }: ConfigEnv): UserConfig => {
  /**颗粒度更细的分包 */
  const manualChunks = (id: string) => {
    if (id.includes('node_modules')) {
      if (id.includes('lodash-es')) {
        return 'lodash-vendor';
      }
      if (id.includes('element-plus')) {
        return 'el-vendor';
      }
      if (id.includes('@vue') || id.includes('vue')) {
        return 'vue-vendor';
      }
      return 'vendor';
    }
  };

  return {
    plugins: [vue()],
    build: {
      chunkSizeWarningLimit: 1500, //超出 chunk 大小警告阈值，默认500kb
      //Rollup 打包配置
      rollupOptions: {
        output: {
          entryFileNames: "assets/js/[name]-[hash:8].js", //入口文件名称
          chunkFileNames: "assets/js/[name]-[hash:8].js", //引入文件名名称
          assetFileNames: "assets/[ext]/[name]-[hash:8][extname]", //静态资源名称
          manualChunks,
        },
      },
    },
  };
};
```

id：依赖项详细信息

一般来说，node_modules 中的第三方依赖项是不会去更改其源码的，我们只是使用而非修改，所以，可以通过配置 manualChunks 来将其分出去

这样的分包颗粒度还是比较粗的，且 manualChunks 逻辑简单粗暴，可能存在循环依赖的隐患，这里推荐一个 Vite 插件 vite-plugin-chunk-split

- [参考文章：Vite 代码分割与拆包](https://blog.csdn.net/Tyro_java/article/details/140050644)

## 链接

- Vite 配置篇：日常开发掌握这些配置就够了！：https://juejin.cn/post/7170843707217412126
- https://github.com/staven630/vite-config
- Vite 配置 - 选项：https://juejin.cn/post/7241057752070799416
