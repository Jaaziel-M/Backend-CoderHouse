const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kartSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        required: true
    },
})

module.exports = mongoose.model('carritos', kartSchema)