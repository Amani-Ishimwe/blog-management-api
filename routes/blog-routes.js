const express = require('express')
const blogControllers = require('../controllers/blog-controller')
const router = express.Router()
const auth = require('../middleware/auth')
const  check= require('../utilities/checkOwnership')

router.get('/', blogControllers.getAllBlogs);
router.get('/:id', blogControllers.getBlogById);

// Protected routes (require auth + ownership)
router.post('/', auth,blogControllers.createBlog);
router.post('/:blogId/comments', auth, blogControllers.addComment);
router.post('/:blogId/like', auth, blogControllers.toggleLike);
router.put('/:id', auth, check.checkOwnership, blogControllers.updateBlog);
router.delete('/:id', auth, check.checkOwnership, blogControllers.deleteBlog);

module.exports = router ;