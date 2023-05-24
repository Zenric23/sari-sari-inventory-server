const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User  = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }, 
}, { timestamps: true })


module.exports = mongoose.model('User', User)