const express = require("express");
const app = express();

app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.render("index", {
        title: "Hey",
        message: "Hello express pug",
    });
});

app.listen(4000);
