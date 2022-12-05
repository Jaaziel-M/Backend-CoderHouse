const modelProd =  require('../services/mongo/models/products.model')
const modelKart =  require('../services/mongo/models/kart.model')
const mongoose = require('mongoose')
const {v4: uuidv4} = require('uuid')

class ContainerMongo {
    constructor(connect){
        this.connect = connect
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



    // METODOS PARA CRUD DE CARRITOS 
    async getAllKarts(page=0, limit=4) {
        page = parseInt(page);
        limit = parseInt(limit);
        if(limit>4){limit=4};
        let offset = page * limit; // la cuenta acá es, si page es 0, muestra los primeros 4 y conforme page aumente su valor, iremos desplazandonos en el array de datos entregado por la db 
        let Kart = await modelKart.find().skip(offset).limit(limit)
        return Kart;
    }
    async createOneKart(bodyFromPage){
        try {

            const SaveModel = new modelKart(bodyFromPage);
            const SavedModel = await SaveModel.save();
            return `Carrito ${bodyFromPage.id_cart} creado`;
        } catch (error) {
            throw new Error(error)
        }
    }
    async deleteKartById(id){
        return await modelKart.deleteOne({id_kart:id})
    }
    async addToKartById(id_kart, id_prod){

        try {
            //const prodToAdd = await modelProd.findById(id_prod, {$push: {"timestamp": parseInt(Date.now())} }); // Busca el prod por el id nativo de mongo
            const prodToAdd = await modelProd.findById(id_prod)
            const kartToUpdate = await modelKart.findOneAndUpdate(
                {id_kart: {$eq:id_kart}},
                {$push: {productos : prodToAdd}}
                ); // aca busca por id creado por este backend
            console.log(prodToAdd)

            return `el producto ${id_prod} fue exitosamente agregado al carrito ${id_kart}`
        } catch (error) {
            throw new Error(error)
        }
    }
    async deleteFromKartById(id_kart, id_prod){
        try {
            //const kartToCheck = await modelKart.findById(id_kart)
            //await modelKart.findOne({id_kart: {$eq:id_kart}});
            await modelKart.deleteOne( {$and:[{id_kart: {$eq:id_kart}},{productos: {$eq:id_prod}}]})
            return `el producto ${id_prod} ha sido eliminado del carrito ${id_kart}`
        } catch (error) {
            throw new Error(error)
        }
    }
    async getProdsfromKart(id){
        const KartToShow = await modelKart.findById(id);
        return KartToShow.productos
    }
}

module.exports = ContainerMongo;