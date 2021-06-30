"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMDXComponents = exports.MDXProvide = exports.contextKey = void 0;
const vue_1 = require("vue");
exports.contextKey = '__MDX_PROVIDE_KEY__';
exports.MDXProvide = vue_1.defineComponent({
    name: 'MDXProvide',
    props: {
        components: {
            type: Object,
            required: true
        }
    },
    setup(props, { slots }) {
        const componentsRef = vue_1.computed(() => props.components);
        vue_1.provide(exports.contextKey, componentsRef);
        return () => slots.default && slots.default();
    }
});
const defaultComponentsRef = vue_1.computed(() => ({}));
const useMDXComponents = (getPropsComponents) => {
    const providedComponentsRef = vue_1.inject(exports.contextKey, defaultComponentsRef);
    const mergedComponentsRef = vue_1.computed(() => ({
        ...providedComponentsRef.value,
        ...getPropsComponents()
    }));
    return mergedComponentsRef;
};
exports.useMDXComponents = useMDXComponents;
//# sourceMappingURL=context.js.map