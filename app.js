// Importo las dependencias al codigo
const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: ioServer} = require('socket.io');
require('dotenv').config();
const {v4 : uuidv4} = require('uuid');
const ChatContainer = require('./src/Containers/containerChats');
const ProdContainer = require('./src/Containers/containerProds');
// Creo clases para utilizar metodos y llamo a metodos de las librerías importadas
const app = express()
const http = new HttpServer(app); //http necesita como parametro las funcionalidades que usaremos en app (express)
const io = new ioServer(http); // Misma idea con socket IO 



app.set('views', "./public");
app.set('view engine', 'ejs')
let allmsgs = []
let allprods = []
app.use(express.static('public'))

Chat = new ChatContainer()
Prod = new ProdContainer()

app.get('/health', (_req,res) => {
    res.status(200).json({
        "success": true,
        "health": "yes"
    })
    
})

app.get('/',(_req,res)=>{
    res.render('index.ejs')
})

io.on('connection', socket => {
    // SOCKETS BACK CHAT

    Chat.getAllMsg().then(data => {
        socket.emit('UPDATE_FROM_USR', data)
    })
    
    socket.on('NEW_MSG_USR', dataChatFromFront => {
        dataChatFromFront
        Chat.addMsg(dataChatFromFront).then(data => {
            Chat.getAllMsg().then(data => {
                io.sockets.emit('NEW_MSG_FROM_BACK',data)
            })
        })
    })
    // SOCKETS BACK PRODUCTOS
    //const allPrd = new DbCall('products')
    //Prod.getAllProds().then(data => {
    //    socket.emit('UPDATE_PROD_FROM_USR', data)
    //})
    //socket.on('NEW_PROD_USR', dataProdFromFront => {
    //    allPrd.uploadtoDB(dataProdFromFront).then(data => {
    //        allPrd.getAllFromDB().then(data => {
    //            io.sockets.emit('NEW_PROD_FROM_BACK',data)
    //        })
    //    })
    //})
})

module.exports = http;

