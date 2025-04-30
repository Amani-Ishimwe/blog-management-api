const express = require('express')
const router = express.Router()
const roleController = require('../controllers/role-controller')
const check = require('../utils/checkPermission');
const auth = require('../middleware/auth')

router.post('/',auth, check.checkPermission('manage_roles'),roleController.createRole)
router.post('/assign',auth, check.checkPermission('manage_roles'),roleController.assignRole)
router.get('/',auth,check.checkPermission('manage_roles'),roleController.getRoles)


module.exports = router