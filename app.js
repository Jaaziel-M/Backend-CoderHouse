const express = require('express')
const indexRoute = require('./src/routes/index')
require('dotenv').config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))



const Puerto = process.env.PORT || 60001
app.listen(Puerto, ()=> {
    console.log("conectado")
})
app.use(express.static('./public'));
app.use('/api', indexRoute)
module.exports = app; 