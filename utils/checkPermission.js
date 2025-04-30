const User = require('../models/user-model');
const Blog = require('../models/blog-model');
const Comment = require('../models/comment-model');
const mongoose = require('mongoose');

exports.checkPermission = (permission) => {
    return async (req, res, next) => {
      const user = await User.findById(req.user.id).populate('role');
      if (!user.role.permissions.includes(permission)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
      next();
    };
  };