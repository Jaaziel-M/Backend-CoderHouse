const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser');
//const { application } = require('express');
const app = express()

app.use(express.json());
require('dotenv').config();

const COOKIE_SECRET = process.env.COOKIE_SECRET
app.use(cookieParser(COOKIE_SECRET))

app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true
}))

app.get('/',(_req,res)=>{
    res.status(200).json({
        "success":true,
        "health":"yes" 
    })
})



app.post('/login',(req,res)=>{
    const {usr, pss} = req.body;
    const usuario = "admin";
    const password = "pass";
    // solo pongo el caso exitoso estoy probando nomas! 
    console.log(req.body)
    if (usuario == usr && password == pss){
        res.cookie('SessionTime','expiration',{ maxAge: 5000, signed: true });
        return res.status(200).json({
            "success": true,
            "message":"Te logueaste!"
        })
    }
})

app.get('/show',(req,res)=>{
    //if(req.signedCookies.SessionTime){
    //    res.status(200).json({
    //        "success":false,
    //        "message":"Seguís logueado maquinola!"
    //    })
    //}
    //if(!req.signedCookies.SessionTime){
    //    res.status(200).json({
    //        "success":false,
    //        "message":"La sesión expiró titan! logueate nuevamente!"
    //    })
    //}
    
})

module.exports = app;