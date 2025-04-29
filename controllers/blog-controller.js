const Blog = require('../models/blog-model')
const User = require('../models/user-model')
const Joi = require('joi')
const mongoose = require('mongoose')
const debug = require('debug')('app:blog-controller')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

const blogSchema = Joi.object({
    title:Joi.string().required(),
    content:Joi.string().required(),
    User:Joi.string().custom((value,helpers)=>{
        if(!mongoose.Types.ObjectId.isValid(value)){
            return helpers.error('any.invalid')
        }
        return value
    },'User ID is not valid').required(),
    blogCode:Joi.string().required(),
    likes:Joi.number().default(0),
    comments:Joi.array().items(Joi.object({
        text:Joi.string().required()
    }))
})
 

module.exports = createBlog = [
auth,
admin,
async (req,res)=>{
    try{
        const {error} = blogSchema.validate(req.body)
        if(error) return res.status(400).json({message:error.details[0].message})
        //checking if the user exists

        const user   = await User.findById(req.body.User)
        if(!user) return res.status(400).json({message:'User not found'})
            //Creating the blog
        const blog = new Blog(req.body)
        await blog.save()
        res.status(201).json(blog)

    }catch(error){
    debug(error)
    return res.status(500).json(error:'Internal Server Error')
    }
}
]

module.exports = 

/*const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .exec(); // Explicit execution

        res.status(200).json({
            success: true,
            message: 'Blogs fetched successfully',
            data: blogs
        });

    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs'
        });
    }
};



module.exports = {
    getAllBlogs
};*/