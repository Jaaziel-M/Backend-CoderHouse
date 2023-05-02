const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const connect = require('../src/Services/config/connect')
const modelAuth = require('../src/Services/models/authModels')
const passport = require('passport');
const cookieParser = require('cookie-parser')
const COOKIE_SECRET = process.env.COOKIE_SECRET
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.use(cookieParser(COOKIE_SECRET))
const md5 = require('md5')

connect()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
require('dotenv').config();

router.get('/', (req, res) => {
    res.render('login.ejs')
});

router.post('/', passport.authenticate('login', {failureRedirect: '/errorLogin'}), async(req,res)=>{
    res.cookie('username',req.body.username,{ maxAge: 60000, signed: true }).redirect('home/0')
})
module.exports = router