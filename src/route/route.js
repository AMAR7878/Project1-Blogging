const express = require('express');
const router = express.Router();
const author = require("../controllers/authorController");
const blog = require("../controllers/blogController")
const Mw = require("../middleware/auth");

//---------------------- CREATE and GET Author ------------------------------------------

router.post("/authors", author.createAuthor)
router.get("/authors", author.getAuthor)

//---------------------- Login author----------------------------------

router.post("/loginAuthor",author.loginAuthor)


//---------------------- CREATE and GET Blog using JWT ----------------------------------


router.post("/blogs", Mw.authentication,blog.createBlog)
router.get("/blogs", Mw.authentication, blog.getBlog)


//---------------------- UPDATE Blog using JWT ------------------------------------------

router.put("/blogs/:blogId",Mw.authentication,Mw.authorisation,blog.getBlog)


//---------------------- Delete blog using JWT ------------------------------------------

router.delete("/blogs/:blogId",Mw.authentication,Mw.authorisation,blog.deleteBlog)
router.delete("/blogs", Mw.authentication,blog.deleteQueryParams)



module.exports = router;