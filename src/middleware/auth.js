const { query } = require("express");
const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");


//-------------------------------authentication-----------------------------//

const authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    if (!token) return res.status(401).send({ status: false, msg: "token must be present" }); 
    jwt.verify(token, "this is my privet key", function (error, decodedToken) {
      if (error) {
        return res.status(401).send({ status: false, msg: "Token is aa invalid." })
      } else {
        req.token = decodedToken
        console.log(req.token)
        next()
      }

    })


  } catch (error) {
    res.status(500).send({ status: false, Error: error.message })
  }
};

//---------------------------------authorization--------------------------------------//


const authorisation = async function (req, res, next) {

  try {
    
    let blogID = req.params.blogId
    let queryData = req.query


    if (Object.keys(queryData).length !== 0) {

      const queryBlog = await blogModel.findOne({ ...queryData })
      if (!queryBlog) {
        return res.status(404).send({ status: false, msg: 'Blog not found' })
      }
      console.log(queryBlog.authorId.toString())
      console.log(req.token.authorId)
      if (queryBlog.authorId.toString() !== req.token.authorId) {
        return res.status(404).send({ status: false, msg: 'Permission Denied' })
      }
      return next()

    }

    console.log(blogID)
    let authId = req.token.authorId

    let blog = await blogModel.findOne({ _id: blogID }).select({ authorId: 1 })
    console.log(blog)
    if (authId == blog.authorId) 
    {
      next()
    }
   
    else { 
      return res.status(403).send({ status: false, msg: 'Permission Denied' })
    }


  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }


}



//--------------------------------------/////------------------------------

module.exports.authentication = authentication
module.exports.authorisation = authorisation


