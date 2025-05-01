const mongoose = require('mongoose');
const User = require('../models/user-model')
const Blog = require('../models/blog-model')

const CommentSchema = new mongoose.Schema({
  content: {
     type: String, 
     required: true 
    },
  author:{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
 },
  blog: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Blog', 
     required: true 
    },
  createdAt: { 
    type: Date, 
    default: Date.now
 }
});

module.exports = mongoose.model('Comment', CommentSchema);