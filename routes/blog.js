const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const blogRoute = Router();
const Blog = require("../models/blog");
const mongoose = require("mongoose");

// Implement multer methods
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Blog Routes
blogRoute.get("/add-new-blog", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

blogRoute.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID");
  }
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  console.log("blog:::", blog);
  return res.render("blog", {
    user: req.user,
    blog,
  });
});

blogRoute.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImage: `/uploads/${req.file.filename}`,
  });

  return res.redirect(`/blog/${blog._id}`);
});

module.exports = blogRoute;
