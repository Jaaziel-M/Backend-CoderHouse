// Importo las dependencias al codigo
const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: ioServer} = require('socket.io');
//const logger = require('morgan');
require('dotenv').config();
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
    constructor (mail,ts,msg){
        this.mail = mail;
        this.ts = ts;
        this.msg = msg
    }
    postMsg(fullmsg, arry){
        let time = new Date();
        let mail = fullmsg.mails;
        let txt = fullmsg.messages;
        let mssg = new Msg(mail,time,txt)
        arry.push(mssg)
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
    socket.emit('UPDATE_FROM_USR', allmsgs)
    socket.on('NEW_MSG_USR', dataChatFromFront => {
        // por ahora el mail va a estar harcodeado
        const newMsg = new Msg()
        newMsg.postMsg(dataChatFromFront, allmsgs)
        io.sockets.emit('NEW_MSG_FROM_BACK',allmsgs[parseInt(allmsgs.length)-1])
    })
    // SOCKETS BACK PRODUCTOS
    socket.emit('UPDATE_PROD_FROM_USR', allprods)
    socket.on('NEW_PROD_USR', dataProdFromFront => {
        const newProd = dataProdFromFront
        console.log(`data del front ${dataProdFromFront.name} - ${dataProdFromFront.price} - ${dataProdFromFront.pic}`)
        allprods.push(newProd)
        io.sockets.emit('NEW_PROD_FROM_BACK',allprods[parseInt(allprods.length)-1])
    })
})




//En este caso para que funcione si esporto app, no sirve. Debo exportar http
module.exports = http;

