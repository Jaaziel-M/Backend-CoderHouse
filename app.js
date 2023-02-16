// Importo las dependencias al codigo
const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: ioServer} = require('socket.io');
require('dotenv').config();
const {v4 : uuidv4} = require('uuid');
const ChatContainer = require('./src/Containers/containerChats');
const ProdContainer = require('./src/Containers/containerProds');
const login = require('./routes/login')
const signIn = require('./routes/signIn')
const app = express()
const http = new HttpServer(app); 
const io = new ioServer(http); 
const cookieParser = require('cookie-parser')
const session = require('express-session');
const COOKIE_SECRET = process.env.COOKIE_SECRET
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const { Strategy } = require('passport-local');
const info = require('./routes/info');
const random = require('./routes/random')
const compression = require('compression')
const logger = require('pino')('./logs.log')

app.use(compression())
app.use(cookieParser(COOKIE_SECRET))
app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ac-oxnem7u-shard-00-00.biltcc2.mongodb.net:27017,ac-oxnem7u-shard-00-01.biltcc2.mongodb.net:27017,ac-oxnem7u-shard-00-02.biltcc2.mongodb.net:27017/?ssl=true&replicaSet=atlas-14mqtq-shard-0&authSource=admin&retryWrites=true&w=majority`,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
    },
    {
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
    })}))

app.set('views', "./public");
app.set('view engine', 'ejs')
let allmsgs = []
let allprods = []
app.use(express.static('public'))
app.use('/login',login)
app.use('/signin',signIn)
app.use('/info',info)
app.use('/random',random)

Chat = new ChatContainer()
Prod = new ProdContainer()

////////////PASSPORT 
router.use(passport.initialize());
router.use(passport.session());
passport.use('login', new LocalStrategy(async (email, password, done) => {
    //      TRAIGO EL USUARIO DESDE MONGO
    const userData = await modelAuth.findOne({ email, password: md5(password) })
    if (!userData) {
        // DONE ES EL CALLBACK
        return done(null, false);
    }
    done(null, userData)
}))

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, mail, done) => {
    const userData = await modelAuth.findOne({ username, password: md5(password) })
    if (userData) {
        return done(null, false)
    }
    const stageUser = new UserModel({
        nombre: username,
        email: mail,
        password: md5(password)
    });
    const newUser = await stageUser.save();
    done(null, newUser)
}

));

passport.serializeUser((user, done)=>{
    done(null, user._id);
})
passport.deserializeUser(async (id, done)=>{
    const useData = await UserModel.findById(id);
    done(null,userData);
})
/////////////////////


app.get('/health', (_req,res) => {
    logger.info("GET - /health - 200")
    res.status(200).json({
        "success": true,
        "health": "yes"
    })
    
})

app.get('/',(req,res)=>{
    logger.info("GET - / - 200")
    const username = req.signedCookies.username
    if(req.signedCookies.username != undefined){
        return res.render('index.ejs',{username})
    }
    req.session.destroy(error => {
        if(!error){
            
            return res.redirect('/login')
        }
    })
})
//app.get('/logout',(req,res)=>{
//    const username = req.signedCookies.username
//    
//    return req.session.destroy(error => {
//        if(!error){
//            return res.cookie('username',username,{ maxAge: 0, signed: true }).render('logout.ejs',{username})
//        } 
//    })
//})
app.get('/logout',(req,res)=>{
    logger.info("GET - /logout - 200")
    req.logout(()=> {
        res.redirect('/login');
    })
})

app.get('/signin',(req,res)=>{
    logger.info("GET - /signin - 200")
    // if con res.redirect.isAuth para proteger rutas
    res.redirect('/signin')
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

module.exports = app;

