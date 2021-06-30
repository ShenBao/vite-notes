"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mdx_1 = require("@mdx-js/mdx");
const pluginutils_1 = require("@rollup/pluginutils");
const vue3DefaultRenderer = `
import {mdx} from 'mdx-vue3'
`;
const vue3DefaultPragma = `
/* @jsx mdx */
`;
exports.default = (options = {}) => {
    return {
        name: "vite-mdx-vue3",
        config() {
            return {};
        },
        transform(code, id) {
            const { include = /\.mdx/, exclude, renderer: optionRenderer, pragma: optionPragma, } = options;
            const renderer = optionRenderer || vue3DefaultRenderer;
            const pragma = optionPragma || vue3DefaultPragma;
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