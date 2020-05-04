const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
    },
    position: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    is_manager:{
        type:Boolean,
        default:true
    },
   
    created_at: {
        type: Date,
        default: Date.now
    }
})
module.exports = User = mongoose.model('user', UserSchema)