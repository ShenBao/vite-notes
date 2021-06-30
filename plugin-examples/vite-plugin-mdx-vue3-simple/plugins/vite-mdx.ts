import { createCompiler } from "@mdx-js/mdx";
import { createFilter } from "@rollup/pluginutils";

import type { Plugin } from "vite";
import type { FilterPattern } from "@rollup/pluginutils";

interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
}

export default (options: Options = {}): Plugin => {
  return {
    name: "vite-mdx",

    transform(code, id, ssr) {
      const { include = /\.mdx/, exclude } = options;

      const filter = createFilter(include, exclude);
      if (!filter(id)) return;

      const compiler = createCompiler();

      const result = compiler.processSync(code);

      return {
        code: result.contents,
      };
    },
  };
};
