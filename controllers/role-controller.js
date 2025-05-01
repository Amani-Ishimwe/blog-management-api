const Role = require('../models/role-model')
const Joi = require('joi')
const debug = require('debug')('app:role-controller')
const User = require('../models/user-model')


const roleSchema =  Joi.object({
    roleName:Joi.string().valid('Admin','User').required(),
    description:Joi.string().required()
})



//this is for admin only
exports.createRole = async (req,res)=>{
    try{
       const {name,permissions} = req.body
       const role = new Role({name , permissions})
       await role.save()
       res.status(201).json(role)
       }catch(error){
        debug(error);
        return res.status(500).json({error:'Internal server error'})
       }
}



//for admin only
exports.getRoles = async (req,res) =>{
    try{
        const roles = await Role.find()
         res.status(200).json(roles)     
       }catch(error){
        debug(error);
        return res.status(500).json({error:'Internal server error'})
       }
}