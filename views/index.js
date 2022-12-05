const express = require('express');
const router = express.Router();
const {carrito, CarritoClass} = require('../src/routes/carrito')
const {productos, ProductsClass} = require('../src/routes/productos')
const {ProdSvc, KartSvc} = require('../src/index')
const fs = require('fs');
const {v4: uuidv4} = require('uuid')
router.use(express.urlencoded({extended:true}));



const GetDataPrd = async () => {
    let contentDB = await fs.promises.readFile('./src/storagefiles/db.json','utf-8')

    return contentDB
}
const GetDataCrr = async () => {
    let contentDB2 = await fs.promises.readFile('./src/storagefiles/db2.json','utf-8')

    return contentDB2
}


// METODOS RELACIONADOS CON EL CRUD DE LOS PRODUCTOS 

router.get('',(req_,res)=>{
    
    try{
        let DataCarrito = ""
        let DataProds = ""
        GetDataPrd().then(data => {
            DataProds = JSON.parse(data)
            GetDataCrr().then(data => {
                DataCarrito = JSON.parse(data)
                res.render('index.ejs',{DataProds, DataCarrito, router})
            })
        })
    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})
// LISTADO DE PRODUCTOS POR PAGINAS DE A 4
router.get('/api/db/',(req,res)=>{
    const {page, limit} = req.query
    try{
        ProdSvc.then(data => {
            data.getAllProds(page,limit).then(data => {
                res.json(data)
            })
        })
        

    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})
// AÑADIR PRODUCTOS A LA DB
router.post('/api/db/',(req,res) => {
    const { body } = req
    bodyparsed = JSON.parse(JSON.stringify(body))
    try{
        ProdSvc.then(data => {
            data.addProduct(bodyparsed).then(data => {
                res.json(data)
            })
        })
        

    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})
// ACTUALIZAR PRODUCTO POR ID 
router.put('/api/db/',(req,res)=>{
    const { body } = req
    bodyparsed = JSON.parse(JSON.stringify(body))
    try{
        ProdSvc.then(data => {
            data.updateProdById(bodyparsed).then(data => {
                res.json(data)
            })
        })
        

    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})
// ELIMINAR PRODUCTO POR ID 
router.delete('/api/db/',(req,res)=>{
    const { body } = req
    try{
        ProdSvc.then(data => {
            data.deleteProdById(body).then(data => {
                res.json(data)
            })
        })
    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})


// METODOS RELACIONADOS CON EL CRUD DE LOS CARRITOS 

// MUESTRO LOS CARRITOS 
router.get('/api/db/carrito',(req,res)=>{
    const {page, limit} = req.query
    try{
        KartSvc.then(data => {
            data.getAllKarts(page,limit).then(data => {
                res.json(data)
            })
        })
        

    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})

// Crea un carrito y devuelve su id.
router.post('/api/db/carrito',(req,res)=>{
    const { body } = req
    Object.assign(body, {
        id_cart: uuidv4(),
        timestamp: parseInt(Date.now())
    })
    body.productos.forEach(element => {
        Object.assign(element, {timestamp: parseInt(Date.now())})
    });
    bodyparsed = JSON.parse(JSON.stringify(body))
    try{
        KartSvc.then(data => {
            data.createOneKart(bodyparsed).then(data => {
                res.json(data)
            })
        })
    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})

// Vacía un carrito y lo elimina.  el parametro se pasa por query en url
router.delete('/api/db/carrito/:id',(req,res)=>{
    const {id} = req.params
    try{
        KartSvc.then(data => {
            data.deleteKartById(id).then(data => {
                res.json(data)
            })
        })
    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})

// Me permite listar todos los productos guardados en el carrito. El parametro se pasa por url
router.get('/api/db/carrito/:id',(req,res)=>{
    const {id} = req.params
    try{
        KartSvc.then(data => {
            data.getProdsfromKart(id).then(data => {
                res.json(data)
            })
        })
    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})

// Para incorporar productos al carrito por su id de producto. El parametro se pasa por url
router.post('/api/db/carrito/:id_kart/prod/:id_prod',(req,res)=>{
    const id_kart = req.params.id_kart
    const id_prod = req.params.id_prod
    try{
        KartSvc.then(data => {
            data.addToKartById(id_kart, id_prod).then(data => {
                res.json(data)
            })
        })
    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})

// Eliminar un producto del carrito por su id de carrito y de producto
router.delete('/api/db/carrito/:id_kart/prod/:id_prod',(req,res)=>{
    const id_kart = req.params.id_kart
    const id_prod = req.params.id_prod
    try{
        KartSvc.then(data => {
            data.deleteFromKartById(id_kart, id_prod).then(data => {
                res.json(data)
            })
        })
    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})


router.use('/api/local/productos',productos)
router.use('/api/local/carrito', carrito)


module.exports = router;