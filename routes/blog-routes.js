const express = require('express')
const blogControllers = require('../controllers/blog-controller')
const router = express.Router();
const Blog = require('../models/blog-model')

router.get('/',blogControllers.getAllBlogs)
router.get('/login',blogControllers.login)
router.get('/signup',blogControllers.signup)

module.exports = router ;