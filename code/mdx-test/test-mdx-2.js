const { createCompiler } = require("@mdx-js/mdx");

const mdx = createCompiler();

const mdStr = `
# Hello MDX

import Button from "button";

> will this

- first
- second

<Button>This is Button </Button>

export const a = 1;
`;

console.log(mdx.processSync(mdStr).contents);

