const User = require('../models/user-model');
const Blog = require('../models/blog-model');
const Comment = require('../models/comment-model');
const mongoose = require('mongoose');

exports.checkOwnership = async (req,res,next) =>{
    try{
        const blog = await Blog.findById(req.params.id)
        if(!blog){
            return res.status(400).json({message:"Blog not found"})
        }

        if(blog.owner.toString() !== req.user.id){
            return res.status(403).json({message:"Only the blog owner can perfom this action"})
        }
        next();
    }catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
}