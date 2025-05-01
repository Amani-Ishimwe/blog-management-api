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
        const blogs = await Blog.find()
        res.status(200).json(blogs)
    }catch(error){
     console.log(error);
     
        res.status(500).json({message:"Error fetching blogs"})
    }
}

exports.getBlogById = async (req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id)
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
            owner:req.user.id
        })
        await newBlog.save()
        res.status(201).json(newBlog)
    }catch (err) {
        res.status(500).json({ message: "Error creating blog" });
    }
}

exports.updateBlog = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }

    const blog = await Blog.findById(req.params.id);

    // Check if blog and owner exist
    if (!blog || !blog.owner) {
      return res.status(404).json({ message: 'Blog not found or missing owner' });
    }

    // Confirm the logged-in user is the owner
    if (blog.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not own this blog' });
    }

    // Perform update
    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.deleteBlog = async (req, res) => {
  try {
    // Find the blog by its ID
    const blog = await Blog.findById(req.params.id);

    // If the blog is not found
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Ensure that the blog has an owner and the logged-in user is the blog owner
    if (!blog.owner || !req.user._id) {
      return res.status(403).json({ message: 'Forbidden: Missing owner information or user information' });
    }

    if (blog.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not own this blog' });
    }

    // Delete the blog using findByIdAndDelete
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    // Ensure user is authenticated
    /*if (!req.user || !req.user._id) {
      return res.status(403).json({ message: 'Forbidden: Missing user information' });
    }*/

    const comment = new Comment({
      content,
      author: req.user._id,  // use _id
      blog: req.params.blogId
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error adding comment', error: err.message });
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
