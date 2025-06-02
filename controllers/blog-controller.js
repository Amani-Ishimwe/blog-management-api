const Blog = require('../models/blog-model')
const User = require('../models/user-model')
const Joi = require('joi')
const WebSocket = require('ws')
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
 
 

exports.broadcast = (data) => {
  if (global._wss && global._wss.clients) {
    global._wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
};

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
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { blogId } = req.params;
    const userId = req.user?.id;

    if (!content?.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    if (!userId) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    const comment = new Comment({
      content: content.trim(),
      author: userId,
      blog: blogId
    });
    await comment.save();

    //  Add comment to blog's comments array
    await Blog.findByIdAndUpdate(blogId, {
      $push: { comments: comment._id }
    });

    exports.broadcast?.({
      type: 'NEW_COMMENT',
      blogId,
      content: comment.content,
      author: userId
    });

    res.status(201).json({
      success: true,
      comment,
      message: 'Comment added successfully'
    });

  } catch (error) {
    console.error('AddComment Error:', error);
    res.status(500).json({ 
      message: 'Error adding comment',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};




exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(403).json({ message: 'Invalid user ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const alreadyLiked = blog.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      likesCount: blog.likes.length,
      isLiked: !alreadyLiked,
      blog
    });

  } catch (err) {
    console.error('ToggleLike Error:', err);
    res.status(500).json({ message: 'Internal server error' });
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
