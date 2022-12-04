const admin = require("firebase-admin")

class ContainerFirebase {
    constructor(db, query){
        this.db = db;
        this.query = query;
    };
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
            if (id != "") {
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
    async updateById(bodyFromPage){
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
    async deleteById(id){
        try {
            console.log(id)
            let doc = this.query.doc(id.id)
            const dataToBeDeleted = await doc.delete()
            return `producto con id ${id.id} exitosamente eliminado`
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = ContainerFirebase;