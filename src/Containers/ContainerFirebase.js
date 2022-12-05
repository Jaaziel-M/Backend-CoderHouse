const { response } = require("express");
const admin = require("firebase-admin")
const {v4: uuidv4} = require('uuid');
const productos = require("../routes/productos");
class ContainerFirebase {
    constructor(db, query){
        this.db = db;
        this.query = query;
    };

    // METODOS PARA CRUD DE PRODUCTOS
    async getAllProds(){
        try {
            const querySnapshot = await this.query.get()
            let docs = querySnapshot.docs;
            // como firestore es horrible, me escupe banda de metadata sin pedirla, es por eso que metemos este map 
            const response = docs.map((doc) => ({
                id: doc.id,
                title: doc.data().title,
                price: doc.data().price,
                stock: doc.data().stock,
                url: doc.data().url,
                descripcion: doc.data().descripcion
            }))
            return response

        } catch (error) {
            throw new Error(error)
        }
    }
    async addProduct(bodyFromPage){
        try {
            let id = uuidv4()
            if (bodyFromPage.id != "") {
                id = bodyFromPage.id
            }
            let doc = this.query.doc(id)
            console.log(bodyFromPage.id)
            await doc.create({
                id: id,
                title: bodyFromPage.title, 
                price: parseInt(bodyFromPage.price),
                url: bodyFromPage.url,
                stock: parseInt(bodyFromPage.stock),
                descripcion: bodyFromPage.descripcion
            })
            return `producto con id: ${id} creado!`
        } catch (error) {
            throw new Error(error) 
            
        }
    }
    async updateProdById(bodyFromPage){
        try {
            const id = bodyFromPage.id;
            let doc = this.query.doc(id)
            let dataUpdated = await doc.update(
                {
                    id: id,
                    title: bodyFromPage.title, 
                    price: parseInt(bodyFromPage.price),
                    url: bodyFromPage.url,
                    stock: parseInt(bodyFromPage.stock),
                    descripcion: bodyFromPage.descripcion
                }
            )
            return `el producto con id: ${id} ha sido actualizado satisfactoriamente`
        } catch (error) {
            throw new Error(error)
        }
    }
    async deleteProdById(id){
        try {
            console.log(id)
            let doc = this.query.doc(id.id)
            const dataToBeDeleted = await doc.delete()
            return `producto con id ${id.id} exitosamente eliminado`
        } catch (error) {
            throw new Error(error)
        }
    }


    // METODOS PARA CRUD DE CARRITOS 
    async getAllKarts() {
        try {
            const querySnapshot = await this.query.get()
            let docs = querySnapshot.docs;
            // firestore me devuelve  metadata sin pedirla, es por eso que metemos este map 
            const response = docs.map((doc) => ({
                id_kart: doc.id_kart,
                timestamp: doc.data().timestamp,
                productos: doc.data().productos
            }))
            return response

        } catch (error) {
            throw new Error(error)
        }
    }
    async createOneKart(bodyFromPage){
        try {
            let doc = this.query.doc(bodyFromPage.id_cart)
            await doc.create({
                id_cart: bodyFromPage.id_cart,
                timestamp: bodyFromPage.timestamp, 
                productos: bodyFromPage.productos
            })
            return `producto con id: ${bodyFromPage.id_cart} creado!`
        } catch (error) {
            throw new Error(error) 
        }
    }
    async deleteKartById(id){
        try {
            console.log(id)
            let doc = this.query.doc(id)
            const dataToBeDeleted = await doc.delete()
            return `producto con id ${id} exitosamente eliminado`
        } catch (error) {
            throw new Error(error)
        }
    }
    async addToKartById(id_kart, id_prod){
        try {
            let searchParam =  this.query.doc(id_kart)
            let item = await searchParam.get()
            let allDataFromKart =  item.data()
            let searchParam2 =  admin.firestore().collection('productos').doc(id_prod)
            let item2 = await searchParam2.get()
            
            //allDataFromKart.productos.push(item2.data())
            allDataFromKart.productos.push(item2.data())
            const newProds = allDataFromKart.productos
            console.log(newProds)
            await searchParam.update(
                {productos: newProds}
            )
            return `el producto con id: ${id_kart} ha sido actualizado satisfactoriamente`
        } catch (error) {
            throw new Error(error)
        }
    }
    async deleteFromKartById(id_kart, id_prod){
        try {
            let searchParam =  this.query.doc(id_kart)
            let item = await searchParam.get()
            let allDataFromKart =  item.data()
            let i = 0
            allDataFromKart.productos.forEach(element => {
                if (element.id == id_prod){
                    allDataFromKart.productos.splice(i,1)
                }
                i++
            });
            
            const newProds = allDataFromKart.productos

            await searchParam.update(
                {productos: newProds}
            )
            return `el producto con id: ${id_kart} ha sido actualizado satisfactoriamente`
        } catch (error) {
            throw new Error(error)
        }
    }
    async getProdsfromKart(id){
        let searchParam =  this.query.doc(id)
        let item = await searchParam.get()
        return item.data().productos
    }
}

module.exports = ContainerFirebase;