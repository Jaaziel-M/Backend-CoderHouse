const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser')
const session = require('express-session');
const { dirname } = require('path');
router.use(express.json())
router.use(express.urlencoded({extended:true}))
require('dotenv').config();
const COOKIE_SECRET = process.env.COOKIE_SECRET


router.use(cookieParser(COOKIE_SECRET))
router.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true
}))
router.use(cookieParser(COOKIE_SECRET))
router.get('/',(req,res)=>{
    //res.sendFile('/routes/login.html',{root: dirname(__dirname)})
    res.render('login.ejs')
});

router.post('/',(req,res)=>{
    res.cookie('username',req.body.username,{ maxAge: 60000, signed: true }).redirect('/')
});


module.exports = router