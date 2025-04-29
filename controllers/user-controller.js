const User = require('../models/user-model')
const Role = require('../models/role-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('config')
const Joi = require('joi')
const debug = require('debug')('app:user-controller')

const userSchema = Joi.object({
    username:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().min().required(),
    role:Joi.string().required()
})

module.export.register = async (req,res)=>{
    try{
        const {error} = userSchema.validate(req.body)
        if(error) return res.status(400).json({message:error.details[0]})
        
        const role = await Role.findOne({roleName:req.body.role})
        if(!role) return res.status(400).json({message:'Role not found'})
        
        const user = new User(req.body)
        await user.save()
        
        const token = jwt.sign({id:user._id},config.get('jwtsecret'),{expiresIn:'1h'})
        res.status(201).json({token})
    }catch(error){
    debug(error)
    return res.status(500).json({message:'Internal Server Error'})
    }
}

module.exports.login = async (req,res)=>{
    try{
        const {email,password} = req.body
        const user = await User.findOne({email}).populate('role')

        if(!user || !await bcrypt.compare(password,user.password)){
            return res.status(400).json({message:'Invalid email or password'})
        }
        const token = jwt.sign({id:user._id},config.get('jwtsecret'),{expiresIn:'1h'})
        res.json({token,role:user.role.roleName.name})
    }catch(error){
        debug(error)
        return res.status(500).json({message:'Internal Server Error'})
    }
}
