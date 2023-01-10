const express = require('express');
const router = express.Router();
router.use(express.json())
router.use(express.urlencoded({extended:true}))
require('dotenv').config();

router.get('/',(req,res)=>{
    res.render('login.ejs')
});

router.post('/',(req,res)=>{
    res.cookie('username',req.body.username,{ maxAge: 60000, signed: true }).redirect('/')
});


module.exports = router