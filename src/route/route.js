const express = require('express');
const router = express.Router();
const author = require("../controllers/authorController");
const blog = require("../controllers/blogController")


//---------------------- CREATE and GET Author ------------------------------------------

router.post("/authors", author.createAuthor)
router.get("/authors", author.getAuthor)


//---------------------- CREATE and GET Blog using JWT ----------------------------------

router.post("/blogs", blog.createBlog)
router.get("/blogs", blog.getBlog)

//---------------------- UPDATE Blog using JWT ------------------------------------------

router.put("/blogs/:blogId", blog.updateBlog)


//---------------------- Delete blog using JWT ------------------------------------------

router.delete("/blogs/:blogId",  blog.deleteBlog)
router.delete("/blogs", blog.deleteQueryParams)

module.exports = router;