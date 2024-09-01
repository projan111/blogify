const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const blogRoute = Router();
const Blog = require("../models/blog");

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

blogRoute.get("/add-new-blog", (req, res) => {
  return res.render("addBlog", { user: req.user });
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
