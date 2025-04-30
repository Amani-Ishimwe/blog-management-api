const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roleSchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
        enum:['admin','moderator','user'],
        default:'user'
    },
    permissions:{
        type:[String],
        required:true,
        enum:[
            'create_blog',
            'delete_blog',
            'delete_any_blog',
            'edit_any_blog',
            'manage_roles'
        ],
        default:['create_blog']
    }
})
const Role = mongoose.model('Role',roleSchema)
module.exports = Role