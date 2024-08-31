const { Router } = require("express");

const blogRoute = Router();

blogRoute.get("/add-new-blog", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

blogRoute.post("/", (req, res) => {
  console.log(req.body);
  return res.redirect("/");
});

module.exports = blogRoute;
