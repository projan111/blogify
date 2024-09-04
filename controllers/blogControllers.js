const mongoose = require("mongoose");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

function getBlogUser(req, res) {
  return res.render("addBlog", { user: req.user });
}

async function getBlogByUserId(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID");
  }
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
}

async function createNewComments(req, res) {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
}

async function createNewBlogs(req, res) {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImage: `/uploads/${req.file.filename}`,
  });

  return res.redirect(`/blog/${blog._id}`);
}

async function deleteBlog(req, res) {
  const user = await Blog.findByIdAndDelete(req.params.id);

  console.log("Blog Deleted!", user);

  return res.redirect("/");
}

module.exports = {
  getBlogUser,
  getBlogByUserId,
  createNewComments,
  createNewBlogs,
  deleteBlog,
};
