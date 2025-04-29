const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roleSchema = new Schema ({
    roleName:{
        type:String,
        enum:{
            values:['Admin','User'],
            message:'{VALUE} is not a valid role'
        },
        required:[true,'Role name is required'],
        unique:true
    },
    description:{
        type:String,
        required:[true,'Description is required'],
        trim:true
    }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
const Role = mongoose.model('Role',roleSchema)
module.exports = Role