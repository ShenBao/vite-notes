const express = require("express");
const fs = require("fs");

const app = express();

const { createServer: createViteServer } = require("vite");

createViteServer({
    server: {
        // middlewareMode: "html",
        middlewareMode: "ssr",
    },
}).then((vite) => {
    app.use(vite.middlewares);

    app.get("*", async (req, res) => {
        let template = fs.readFileSync("index.html", "utf-8");
        template = await vite.transformIndexHtml(req.url, template);

        const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");

        const html = await render(req.url);

        const responseHtml = template.replace(`<!-- APP_HTML -->`, html);

        res.set({ "Content-Type": "text/html" }).send(responseHtml);
    });

    app.listen(4000);
});
