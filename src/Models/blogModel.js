const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId 

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    body: {
        type: String,
        required: true,
   
    },
    authorId: {
        type: objectId,
        required: true,
        ref: "authorDB",
    },
    tags: {
        type: Array, 
        required:true   
    },

    category: {
        type: String,
        required: true,
    },   
    subcategory: [String],

    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },

    deletedAt: {type: Date, 
        default: Date.now},

    publishedAt: {type: Date, 
        default: Date.now}

},
    { timestamps: true });


module.exports = mongoose.model('blogDb', blogSchema)
