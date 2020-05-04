const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})
module.exports = User = mongoose.model('company_account', CompanySchema)