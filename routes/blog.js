const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const blogRoute = Router();
const {
  getBlogUser,
  getBlogByUserId,
  createNewComments,
  createNewBlogs,
  deleteBlog,
  editBlog,
} = require("../controllers/blogControllers");

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

// Blog Routes ---------------------------------->
blogRoute.get("/add-new-blog", getBlogUser);
blogRoute.get("/:id", getBlogByUserId);
// Comment route
blogRoute.post(
  "/comment/:blogId",
  upload.single("coverImage"),
  createNewComments
);
blogRoute.post("/", upload.single("coverImage"), createNewBlogs);
blogRoute.delete("/:id", deleteBlog);
blogRoute.get("/edit-blog", editBlog);
module.exports = blogRoute;
