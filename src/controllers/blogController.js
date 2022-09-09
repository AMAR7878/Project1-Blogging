const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const mongoose = require('mongoose')



const isValidObjectId = function (value) {            //for validating object id
    return mongoose.Types.ObjectId.isValid(value) //returns boolean values
}
//--------------------//---------------------------
const validate=function (value) {

    if(typeof value=="number" ||typeof value=="undefined"||typeof value.length==null)
    {
    return false
    }
    if (typeof value == "string" && value.trim().length == 0)
     { return false }
    
    
    

return true
}
// --------------------------------------- POST /blogs --------------------------------------

const createBlog = async function (req, res) {
    try {
        let blog = req.body
        let { title, authorId, category,subcategory,body, tags } = blog
 
       

       // let author = req.body.authorId
        if (!(title && authorId && category && body && tags)) return res.status(400).send({ status: false, msg: "Please fill the Mandatory Fields." });
        if (!validate(title))
            return res.status(400).send({ status: false, message: "Please enter Blog Title." });

        if (!validate(category))
        return res.status(400).send({ status: false, message: "Please enter Blog category." });

        if (!validate(body))
        return res.status(400).send({ status: false, message: "Please enter  Blog body." });
        
        if (!validate(tags))
        return res.status(400).send({ status: false, message: "Please enter Blog Tags." });
        
        if (!validate(subcategory))
        return res.status(400).send({ status: false, message: "Please enter subcategory." });
        

        let checkauthor = await authorModel.findById({ _id: authorId })
        if (!checkauthor) {
            res.status(400).send({ status: false, msg: "authorId is not valid" })
        }
        
        let Blog = await blogModel.create(blog)
        res.status(201).send({ status: true, msg: Blog })

    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}

// --------------------------------------- GET /blogs --------------------------------------

const getBlog = async function (req, res) {
    try {

        let data = req.query;

        let getData = await blogModel.find({ isPublished: true, isDeleted: false, ...data })  //.count()

        if (getData.length == 0)
            return res.status(404).send({ status: false, msg: " no such data found...!" })
        if (!getData)
            return res.status(404).send({ status: false, msg: "no such documents found...!" })

        res.status(200).send({ status: true, data: getData })
        // console.log(getData)

    } catch (err) {
        res.status(500).send({ status: false, msg: err.msg })
    }

}
// --------------------------------------- PUT /blogs/:blogId --------------------------------------


const updateBlog = async function (req, res) {
    try {

        let blogId = req.params.blogId
        let blogData = req.body

        // if (Object.keys(blogData).length == 0)
        //     return res.status(404).send({ status: false, msg: "Body is required" });

        //console.log("Here")


        let blog = await blogModel.findById(blogId)

        if (!blog) { res.status(404).send({ status: false, msg: "author is not found" }) }
        let blogupdate = await blogModel.findOneAndUpdate({ _id: blogId }, blogData)
        res.send({ status: updatebogsucsess, Data: blogupdate })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, Error: error.message })
    }

}

// --------------------------------------- DELETE /blogs/:blogId --------------------------------------


const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId

        let blog = await blogModel.findById(blogId)
        if (blog.isDeleted === true) {
            return res.status(404).send({ status: false, message: "No such blogId exists" })
        }
        //.send({status: true, msg: deletedBlog})
        let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: new Date() },{new:true})
        res.status(200).send({ status: true, msg: "Data is successfully deleted" })
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}

// --------------------------------------- DELETE /blogs?QueryParam -----------------------------------

const deleteQueryParams = async function (req, res) {
    try {
        const data = req.query
        const filterQuery = { isDeleted: false, deletedAt: null } // base condtion
        //console.log(data)

        if (Object.keys(data).length == 0) {
            return res.status(404).send({ status: false, msg: "No such Blog Exist, Please provide filters" })
        }

        let { authorId, category, subcategory, tags, isPublished } = data    // destructuring data
        if (isValid(authorId) && isValidObjectId(authorId)) {              // use for validating, base => new keys and values are assigned
            filterQuery["authorId"] = authorId
        }
        if (isValid(category)) {
            filterQuery["category"] = category
        }
        if (isValid(subcategory)) {
            filterQuery["subcategory"] = subcategory
        }
        if (isValid(tags)) {
            filterQuery["tags"] = tags
        }
        if (isValid(isPublished)) {
            filterQuery["isPublished"] = isPublished
        }

        //console.log(filterQuery)

        const deletedBlogs = await blogModel.find(filterQuery)
        if (deletedBlogs.length === 0) {
            return res.status(404).send({ status: false, error: "Blog is empty" })
        }
        const blogAuth = deletedBlogs.filter((blog) => {                         // authorisation using filter
            if (blog.authorId == req.loggedInAuthorId)
                return blog._id
            else
                return res.status(404).send({ status: false, msg: "User is not authorised to do changes" })
        })


        const deletedBlogs1 = await blogModel.updateMany({ _id: { $in: deletedBlogs } }, { $set: { isDeleted: true, deletedAt: new Date() } })

        // console.log(deletedBlogs1)


        return res.status(200).send({ status: true, msg: "Blogs Deleted Successfully" })



    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}




//-------------------------------- exporting Modules --------------------------------------------- 

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteQueryParams = deleteQueryParams

