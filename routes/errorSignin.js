const express = require('express');
const router = express.Router();
router.get('/', (req,res)=>{
    res.render('errorSignIn.ejs')
})

module.exports = router