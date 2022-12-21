const mongoose = require('mongoose')
const connect = require('../Services/config/connect')
const modelChat = require('../Services/models/chat.model')


class ChatContainer{
    constructor(){
        this.connect = connect()
    };
    // METODOS PARA CRUD DE MENSAJES (EDITAR LOS OTROS METODOS)  
    async getAllMsg() {
        let chats = await modelChat.find()
        return chats;
    }/*
    async addMsg(bodyFromPage) {
            const data = {
                message: bodyFromPage.messages, 
                id: bodyFromPage.mail,
                edad: parseInt(bodyFromPage.edad),
                apellido: bodyFromPage.apellido,
                nombre: bodyFromPage.nombre, 
                alias: bodyFromPage.alias,
                avatar: bodyFromPage.avatar,
                time: bodyFromPage.time
            }
            const SaveModel = new modelChat(data);
            const SavedModel = await SaveModel.save();
            return SavedModel;
    }*/
//  test con normalizacion 
    // GENERAR UN MODELO PARA USUARIOS Y OTRO PARA MENSAJES

//  end test 

    async updateProdById(bodyFromPage){
            const data = {
                title: bodyFromPage.title, 
                price: parseInt(bodyFromPage.price),
                url: bodyFromPage.url,
                stock: parseInt(bodyFromPage.stock),
                descripcion: bodyFromPage.descripcion
            }
            const idParameter = bodyFromPage.id
            await modelProd.findByIdAndUpdate(idParameter,data);
            return `producto con id: ${idParameter} actualizado`
    
    }
    async deleteProdById(id){
            return await modelProd.deleteOne({_id:id})
    }

}
module.exports = ChatContainer;