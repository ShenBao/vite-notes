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

const reactDefaultRenderer = `
import React from 'react'
import {mdx} from '@mdx-js/react'
`;

const reactDefaultPragma = `
/* @jsxRuntime classic */
/* @jsx mdx */
/* @jsxFrag mdx.Fragment */
`;

export default (options: Options = {}): Plugin => {
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
      const {
        include = /\.mdx/,
        exclude,
        renderer: optionRenderer,
        pragma: optionPragma,
      } = options;

      const renderer = optionRenderer || reactDefaultRenderer;
      const pragma = optionPragma || reactDefaultPragma;

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
