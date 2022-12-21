const mongoose = require('mongoose')
const connect = require('../Services/config/connect')
const modelProd = require('../Services/models/product.model')


class ProdContainer {
    constructor(){
        this.connect = connect()
    };
    // METODOS PARA CRUD DE PRODUCTOS  
    async getAllProds() {
        page = parseInt(page);
        limit = parseInt(limit);
        let prods = await modelProd.find()
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
        const SaveModel = new modelProd(data);
        const SavedModel = await SaveModel.save();
        return SavedModel;
    }


}
module.exports = ProdContainer;