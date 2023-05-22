const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const {Server: HttpServer} = require('http');
const {Server: ioServer} = require('socket.io');
const cookieParser = require('cookie-parser')
const COOKIE_SECRET = process.env.COOKIE_SECRET
const chatContainer = require('../src/Containers/containerChat')
const Chat = new chatContainer();
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.use(cookieParser(COOKIE_SECRET))
const http = new HttpServer(router); //http necesita como parametro las funcionalidades que usaremos en app (express)
const io = new ioServer(http); // Misma idea con socket IO 


router.get('/',(req,res)=>{
    res.render('chat.ejs')
})


module.exports = router