const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({

    /*
    entities: {
        usuarios: {type: Array, required: true},
        all: {
            {type: Array, required: true}
        }

    },
    result: {
        type: String,
        required: true
    }
    */

            id: {
                type: String,
                required: true
            },
            nombre: {
                type: String,
                required: true
            },
            apellido: {
                type: String,
                required: true
            },
            edad: {
                type: Number,
                required: true
            },
            alias: {
                type: String,
                required: true
            },
            avatar: {
                type: String,
                required: false
            },
            message: {
                type: String,
                required: true
            },
            time: {
                type: String,
                required: true
            }
        
})

module.exports = mongoose.model('messages', messageSchema)