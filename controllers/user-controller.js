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
    password:Joi.string().min(6).required(),
    role:Joi.string().required()
})




exports.register = async (req,res)=>{
    try{
         const {username,email,password} = req.body         
         const existingUser = await User.findOne({email})
         if(existingUser){
            return res.status(409).json({message:'User already exists'})
         }



         const anotherUserExists = await User
        .findOne({username})

  

        if(anotherUserExists){
          return res.status(409).json({message:'Username already taken'})
       }
         const hashedPassword = await bcrypt.hash(password,10)
         const user = new User({
            username,
            email,
            password:hashedPassword,
            isAdmin: req.body.isAdmin
        })

        const { password: userPassword, ...savedUser } = user;
        console.log(savedUser);

        

            await user.save()
            const token = jwt.sign({id:user._id,role: user.isAdmin },config.get('jwtsecret'),{expiresIn:'1h'})
            return res.status(201).send({user: savedUser , token})

       }catch (err) {        
        console.log(err);
        
        res.status(500).json({ message: 'Error registering user' });
       }
    };

module.exports.login = async (req,res)=>{
    try{
        const {email,password} = req.body;
         // Find the  user
      const user = await User.findOne({ email})
     if(!user || !await bcrypt.compare(password,user.password)){
      return res.status(400).json({message:"Invalid credentials"})
     }
      const token = jwt.sign({id:user._id,isAdmin: user.isAdmin},config.get('jwtsecret'),{expiresIn:'1h'})
      res.status(200).json({ 
            token, 
            user: { 
              id: user._id, 
              username: user.username, 
              email: user.email, 
              isAdmin: user.isAdmin
            } 
          });
    }catch(error){
        console.log(error)
        return res.status(500).json({message:'Internal Server Error'})
    }
}


exports.getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .select('-password')
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching profile' });
    }
  };

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
  
      res.status(200).json(users);
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error fetching users' });
    }
  };

  exports.assignRole = async (req, res) => {
    try {
      const { userId, isAdmin } = req.body;
  
      const user = await User.findByIdAndUpdate(
        userId,
        { isAdmin }, // isAdmin: true for admin, false for normal user
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Role updated', user });
    } catch (err) {
      res.status(500).json({ message: 'Error assigning role' });
    }
  };