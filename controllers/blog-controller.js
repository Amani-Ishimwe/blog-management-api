const Blog = require('../models/blog-model')
const User = require('../models/user-model')
const Joi = require('joi')
const mongoose = require('mongoose')
const debug = require('debug')('app:blog-controller')
const auth = require('../middleware/auth')
const Comment = require('../models/comment-model')

const blogSchema = Joi.object({
    title:Joi.string().required(),
    content:Joi.string().required(),
    owner:Joi.string().custom((value,helpers)=>{
        if(!mongoose.Types.ObjectId.isValid(value)){
            return helpers.error('any.invalid')
        }
        return value
    },'User ID is not valid').required(),
    blogCode:Joi.string().required(),
    likes:Joi.number().default(0)
})
 
 

exports.getAllBlogs = async (req,res) =>{
    try{
        const blogs = await Blog.find().populate('User','email password')
        res.status(200).json(blogs)
    }catch(error){
        res.status(500).json({message:"Error fetching blogs"})
    }
}

exports.getBlogById = async (req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id).populate('User','email password')
        if(!blog){
            return res.status(404).json({message:"Blog not found"})
        }
        res.status(200).json(blog)
    }catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
}

exports.createBlog = async (req,res) =>{
    try{
        const {title,content} = req.body
        const newBlog = new Blog({
            title,
            content,
            User:req.User.id
        })
        await newBlog.save()
        res.status(201).json(newBlog)
    }catch (err) {
        res.status(500).json({ message: "Error creating blog" });
    }
}

exports.updateBlog = async (req,res) =>{
    try {
        const { title, content } = req.body;
        // 1. Find and update the blog
        const updatedBlog = await Blog.findByIdAndUpdate(
          req.params.id,
          { title, content },
          { new: true } // Return the updated document
        );
    
        if (!updatedBlog) {
          return res.status(404).json({ message: "Blog not found" });
        }
    
        res.status(200).json(updatedBlog);
      } catch (err) {
        res.status(500).json({ message: "Error updating blog" });
      }
}

exports.deleteBlog = async (req, res) => {
    try {
      // 1. Delete the blog
      const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
  
      if (!deletedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting blog" });
    }
  };

  exports.addComment = async (req, res) => {
    try {
      const { content } = req.body;
      const comment = new Comment({
        content,
        author: req.user.id, // From JWT
        blog: req.params.blogId
      });
  
      await comment.save();
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ message: 'Error adding comment' });
    }
  };

  exports.toggleLike = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.blogId);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
  
      const userId = req.user.id;
      const likeIndex = blog.likes.indexOf(userId);
  
      // Toggle like
      if (likeIndex === -1) {
        blog.likes.push(userId); // Like
      } else {
        blog.likes.splice(likeIndex, 1); // Unlike
      }
  
      await blog.save();
      res.status(200).json(blog);
    } catch (err) {
      res.status(500).json({ message: 'Error toggling like' });
    }
  };
  exports.getBlogById = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id)
        .populate('owner', 'username')
        .populate('likes', 'username')
        .populate({
          path: 'comments',
          populate: { path: 'author', select: 'username' }
        });
  
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.status(200).json(blog);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching blog' });
    }
  };
