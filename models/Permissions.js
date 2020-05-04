const mongoose = require('mongoose')

const PermissionsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    permissions:{
        type:Array,
        default:[]
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})
module.exports = User = mongoose.model('permission', PermissionsSchema)