const mdx = require("@mdx-js/mdx");

const mdStr = `# Hello MDX`;

console.log(mdx.sync(mdStr));
