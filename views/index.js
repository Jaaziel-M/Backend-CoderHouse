const express = require('express');
const router = express.Router();
const {carrito, CarritoClass} = require('../src/routes/carrito')
const {productos, ProductsClass} = require('../src/routes/productos')
const fs = require('fs');
//router.set('views','./views');
//router.set('view engine', 'ejs')



const GetDataPrd = async () => {
    let contentDB = await fs.promises.readFile('./src/storagefiles/db.json','utf-8')
    //let data1 = JSON.parse(content)
    //let data2 = JSON.parse(content)
    return contentDB
}
const GetDataCrr = async () => {
    let contentDB2 = await fs.promises.readFile('./src/storagefiles/db2.json','utf-8')
    //let data1 = JSON.parse(content)
    //let data2 = JSON.parse(content)
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

router.use('/api/productos',productos)
router.use('/api/carrito', carrito)


module.exports = router;