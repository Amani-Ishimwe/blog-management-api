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
            return res.status(400).json({message:'User already exists'})
         }

         const hashedPassword = await bcrypt.hash(password,10)
         const userRole = await Role.findOne({name:'user'})

         const user = new User({
            username,
            email,
            password:hashedPassword,
            role:userRole._id
        })
            await user.save()
            const token = jwt.sign({id:user._id,role:userRole.name},config.get('jwtsecret'),{expiresIn:'1h'})
       }catch (err) {
        res.status(500).json({ message: 'Error registering user' });
       }
    };

module.exports.login = async (req,res)=>{
    try{
        const {email,password} = req.body;
         // Find the  user
      const user = await User.findOne({ email }).populate('role');
     if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });

    }

        const token = jwt.sign({id:user._id,role:userRole.name},config.get('jwtsecret'),{expiresIn:'1h'})
        res.status(200).json({ 
            token, 
            user: { 
              id: user._id, 
              username: user.username, 
              email: user.email, 
              role: user.role.name 
            } 
          });
    }catch(error){
        debug(error)
        return res.status(500).json({message:'Internal Server Error'})
    }
}


exports.getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .select('-password')
        .populate('role', 'name permissions');
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching profile' });
    }
  };

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
        .populate('role', 'name');
  
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  };

  exports.assignRole = async (req, res) => {
    try {
      const { userId, roleId } = req.body;
  
      const user = await User.findByIdAndUpdate(
        userId,
        { role: roleId },
        { new: true }
      ).populate('role', 'name');
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error assigning role' });
    }
  };
  
  