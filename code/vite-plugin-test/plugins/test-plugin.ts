import { Plugin } from "vite";

export default (): Plugin => {
    let config;

    return {
        name: "test",

        config(userConfig, env) {
            console.log("=============== test Plugin");

            console.log(userConfig, env);

            // return {
            //     resolve: {
            //         alias: {
            //             "@aaa": "/src/styles",
            //         },
            //     },
            // };
            return new Promise((resolve) => {
                resolve({
                    resolve: {
                        alias: {
                            "@aaa": "/src/styles",
                        },
                    },
                });
            });
        },

        configResolved(resolvedConfig) {
            console.log("================== resolvedConfig");
            console.log(resolvedConfig.resolve);

            // 存储最终解析的配置
            config = resolvedConfig;
        },

        configureServer(server) {
            // 加到所有中间件的最开始
            // server.middlewares.use((req, res, next) => {
            //     // 自定义请求处理...
            //     console.log(req);
            //     if (req.originalUrl === "/test") {
            //         res.end("Hello Vite Plugin");
            //     } else {
            //         next();
            //     }
            // });

            // return 的中间件将放在 vite 中间件的后面
            return () => {
                server.middlewares.use((req, res, next) => {
                    // 自定义请求处理...
                    // console.log(req);
                    if (req.originalUrl === "/test") {
                        res.end("Hello Vite Plugin");
                    } else {
                        next();
                    }
                });
            };
        },

        transformIndexHtml(html) {
            console.log("============== transformIndexHtml");
            console.log(html);
            return html.replace(
                `<div id="root"></div>`,
                `<div id="root" class="root-app"></div>`
            );
        },

        handleHotUpdate(ctx) {
            console.log("============== handleHotUpdate");
            console.log(ctx);
        },
    };
};
