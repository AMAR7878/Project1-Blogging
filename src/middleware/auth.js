const jwt=require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");


//-------------------------------authentication-----------------------------//

const authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];         
    
    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });    //If neither condition satisfies & no token is present in the request header return error

  console.log(token); 
  
    let decodedToken = jwt.verify(token, "this is my privet key")
    
   if(!decodedToken) {
      return res.status(401).send({ status: false, msg: "token is invalid" })}
      req.token=decodedToken
   
      
     

     next()
                         

  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message })
  }
};

//---------------------------------authorization--------------------------------------//


const authorisation = async function (req, res, next) {

  try {
    //  let token = req.headers["x-api-key"];
    //  let authordata = jwt.verify(token, "this is my privet key");
    
    let blogID = req.params.blogId
    console.log(blogID)
    let authId=req.token.authorId

    let blog = await blogModel.findOne({ _id: blogID }).select({authorId:1})
    console.log(blog)
    console.log(authId)
    if(authId==blog.authorId)    //id in blogModel is same as getting from req.params or not
    {
      next()
    }
    // console.log(blog)
    // console.log(req.loggedInAuthorId)
    else  {    //We have stored decoded token into req.loggedInAuthorId and comparing it with blog.authorId
      return res.status(403).send({ status: false, msg: 'Permission denied' })
    }

   
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }


}



  //--------------------------------------/////------------------------------
  
  module.exports.authentication = authentication
  module.exports.authorisation = authorisation
  

