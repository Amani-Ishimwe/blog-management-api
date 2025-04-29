const Role = require('../models/role-model')
const Joi = require('joi')
const debug = require('debug')('app:role-controller')


const roleSchema =  Joi.object({
    roleName:Joi.string().valid('Admin','User').required(),
    description:Joi.string().required()
})

module.exports.createRole = async (req,res)=>{
    try{
        const {error} = roleSchema.validate(req.body)
        if(error) return res.status(400).json({error:error.details[0].message})
        
        const role = new Role(req.body)
        await role.save()
        res.status(201).json(role)
       }catch(error){
        debug(error);
        return res.status(500).json({error:'Internal server error'})
       }
}

module.exports.getRoles = async (req,res) =>{
    try{
        const roles = await Role.find()
         res.status(200).json(roles)     
       }catch(error){
        debug(error);
        return res.status(500).json({error:'Internal server error'})
       }
}