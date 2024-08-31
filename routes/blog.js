const { Router } = require("express");

const blogRoute = Router();

blogRoute.get("/add-new-blog", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

module.exports = blogRoute;
