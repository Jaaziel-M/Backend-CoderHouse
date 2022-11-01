const express = require('express')

const prod = require('./src/services/product.object')
require('dotenv').config()
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('views', "./views");
app.set('view engine', 'ejs')


app.get('/',(_req,res)=>{
    res.render('pages/index')
    
});
app.post('/productos',(req,res)=>{
    const { nombre, precio, url } = req.body
    const productito = new prod()
    productito.SaveProducts({nombre, precio, url})
    res.render('pages/table', {productos: productito.ShowProd()})
});

app.get('/productos',(_req,res)=>{
    const productito = new prod()
    res.render('pages/table', {productos: productito.ShowProd()})
});

module.exports = app; 