const mongoose = require('mongoose')

const AccountSettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },

    permissions:{
        type:Array,
        default:["EM001",
        "EM002",
        "EM003",
        "EM004",
        "EM005",
        "EM006",
        "EM007",]
    },
    language:{
        type:String,
        default:'english'
    },
    avatar:{
        type:String
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
module.exports = User = mongoose.model('account_settings', AccountSettingsSchema)