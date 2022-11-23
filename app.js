// Importo las dependencias al codigo
const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: ioServer} = require('socket.io');
require('dotenv').config();
const knexConfig = require('./services/config')
const knex = require('knex')(knexConfig)
const {v4 : uuidv4} = require('uuid')
// Creo clases para utilizar metodos y llamo a metodos de las librerías importadas
const app = express()
const http = new HttpServer(app); //http necesita como parametro las funcionalidades que usaremos en app (express)
const io = new ioServer(http); // Misma idea con socket IO 


app.set('views', "./public");
app.set('view engine', 'ejs')
let allmsgs = []
let allprods = []
app.use(express.static('public'))

class DbCall {
    constructor (opt){
        this.knex = knex(knexConfig);
        this.opt = opt;
        if(opt != 'chats' || opt != 'products'){return "Error, parametro incorrecto. Por favor ingrese chats o products"}
    }

    async uploadtoDB(input){
        if(this.opt == 'chats'){
            Object.assign(input, {
                msgtime: Date.now()
            })
        }if(this.opt == 'products'){
            Object.assign(input, {
                id: uuidv4()
            })
        }
        try {
            const upload = await knex(this.opt).insert(input)
            return JSON.parse(JSON.stringify(input))
        } catch (err) {
            console.log(err)
        }
    }

    async getAllFromDB(){
        try {
            const download = await knex(this.opt).select('*')
            return JSON.parse(JSON.stringify(download))
        } catch (err) {
            console.log(err)
        }
    }
}



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
    const allMsg = new DbCall('chats')
    allMsg.getAllFromDB().then(data => {
        socket.emit('UPDATE_FROM_USR', data)
    })
    
    socket.on('NEW_MSG_USR', dataChatFromFront => {
        allMsg.uploadtoDB(dataChatFromFront).then(data => {
            allMsg.getAllFromDB().then(data => {
                io.sockets.emit('NEW_MSG_FROM_BACK',data)
            })
        })
    })
    // SOCKETS BACK PRODUCTOS
    const allPrd = new DbCall('products')
    allPrd.getAllFromDB().then(data => {
        socket.emit('UPDATE_PROD_FROM_USR', data)
    })
    socket.on('NEW_PROD_USR', dataProdFromFront => {
        allPrd.uploadtoDB(dataProdFromFront).then(data => {
            allPrd.getAllFromDB().then(data => {
                io.sockets.emit('NEW_PROD_FROM_BACK',data)
            })
        })
    })
})

//En este caso para que funcione si esporto app, no sirve. Debo exportar http
module.exports = http;

