const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    dirNum: {
        type: String,
        required: true
    },
    edad: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('credentials', authSchema)