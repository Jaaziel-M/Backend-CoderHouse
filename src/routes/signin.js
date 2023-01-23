const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
require('dotenv').config();

router.get('/', (req,res)=>{
    res.render('signin.ejs')
})
router.post('/',passport.authenticate('signin',{failureRedirect:'/error'}), async (req,res)=>{
    console.log(req.user)
    res.redirect('/home')
})

module.exports = router