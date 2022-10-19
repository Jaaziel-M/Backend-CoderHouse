//dependencias
const express = require('express')
const Contenedor = require('./app2')
// Llamada a la clase que lee el txt 
let algo = new Contenedor("novritsch ssp 18", 500, "https://eu.novritsch.com/wp-content/uploads/2020/09/SSP18-Full-Kit-Silver-1024x721.jpg")
txtData = algo.getAll()


//Ejecución del express: 

const app = express()
require('dotenv').config()

app.get('/productos',(_req,res) => {
    res.send(
        (`${JSON.stringify(txtData)}`)
    )
})

app.get('/productoRandom',(_req,res) => {
    res.send(
        (algo.getByID(Math.floor(Math.random() * 4)+1))
    )
})

const Puerto = process.env.PORT || 60001
app.listen(Puerto, ()=> {
    console.log("conectado")
})


