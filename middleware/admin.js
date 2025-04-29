const User = require('../models/user-model')
const role = require('../models/role-model')

module.exports = async (req,res,next) =>{
    try{
    const user = await User.findById(req.user.id).populate('role')
    if(!user || user.role.roleName !== 'Admin'){
        return res.status(403).json({message:'Admin Access Denied'})
    }
    next()
    }catch(error){
    return res.status(500).json({error:'Internal Server Error'})
    }
}