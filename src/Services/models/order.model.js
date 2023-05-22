const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
    time: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('orders', orderSchema)