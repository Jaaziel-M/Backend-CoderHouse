const express = require('express');
require('dotenv').config();
const app = express()
const indexRoute = require('./views/index')
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('views','./views');
app.use(express.static('./view'));



app.get('/healthcheck',(req_,res)=>{
    try{
        res.status(200).json({
            success:true,
            health: "Good"
        })
    }
    catch(err){
        res.send(`<h1>nope</h1><p>${err}</p>`)
    }
})
app.use('/', indexRoute)

module.exports = app;

