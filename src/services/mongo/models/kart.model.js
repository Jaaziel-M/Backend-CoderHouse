const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kartsSchema = new Schema({
    id_cart: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    productos: {
        type: Array,
        required: false
    },

})

module.exports = mongoose.model('carritos', kartsSchema)