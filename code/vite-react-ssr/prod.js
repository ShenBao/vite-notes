const express = require("express");
const fs = require("fs");

const app = express();

let template = fs.readFileSync("./dist/server/index.html", "utf-8");

app.use(express.static("./dist/client"))
app.get("*", async (req, res) => {
    const { render } = require("./dist/server/entry-server.js");

    const context = {};
    const html = await render(req.url, context);

    if (context.url) {
        return res.redirect(301, context.url);
    }

    const responseHtml = template.replace(`<!-- APP_HTML -->`, html);

    res.set({ "Content-Type": "text/html" }).send(responseHtml);
});

app.listen(4000);
