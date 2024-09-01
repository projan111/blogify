const express = require("express");
const app = express();
const path = require("path");
const PORT = 4000;
const ejs = require("ejs");
const userRoutes = require("./routes/user");
const cookieParser = require("cookie-parser");
const { mongoConnection } = require("./config/db");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");

// Mongodb Connection
mongoConnection("mongodb://127.0.0.1:27017/blogify");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public"))); // We add this static middleware to render the uploaded images from the multer.

// Set Template Engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Home route
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  return res.render("home", { user: req.user, blogs: allBlogs });
});

// Import Route Handler
app.use("/user", userRoutes);
app.use("/blog", blogRoute);

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
