const express = require('express');
const router = express.Router();
const Carrito = require('../src/routes/carrito')
const {productos} = require('../src/routes/productos')

router.get('',(req_,res)=>{
    
    try{
        res.sendFile('index.html',{root:__dirname})
    }
    catch(err){
        //aca va el mw
    }
})

router.use('/api/productos',productos)
router.use('/api/carrito',Carrito)


module.exports = router;