const mdx = require("@mdx-js/mdx");

const mdStr = `
# Hello MDX

import Button from "button";

> will this

- first
- second

<Button>This is Button </Button>

export const a = 1;
`;

console.log(mdx.sync(mdStr));
