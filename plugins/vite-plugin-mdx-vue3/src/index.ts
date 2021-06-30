import { createCompiler } from "@mdx-js/mdx";
import { createFilter } from "@rollup/pluginutils";

import type { Plugin } from "vite";
import type { FilterPattern } from "@rollup/pluginutils";

interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
  renderer?: string;
  pragma?: string;
}

const vue3DefaultRenderer = `
import {mdx} from 'mdx-vue3'
`;

const vue3DefaultPragma = `
/* @jsx mdx */
`;

export default (options: Options = {}): Plugin => {
  return {
    name: "vite-mdx-vue3",

    config() {
      return {};
    },

    transform(code, id) {
      const {
        include = /\.mdx/,
        exclude,
        renderer: optionRenderer,
        pragma: optionPragma,
      } = options;

      const renderer = optionRenderer || vue3DefaultRenderer;
      const pragma = optionPragma || vue3DefaultPragma;

      const filter = createFilter(include, exclude);

      if (!filter(id)) return;

      const compiler = createCompiler();

      const result = compiler.processSync(code);

      return {
        code: `${renderer}${pragma}${result.contents}`,
      };
    },
  };
};
