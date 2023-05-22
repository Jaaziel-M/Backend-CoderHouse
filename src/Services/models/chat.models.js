const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('mensajes', chatSchema)