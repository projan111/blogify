const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const blogRoute = Router();
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const Comment = require("../models/comment");

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
  // console.log("blog:::", blog);
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  console.log("comment", comments);
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

// Comment route
blogRoute.post(
  "/comment/:blogId",
  upload.single("coverImage"),
  async (req, res) => {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });

    return res.redirect(`/blog/${req.params.blogId}`);
  }
);

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
