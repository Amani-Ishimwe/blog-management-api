const mongoose = require('mongoose')
const Role = require('./role-model');
const { required } = require('joi');
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
    isAdmin: {
        type: Boolean,
        required: true
    }
})

const User = mongoose.model('user',userSchema)
module.exports = User