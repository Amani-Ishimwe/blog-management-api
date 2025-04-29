const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema ({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRole',
        required: [true, 'Role is required']
      }
})

const User = mongoose.model('Admin',userSchema)
module.exports = User