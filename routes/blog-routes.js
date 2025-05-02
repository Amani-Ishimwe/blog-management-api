const express = require('express')
const blogControllers = require('../controllers/blog-controller')
const router = express.Router()
const auth = require('../middleware/auth')


router.get('/', blogControllers.getAllBlogs);
router.get('/:id', blogControllers.getBlogById);

// Protected routes (require auth + ownership)
router.post('/', auth,blogControllers.createBlog);
router.post('/:blogId/comments', blogControllers.addComment);
router.post('/:blogId/like', auth, blogControllers.toggleLike);
router.put('/:id', auth,blogControllers.updateBlog);
router.delete('/:id', auth, blogControllers.deleteBlog);

module.exports = router ;