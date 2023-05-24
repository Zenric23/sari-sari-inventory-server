const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product  = new Schema({
    product_name: {
        type: String,
        required: true,
        unique: true
    },
    sales_price: {
        type: Number,
        required: true
    },
    purchase_price: {
        type: Number,
        required: true
    },
}, { timestamps: true })


module.exports = mongoose.model('Product', Product) 