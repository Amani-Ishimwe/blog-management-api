const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = async (req,res,next) =>{
   try{
    const token = req.header('Authorization')?.replace('Bearer ','')
    if(!token){
        return res.status(401).json({message:'Access denied coz no token provided'})
    }
    const decoded = jwt.verify(token,config.get('jwtsecret'))
    req.user = decoded
    next()
    }catch(error){
        res.status(400).json({message:"Invalid token"})
    }
}