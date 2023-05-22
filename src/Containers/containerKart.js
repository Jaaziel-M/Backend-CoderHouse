const mongoose = require('mongoose')
const connect = require('../Services/config/connect')
const kartModel = require('../Services/models/kart.model')

class KartContainer {
    constructor(){
        this.connect = connect()
    };

    async getAllKartsFromUser(username) {
        try {
            const clientKart = await kartModel.findOne({user:username})
            return clientKart.products
        } catch (error) {
            //throw new Error(error)
            console.log(error)
            return []
        }
        
    }
    async createOrUpdateKart(bodyFromPage, username){
        try {
            const results = await  kartModel.findOne({user:username})
            if (results == null){
                const newKart = new kartModel({
                    user: username,
                    kart: bodyFromPage
                });
                const addkart = await newKart.save();  
                
            }
            else{
                await kartModel.findOneAndUpdate({user: username},{$push:{products: bodyFromPage}})
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    async deleteFromKartById(id_user, id_prod){
        try {
            await kartModel.updateOne({user:id_user},{$pull: {products:{product:id_prod}}})
            return `el producto ${id_prod} ha sido eliminado del carrito ${id_user}`
        } catch (error) {
            throw new Error(error)
        }
    }
    async deleteAndReturnKart(id_user){
        try {
            const data = await kartModel.findOneAndDelete({user:id_user})
            return data.products
        } catch (error) {
            throw new Error(error)
        }
    }
    
}

module.exports = KartContainer;