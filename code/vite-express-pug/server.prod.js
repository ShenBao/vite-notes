const express = require("express");
const app = express();

const manifest = require("./dist/manifest.json");

app.set("view engine", "pug");

app.use(express.static("dist"));

app.get("/", (req, res) => {
    res.render("prod", {
        title: "Hey",
        message: "Hello express pug",
        index: manifest["index.html"].file,
        vendor: manifest[manifest['index.html'].imports[0]].file,
        css: manifest['index.html'].css[0],
    });
});

app.listen(4000);
