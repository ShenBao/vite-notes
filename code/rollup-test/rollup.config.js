// export default {
//     input: "index.js",
//     output: {
//         file: "dist.js",
//         format: "umd",
//         name: "Index",
//     }
// }

import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

const plugins = [resolve(), commonjs(), json()];

const banner = `
/**
 * Hello, This isBanner！
 */
`;

export default [
    {
        input: "index.js",
        output: {
            file: "dist/index.umd.js",
            format: "umd",
            name: "Index",
            banner,
        },
        plugins,
    },
    {
        input: "index.js",
        output: {
            file: "dist/index.es.js",
            format: "es",
        },
        plugins,
    },
];
