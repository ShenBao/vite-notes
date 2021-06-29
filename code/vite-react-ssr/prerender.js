const fs = require("fs");
const path = require("path");

const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute("dist/server/index.html"), "utf-8");
const { render } = require("./dist/server/entry-server.js");

const routesToPrerender = fs
    .readdirSync(toAbsolute("src/pages"))
    .map((file) => {
        const name = file.replace(/\.jsx$/, "").toLowerCase();
        return name === "home" ? `/` : `/${name}`;
    });

(async () => {
    for (const url of routesToPrerender) {
        const context = {};
        const appHtml = await render(url, context);

        const html = template.replace(`<!-- APP_HTML -->`, appHtml);

        const filePath = `dist/static${url === "/" ? "/index" : url}.html`;
        fs.writeFileSync(toAbsolute(filePath), html);
        console.log("pre-rendered:", filePath);
    }
})();
