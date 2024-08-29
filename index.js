const express = require("express");
const app = express();
const path = require("path");
const PORT = 4000;
const ejs = require("ejs");
const userRoutes = require("./routes/user");
const { mongoConnection } = require("./config/db");
mongoConnection("mongodb://127.0.0.1:27017/blogify");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  return res.render("home");
});

// Import Route Handler
app.use("/user", userRoutes);

// API Health Check
app.get("/health-check", (req, res) => {
  return res.status(201).json({
    status: "Success",
    message: "your health is in good condition.",
  });
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});
