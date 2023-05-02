const express = require('express');
const session = require('express-session');
const router = express.Router();
const authMw = require('../middlewares/authMw');
const ProdContainer = require('../src/Containers/containerProds')
const mail = require('../src/Services/config/mail')
const productos = new ProdContainer()
const prodModel = require('../src/Services/models/product.model')
const kartModel = require('../src/Services/models/kart.model')
const cookieParser = require('cookie-parser')
const passport = require('passport');
const COOKIE_SECRET = process.env.COOKIE_SECRET
const cart = [] 
router.use(express.json());
router.use(express.urlencoded({extended:true}));
router.use(cookieParser(COOKIE_SECRET))
router.use(passport.session());


//router.get('/mykart', (req,res)=>{
//    res.render('kart.ejs',{cart})
//})
//router.post('/mykart',(req,res)=>{
    try {
        mail.sendMail(
            {
                from : 'Airsoft shop account',
                to : req.body.mail,
                subject : 'Bienvenido/a a  Airsoft shop!',
                html : `<h1>Gracias por tu compra!</h1><h2>A continuación, verás detallados los items elegidos!</h2><h3>${cart}</h3><h4>Gracias por elegirnos! </h4>`
            }
        )
    } catch (error) {
        console.log(error)
    }
    
//})
router.post("/addToKart",async(req,res)=>{
    const username = req.signedCookies.username
    const productToAdd = {
        "product": req.body.product,
        "price": req.body.price
    }
    
    const results = await  kartModel.findOne({user: username})
    
    if (results == null){
        const newKart = new kartModel({
            user: username,
            kart: [productToAdd]
        });
        const addkart = await newKart.save();  
    }
    else{
        await kartModel.findOneAndUpdate({user: username},{$push:{products: productToAdd}})
    }
    //prodModel.findOneAndUpdate({username}, {$push: {"kart": {productToAdd}}})
    res.send('<h1>Producto añadido</h1>')
})

router.get('/',(req,res)=>{res.redirect('home/0')})
router.get('/:id',  (req,res)=>{
    const pages = req.params.id;
    const username = req.signedCookies.username
    productos.getAllProds(page=pages, limit=4).then(DataProds=>{
        res.render('home.ejs', {DataProds, pages, username})
    })
})
router.post('/:id',(req,res)=>{
        console.log(req.params.id)
        cart.push(req.params.id)
    }
)


module.exports = router
