const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const blogSchema = new Schema ({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'User is required']
    },
    blogCode:{
        type:String,
        required:[true, 'Blog code is required'],
        unique:true,
        trim:true
    },
    likes:{
        type:Number,
        default:0
    },
    comments:[{
        text:String
    }]
},{timestamps:true})
const Blog = mongoose.model('Blog',blogSchema)

module.exports = Blog;