const express = require('express');
const router = express.Router();
const { fork } = require('child_process')
router.use(express.urlencoded({extended:true}))
router.use(express.json())

router.get('/', (req,res) => {
    const argumentos = req.query.num
    if(req.query.num == undefined){
        argumentos == 5e8
    }
    const subprocess = fork('./routes/randomCalc.js')
    subprocess.send(toString(subprocess))
    subprocess.on("message",(message)=>{
        console.log(message)
        res.send(`<h1>Usted está en la ruta random, parametros: ${message} </h1>`)})
})

module.exports = router
