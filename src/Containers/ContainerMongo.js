const model =  require('../services/mongo/models/products.model')
const mongoose = require('mongoose')

class ContainerMongo {
    constructor(connect){
        this.connect = connect
    };
    async getAllProds(page=0, limit=4) {
        page = parseInt(page);
        limit = parseInt(limit);
        if(limit>4){limit=4};
        let offset = page * limit; // la cuenta acá es, si page es 0, muestra los primeros 4 y conforme page aumente su valor, iremos desplazandonos en el array de datos entregado por la db 
        let prods = await model.find().skip(offset).limit(limit)
        return prods;
    }
    async addProduct(bodyFromPage) {
        const data = {
            title: bodyFromPage.title, 
            price: parseInt(bodyFromPage.price),
            url: bodyFromPage.url,
            stock: parseInt(bodyFromPage.stock),
            descripcion: bodyFromPage.descripcion
        }
        const SaveModel = new model(data);
        const SavedModel = await SaveModel.save();
        return SavedModel;
    }
    async updateById(bodyFromPage){
        const data = {
            title: bodyFromPage.title, 
            price: parseInt(bodyFromPage.price),
            url: bodyFromPage.url,
            stock: parseInt(bodyFromPage.stock),
            descripcion: bodyFromPage.descripcion
        }
        const idParameter = bodyFromPage.id
        await model.findByIdAndUpdate(idParameter,data);
        return `producto con id: ${idParameter} actualizado`

    }
    async deleteById(id){
        return await model.deleteOne({_id:id})
    }
}

module.exports = ContainerMongo;