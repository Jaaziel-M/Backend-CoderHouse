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
//app.use(logger())
let allmsgs = []
let allprods = []
app.use(express.static('public'))

class Msg {
    constructor (){
        this.knex = knex(knexConfig);
    }
    async newMessagetoDB(msg){
        Object.assign(msg, {
            msgtime: Date.now()
        })
        try {
            const upload = await knex('chats').insert(msg)
            return JSON.parse(JSON.stringify(msg))
            //return 'Message uploaded to db'
        } catch (err) {
            console.log(err)
        }
    }

    async getAllFromDB(){
        try {
            const download = await knex('chats').select('*')
            return JSON.parse(JSON.stringify(download))
        } catch (err) {
            console.log(err)
        }
    }
}

// Test to unify all on a single class
//class Db {
//    constructor (opt){
//        this.knex = knex(knexConfig);
//        this.opt = opt;
//
//    }
//    async newMessagetoDB(msg){
//        Object.assign(msg, {
//            msgtime: Date.now()
//        })
//        try {
//            const upload = await knex('chats').insert(msg)
//            return JSON.parse(JSON.stringify(msg))
//            //return 'Message uploaded to db'
//        } catch (err) {
//            console.log(err)
//        }
//    }
//
//    async getAllFromDB(){
//        try {
//            const download = await knex('chats').select('*')
//            return JSON.parse(JSON.stringify(download))
//        } catch (err) {
//            console.log(err)
//        }
//    }
//}
class Prd {
    constructor (){
        this.knex = knex(knexConfig);
    }
    async newProdtoDB(prd){
        Object.assign(prd, {
            id: uuidv4()
        })
        try {
            const upload = await knex('products').insert(prd)
            return JSON.parse(JSON.stringify(prd))
            //return 'Message uploaded to db'
        } catch (err) {
            console.log(err)
        }
    }

    async getAllProdFromDB(){
        try {
            const download = await knex('products').select('*')
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
    //res.sendFile('index.html',{root: __dirname}) // con el root declaramos la ruta absoluta entonces SI ejecutamos este archivo node, siempre buscará a Index en el directorio public/index de esta carpeta
    res.render('index.ejs')
})

io.on('connection', socket => {
    // SOCKETS BACK CHAT
    const allMsg = new Msg()
    allMsg.getAllFromDB().then(data => {
        socket.emit('UPDATE_FROM_USR', data)
    })
    
    socket.on('NEW_MSG_USR', dataChatFromFront => {
        const newMsg = new Msg()
        newMsg.newMessagetoDB(dataChatFromFront).then(data => {
            console.log(data)
            newMsg.getAllFromDB().then(data => {
                io.sockets.emit('NEW_MSG_FROM_BACK',data)
            })
        })
    })
    // SOCKETS BACK PRODUCTOS
    const allPrd = new Prd()
    allPrd.getAllProdFromDB().then(data => {
        socket.emit('UPDATE_PROD_FROM_USR', data)
    })
    socket.on('NEW_PROD_USR', dataProdFromFront => {
        //const newMsg = new Prd()
        allPrd.newProdtoDB(dataProdFromFront).then(data => {
            //console.log(data)
            allPrd.getAllProdFromDB().then(data => {
                io.sockets.emit('NEW_PROD_FROM_BACK',data)
            })
        })
    })

    //socket.emit('UPDATE_PROD_FROM_USR', allprods)
    //socket.on('NEW_PROD_USR', dataProdFromFront => {
    //    const newProd = dataProdFromFront
    //    // acá guardo la data del front en un array 
    //    allprods.push(newProd)
    //    io.sockets.emit('NEW_PROD_FROM_BACK',allprods[parseInt(allprods.length)-1])
    //})
})




//En este caso para que funcione si esporto app, no sirve. Debo exportar http
module.exports = http;

