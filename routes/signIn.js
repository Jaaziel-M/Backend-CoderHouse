const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const connect = require('../src/Services/config/connect')
const modelAuth = require('../src/Services/models/authModels')
const passport = require('passport');
const md5 = require('md5')
const cookieParser = require('cookie-parser')
const COOKIE_SECRET = process.env.COOKIE_SECRET

router.use(cookieParser(COOKIE_SECRET))
connect()
router.use(express.json())
router.use(express.urlencoded({extended:true}))
require('dotenv').config();


router.get('/',(req,res)=>{
    res.render('signIn.ejs')
});

router.post('/',passport.authenticate('signin',{failureRedirect: '/errorSignin'}),async (req,res)=>{
    res.cookie("username",req.body.username,"mail",req.body.mail,{signed: true}).redirect('/home')
    
})


module.exports = router