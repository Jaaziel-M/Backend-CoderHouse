const express = require('express');
const router = express.Router();
const {carrito, CarritoClass} = require('../src/routes/carrito')
const {productos, ProductsClass} = require('../src/routes/productos')
const ProdSvc = require('../src/index')
const fs = require('fs');




const GetDataPrd = async () => {
    let contentDB = await fs.promises.readFile('./src/storagefiles/db.json','utf-8')

    return contentDB
}
const GetDataCrr = async () => {
    let contentDB2 = await fs.promises.readFile('./src/storagefiles/db2.json','utf-8')

    return contentDB2
}



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
            data.updateById(bodyparsed).then(data => {
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
            data.deleteById(body).then(data => {
                res.json(data)
            })
        })
    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})

router.use('/api/productos',productos)
router.use('/api/carrito', carrito)


module.exports = router;