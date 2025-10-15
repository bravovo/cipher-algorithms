const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const polybiusRouter = require("./routes/polybius");
const gronsfeldRouter = require("./routes/gronsfeld");
const doublePlayfairRouter = require("./routes/doublePlayfair");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "views");

app.use("/polybius", polybiusRouter);
app.use("/gronsfeld", gronsfeldRouter);
app.use("/double-playfair", doublePlayfairRouter);

app.get("/", (req, res) => {
    res.render("index", {
        title: "Квадрат Полібія",
        start: true,
        error: false,
    });
});

app.listen(8080, () => {
    console.log("RUNNING");
});
