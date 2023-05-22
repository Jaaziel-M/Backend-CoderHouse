const mongoose = require('mongoose')
const connect = require('../Services/config/connect')
const modelProd = require('../Services/models/product.model')


class ProdContainer {
    constructor(){
        this.connect = connect()
    };
    // METODOS PARA CRUD DE PRODUCTOS  
    async getAllProds(page=0, limit=4) {
        page = parseInt(page);
        limit = parseInt(limit);
        if(limit>4){limit=4};
        let offset = page * limit; // la cuenta acá es, si page es 0, muestra los primeros 4 y conforme page aumente su valor, iremos desplazandonos en el array de datos entregado por la db 
        let prods = await modelProd.find().skip(offset).limit(limit)
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

    async getOneProduct(prodId) {

        try {
            let product = await modelProd.findById(prodId);
            return product
        } catch (error) {
            throw new Error(error)
        }
    }

    async discountStock(prod) {
        const data = await modelProd.findOne({title: prod});
        if (data.stock != 0){
            const newStock = data.stock -1
            const updateStock = await modelProd.findOneAndUpdate({title: prod}, {stock:newStock});
            return true
        }
        return false
    }

    async editOneById(prodId, editedProd) {
        const data = await modelProd.findByIdAndUpdate(prodId,{
            title: editedProd.title,
            price: editedProd.price,
            url: editedProd.url,
            stock: editedProd.stock,
            descripcion: editedProd.descripcion
        });
        console.log(data)
    }

    async addNewProd(newProd) {
        const prodToBeAdded = new modelProd({
            title: newProd.title,
            price: newProd.price,
            url: newProd.url,
            stock: newProd.stock,
            descripcion: newProd.descripcion
        })
        const addProd = await prodToBeAdded.save();  
    }
}
module.exports = ProdContainer;