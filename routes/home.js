const express = require('express');
const router = express.Router();
const authMw = require('../middlewares/authMw')
const ProdContainer = require('../src/Containers/containerProds')
const mail = require('../src/Services/config/mail')
router.use(express.json());
router.use(express.urlencoded({extended:true}));
const productos = new ProdContainer()
const cookieParser = require('cookie-parser')
const COOKIE_SECRET = process.env.COOKIE_SECRET

const cart = [] 
router.use(cookieParser(COOKIE_SECRET))
router.get('/mykart',(req,res)=>{
    res.render('kart.ejs',{cart})
})
router.post('/mykart',(req,res)=>{
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
    
})
router.get('/',(req,res)=>{res.redirect('home/0')})
router.get('/:id',(req,res)=>{
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
