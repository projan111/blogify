const express = require("express");
const app = express();
const path = require("path");
const PORT = 4000;
const ejs = require("ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  return res.render("home");
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
