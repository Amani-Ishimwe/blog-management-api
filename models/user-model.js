const mongoose = require('mongoose')
const Role = require('./role-model')
const Schema = mongoose.Schema;
const userSchema = new Schema ({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: [true, 'Role is required'],
        default:'user'
      }
})

const User = mongoose.model('Admin',userSchema)
module.exports = User