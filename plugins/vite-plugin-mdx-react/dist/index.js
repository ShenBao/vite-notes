"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mdx_1 = require("@mdx-js/mdx");
const pluginutils_1 = require("@rollup/pluginutils");
const reactDefaultRenderer = `
import React from 'react'
import {mdx} from '@mdx-js/react'
`;
const reactDefaultPragma = `
/* @jsxRuntime classic */
/* @jsx mdx */
/* @jsxFrag mdx.Fragment */
`;
exports.default = (options = {}) => {
    return {
        name: "vite-mdx-react",
        enforce: "pre",
        config() {
            return {
                esbuild: {
                    include: /\.(jsx|tsx|mdx)/,
                    loader: "jsx",
                },
            };
        },
        transform(code, id) {
            const { include = /\.mdx/, exclude, renderer: optionRenderer, pragma: optionPragma, } = options;
            const renderer = optionRenderer || reactDefaultRenderer;
            const pragma = optionPragma || reactDefaultPragma;
            const filter = pluginutils_1.createFilter(include, exclude);
            if (!filter(id))
                return;
            const compiler = mdx_1.createCompiler();
            const result = compiler.processSync(code);
            return {
                code: `${renderer}${pragma}${result.contents}`,
            };
        },
    };
};
//# sourceMappingURL=index.js.map