
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const Check = require('../utils/checkPermission');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require auth)
router.get('/profile', auth, userController.getProfile);

// Admin-only routes
router.get('/', auth, Check.checkPermission('manage_roles'), userController.getAllUsers);
router.post('/assign-role', auth, Check.checkPermission('manage_roles'), userController.assignRole);

module.exports = router;
