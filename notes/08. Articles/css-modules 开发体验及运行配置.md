# css-modules 开发体验及运行配置

## 介绍

typescript-plugin-css-modules 的能力范围：这个插件的设计目标是 在 TypeScript/JavaScript 代码中导入 CSS/SCSS Modules 时，提供类型提示和自动补全。

VS Code 扩展：
- CSS Modules
- vscode-scss

## 核心原理

- typescript-plugin-css-modules → 只影响 IDE/TS Server 的类型推断和补全（不生成真实对象）
- vite.config.ts 里的 localsConvention → 影响构建后 JS 模块导出的 key（真实运行时样式对象）

如果这两处不一致，就会出现「能补全但样式不生效」或「样式有但提示不到」的问题。


## 对比

| `typescript-plugin-css-modules` `options` | Vite `css.modules.localsConvention` | 运行时 JS 对象里有哪些 key？ | 能否用 `styles.myClassName` 调用 `.my-class-name` 样式 |
|----------------------------------------|--------------------------------------|-------------------------------|--------------------------------------------------|
| `"asIs"`（默认之一）                   | `"asIs"`（默认）                     | `{'my-class-name': 'hash'}`   | ❌（只能 `styles['my-class-name']`）              |
| `"asIs"`                               | `"camelCase"`                        | `{'my-class-name': 'hash', myClassName: 'hash'}` | ✅（也可以 `styles.myClassName`）          |
| `"camelCase"`（保留原名 + camelCase 别名） | `"asIs"`                             | `{'my-class-name': 'hash'}`   | ❌（提示可以，但运行时没有 `myClassName`）       |
| `"camelCase"`                          | `"camelCase"`                        | `{'my-class-name': 'hash', myClassName: 'hash'}` | ✅（推荐配置）                        |
| `"camelCaseOnly"`（只 camelCase）     | `"camelCaseOnly"`                    | `{myClassName: 'hash'}`       | ✅（推荐配置）                        |
| `"camelCaseOnly"`                     | `"asIs"`                             | `{'my-class-name': 'hash'}`   | ❌（提示有 `myClassName`，运行时没 key）         |
| `"dashes"`（保留原名 + 把 `-` 转为 camelCase） | `"dashes"`                         | 同上规则一致                  | ✅（仅带 `-` 的类会有 camelCase 别名）           |
| `"dashesOnly"`（只保留带 `-` 转成的 camelCase 名字） | `"dashesOnly"`               | 同上规则一致                  | ✅（仅带 `-` 的类会有 camelCase 名）             |


## 最佳实践

1. 保留 typescript-plugin-css-modules 负责类型提示
2. 安装 VS Code 插件 CSS Modules：
    - 在 VS Code 扩展商店搜 CSS Modules（作者：clinyong）
    - 激活后，Cmd+Click/F12 在 styles.container 上就会跳到 .module.scss 文件的相应行
3. 如果还想在 CI 有检查 → 同时配合 typed-scss-modules 生成 .d.ts

## 推荐组合

最常用且不容易错的组合：

### 方案 1：支持两种写法（原名 + camelCase）

tsconfig.json：

```js
{
  "compilerOptions": {
    // ⭐ 这里启用插件
    "plugins": [
      {
        "name": "typescript-plugin-css-modules",
        "options": {
          "customMatcher": "\\.(c|sa|sc)ss$",
          "camelCase": true
        }
      }
    ]
  }
}
```

vite.config.ts：

```js
css: { modules: { localsConvention: 'camelCase' } }
```

✅ 优点：老样式文件（my-class-name）和新版 camelCase 都能用

### 方案 2：团队强制 camelCase

tsconfig.json：

```js
{
  "compilerOptions": {
    "plugins": [
      { "name": "typescript-plugin-css-modules", "options": { "camelCaseOnly": true } }
    ]
  }
}
```

vite.config.ts：

```js
css: { modules: { localsConvention: 'camelCaseOnly' } }
```

✅ 优点：统一命名风格，属性访问没有引号，IDE 和运行时完全一致


**注意：**
- 如果 typescript-plugin-css-modules 和 localsConvention 不匹配，就会出现“有提示没样式”或“有样式没提示”的问题。
- 一定要同时改动这两个地方。
- localsConvention 是构建运行规则，必须改 Vite 配置，而不是只改类型提示插件。


## 链接

- [typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules)
  - npm: https://www.npmjs.com/package/typescript-plugin-css-modules
- [typed-scss-modules](https://github.com/skovy/typed-scss-modules)
  - npm: https://www.npmjs.com/package/typed-scss-modules
