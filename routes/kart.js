const express = require('express');
const session = require('express-session');
const router = express.Router();
const authMw = require('../middlewares/authMw');
const mail = require('../src/Services/config/mail')
const cookieParser = require('cookie-parser')
const KartContainer = require('../src/Containers/containerKart')
const kart = new KartContainer()
const orderContainer = require('../src/Containers/containerOrder')
const order = new orderContainer()
const passport = require('passport');
const ProdContainer = require('../src/Containers/containerProds')
const productos = new ProdContainer()
const prodModel = require('../src/Services/models/product.model')
const COOKIE_SECRET = process.env.COOKIE_SECRET

router.use(express.json());
router.use(express.urlencoded({extended:true}));
router.use(cookieParser(COOKIE_SECRET))
router.use(passport.session());

router.get('/', (req,res)=>{
    try {
        const username = req.signedCookies.username
        kart.getAllKartsFromUser(username).then(
            cart=>{
                res.render('kart.ejs',{cart})
            }
        )
    } catch (error) {
        //res.redirect('/error')
        res.send("<h1>Error</h1>")
    }
})

router.post('/deleteFromKart',(req,res)=>{
    try {
        const username = req.signedCookies.username
        const product = req.body.product
        kart.deleteFromKartById(username,product).then(
            deletedProd => {
                res.send("<h1>Product deleted</h1>")
            }
            
        )
    } catch (error) {
        //res.redirect('/error')
        res.send("<h1>Error</h1>")
    }
})

router.post("/addToKart",(req,res)=>{
    const username = req.signedCookies.username
    const productToAdd = {
        "product": req.body.product,
        "price": req.body.price
    }
    try {
        kart.createOrUpdateKart(productToAdd, username).then(res.render('prodAdded.ejs'))
        
    } catch (error) {
        //res.redirect('/error')
        res.send("<h1>Error</h1>")
    }
    
})

router.post("/comprarTodo",(req,res)=>{
    kart.deleteAndReturnKart(req.signedCookies.username).then(
        deletedData => {
            const cart = []
            const errorCart = []
            deletedData.forEach(element => {
                cart.push(element)
                productos.discountStock(element.product).then(
                    response => {
                        if(response == false){
                            errorCart.push(element.product)
                }})
            });
            order.createOrder(cart,req.signedCookies.username)
            
            res.render('orderCompleted.ejs',{cart, errorCart})
        }
    )
})

module.exports = router
