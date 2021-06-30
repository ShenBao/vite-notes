import type { Plugin } from "vite";
import type { FilterPattern } from "@rollup/pluginutils";
interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern;
    renderer?: string;
    pragma?: string;
}
declare const _default: (options?: Options) => Plugin;
export default _default;
