const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('productos', productsSchema)