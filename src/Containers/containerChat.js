const mongoose = require('mongoose')
const connect = require('../Services/config/connect')
const chatModels = require('../Services/models/chat.models')

class ChatContainer{
    constructor(){
        this.connect = connect()
    };
    // METODOS PARA CRUD DE MENSAJES (EDITAR LOS OTROS METODOS)  
    async getAllMsg() {
        let chats = await chatModels.find()
        return chats;
    }
    async addMsg(bodyFromPage) {
            let datenow = new Date();
            const data = {
                email: bodyFromPage.email,
                tipo: bodyFromPage.tipo,
                timestamp: datenow,
                mensaje: bodyFromPage.mensaje
            }
            const SaveModel = new chatModels(data);
            const SavedModel = await SaveModel.save();
            return SavedModel;
    }
}
module.exports = ChatContainer;