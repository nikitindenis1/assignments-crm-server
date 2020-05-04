const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
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
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})
module.exports = User = mongoose.model('admin', AdminSchema)