const express = require('express')
const router = express.Router()
const roleController = require('../controllers/role-controller')

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.post('/',auth,admin,roleController.createRole)
router.get('/',auth,admin,roleController.getRoles)


module.exports = router