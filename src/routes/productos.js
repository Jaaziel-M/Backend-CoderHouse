const express = require('express');
const router = express.Router();

let productos = [
    {
        "title": "LaFerrari",
        "precio": 10000000000,
        "id": 1
    },
    {
        "title": "Dodge viper SRT",
        "precio": 100000000,
        "id": 2
    }
];
let err = {"error":"producto no encontrado"}

router.get('/',(_req,res) =>{
    try{
        res.status(200).json(
            {
                success: true,
                data: productos
            })
    }
    catch(err){
    res.status(500).json(
        {
        success: false,
        data: err
        })
    }
})


router.get('/:id',(req,res) =>{
    try{
        const { id } = req.params; // es lo mismo que colocar const id = req.params.id
        const filteredById = productos.filter(i => i.id == id)
        if(filteredById.length != 0){
            res.status(200).json(
                {
                    success: true,
                    data: filteredById
                }
            )
        }else{
            JSON.parse(res.send(err))
        }
    }
    catch(err){
        res.status(500).json(
        {
            success: false,
            data: err
        })
    }
})

router.post('/',(req,res) => {
    try{
        const { body } = req; // desestructuración igual que en el metodo de mas arriba
        body.id = productos.length+1
        productos.push(body);
        res.status(200).json(
            {
                success: true,
                data: body
        })
    }
    catch(err){
        res.status(500).json(
            {
            success: false,
            data: err
            })
    }

})

router.put('/:id',(req,res) => {
    try{
        const { id } = req.params;
        const { body } = req;
        productos.forEach(element => {
            if(element.id == id){
                productos.splice(((parseInt(id))-1),1)
            }
        });
        body.id = parseInt(id);
        productos.push(body);
        res.status(200).json(
            {
                success: true,
                data: body
        })
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;