const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Transaction  = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
}, { timestamps: true })


module.exports = mongoose.model('Transaction', Transaction)