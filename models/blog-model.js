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
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'User is required']
    },
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      }],
    createdAt:{
        type:Date,
        default:Date.now
    }

})


const Blog = mongoose.model('Blog',blogSchema)

module.exports = Blog;