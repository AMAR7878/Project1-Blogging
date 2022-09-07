const express = require('express');
const router = express.Router();
const author = require("../controllers/authorController");
const blog = require("../controllers/blogController")


//---------------------- CREATE and GET Author ------------------------------------------

router.post("/authors", author.createAuthor)



//---------------------- CREATE and GET Blog using JWT ----------------------------------

router.post("/blogs", blog.createBlog)
router.get("/blogs", blog.getBlog)

//---------------------- UPDATE Blog using JWT ------------------------------------------

router.put("/blogs/:blogId", blog.updateBlog)


//---------------------- Delete blog using JWT ------------------------------------------

router.delete("/blogs/:blogId",  blog.deleteBlog)
router.delete("/blogs", blog.deleteQueryParams)
//---------
router.post("/newGetBlog",blog.getBlogs)

//--------PHASE-2 ROUTES--------------------
router.post("/loginAuthor",blog.loginAuthor)
module.exports = router;