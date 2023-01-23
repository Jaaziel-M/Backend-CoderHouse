const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
require('dotenv').config();

router.get('/', (req,res)=>{
    res.render('login.ejs')
})
router.post('/', passport.authenticate('login', {failureRedirect: '/error'}) , async (req,res)=>{
    res.redirect('/home')
})


module.exports = router