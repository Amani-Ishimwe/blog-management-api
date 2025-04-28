const Blog = require('../models/blog-model')
/*const path = require('path')
const express = require('express')
const app = express()
app.set('views',path.join(__dirname,'views'));*/

const getAllBlogs = (req, res) => {
    Blog.find()
      .sort({ createdAt: -1 })  // Fixed casing
      .then((blogs) => {
        res.render('users', { 
          title: 'All Blogs', 
          blogs: blogs 
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).render('error', { 
          title: 'Error', 
          error: 'Failed to fetch blogs' 
        });
      });
  };
const login = (req,res)=>{
    res.render('login')
}

const signup = (req,res) =>{
    res.render('signup')
}

module.exports = {
    getAllBlogs,
    login,
    signup
}