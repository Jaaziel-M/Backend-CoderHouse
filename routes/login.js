const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const connect = require('../src/Services/config/connect')
const modelAuth = require('../src/Services/models/authModels')
const md5 = require('md5')


connect()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
require('dotenv').config();

router.get('/', (req, res) => {
    res.render('login.ejs')
});




//router.post('/', async (req, res) => {
//    const { mail, password } = req.body
//    const result = await modelAuth.find({ email: mail, password: md5(password) })
//    if (JSON.stringify(result) == "[]" || JSON.stringify(result) == undefined) {
//        return res.render('errorLogIn.ejs')
//    }
//    return res.json(result)
//    //res.cookie('username',req.body.username,{ maxAge: 60000, signed: true }).redirect('/')
//
//});
router.post('/',passport.authenticate('signin', {failureRedirect: '/error'}),async(req,res)=>{
    console.log(req.user);
    res.render('index.ejs',{username})
})
module.exports = router