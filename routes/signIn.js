const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const connect = require('../src/Services/config/connect')
const modelAuth = require('../src/Services/models/authModels')

const md5 = require('md5')
connect()
router.use(express.json())
router.use(express.urlencoded({extended:true}))
require('dotenv').config();


router.get('/',(req,res)=>{
    res.render('signIn.ejs')

});

//router.post('/',async (req,res)=>{
//    //res.cookie('username',req.body.username,{ maxAge: 60000, signed: true }).redirect('/')
//    const {username, mail, password} = req.body
//
//    try {
//        if(username != undefined && mail != undefined && password != undefined && username != "" && mail != "" && password != ""){
//            const result = await modelAuth.find({email:mail, password:md5(password)})
//            
//            if(JSON.stringify(result) != "[]"){
//                console.log(result)
//                return res.render('errorSignIn.ejs')
//            }
//            const data = {
//                nombre: username,
//                email: mail,
//                password: md5(password)
//            }
//            
//            const model = new modelAuth(data);
//            
//            await model.save();
//            console.log(req.body)
//            return res.json({
//                "usuario": username,
//                "email": mail,
//                "contraseña": password
//            })
//        }
//        res.render('errorSignIn.ejs')
//    } catch (error) {
//        console.log(error)
//    }
//
//});


router.post('/',passport.authentication('signup',{failureRedirect: '/error'}),async (req,res)=>{
    console.log(req.user);
    res.render('index.ejs',{username})
})


module.exports = router