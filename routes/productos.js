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
    //try {
    //    mail.sendMail(
    //        {
    //            from : 'Airsoft shop account',
    //            to : req.body.mail,
    //            subject : 'Bienvenido/a a  Airsoft shop!',
    //            html : `<h1>Gracias por tu compra!</h1><h2>A continuación, verás detallados los items elegidos!</h2><h3>${cart}</h3><h4>Gracias por elegirnos! </h4>`
    //        }
    //    )
    //} catch (error) {
    //    console.log(error)
    //}
    
//})

//router.post('/',(req,res)=>{
//    try {
//        mail.sendMail(
//            {
//                from : 'Airsoft shop account',
//                to : req.body.mail,
//                subject : 'Bienvenido/a a  Airsoft shop!',
//                html : `<h1>Gracias por tu compra!</h1><h2>A continuación, verás detallados los items elegidos!</h2><h3>${cart}</h3><h4>Gracias por elegirnos! </h4>`
//            }
//        )
//    } catch (error) {
//        console.log(error)
//    }
//    
//})

router.get('/',(req,res)=>{res.redirect('productos/pages/0')})

// Agregar un nuevo producto a la db
router.get('/addprod',(req,res)=>{
    const username = req.signedCookies.username
    
    if(username == "administrator"){
        res.render('productAddNew.ejs')
    }
    else{res.redirect('/error')}
})

router.post('/addprod',(req,res)=>{
    if(req.signedCookies.username == "administrator"){
        const newProd = req.body;
        productos.addNewProd(newProd).then(
            res.render('productAdded.ejs')
        )
    }
    else{res.redirect('/error')}
})

router.get('/:id', (req,res)=>{
    const prodId = req.params.id;
    const username = req.signedCookies.username
    productos.getOneProduct(prodId).then(
        DataProd => {
            if(DataProd == null){res.redirect('/errorDB')}
            else{
                res.render('singleProduct.ejs', {DataProd, username})
            }
        }
    )
})

// Ver producto por id 
router.get('/pages/:id',(req,res)=>{
        const pages = req.params.id;
        const username = req.signedCookies.username
        productos.getAllProds(page=pages, limit=4).then(DataProds=>{
            res.render('productos.ejs', {DataProds, pages, username})
        })
})

// Editar producto por id 
router.post('/item/:id',(req,res)=>{
        const prodId = req.params.id;
        const data = req.body
        productos.editOneById(prodId, data).then(
            res.render('productEdited.ejs')
        )
    }
)







module.exports = router
