// Importo las dependencias al codigo
const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: ioServer} = require('socket.io');
require('dotenv').config();
const {v4 : uuidv4} = require('uuid');
const ProdContainer = require('./src/Containers/containerProds');
const login = require('./routes/login')
const signIn = require('./routes/signIn')
const errorSI = require('./routes/errorSignin');
const errorLI = require('./routes/errorLogin');
const carrito = require('./routes/kart')
const home = require('./routes/home')
const md5 = require('md5')
const app = express()
const http = new HttpServer(app); 
const io = new ioServer(http); 
const cookieParser = require('cookie-parser')
const session = require('express-session');
const COOKIE_SECRET = process.env.COOKIE_SECRET
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const modelAuth = require('./src/Services/models/authModels')
const mail = require('./src/Services/config/mail').transport
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(COOKIE_SECRET))
app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ac-oxnem7u-shard-00-00.biltcc2.mongodb.net:27017,ac-oxnem7u-shard-00-01.biltcc2.mongodb.net:27017,ac-oxnem7u-shard-00-02.biltcc2.mongodb.net:27017/?ssl=true&replicaSet=atlas-14mqtq-shard-0&authSource=admin&retryWrites=true&w=majority`,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
    },
    {
    secret: COOKIE_SECRET,
    rolling: true,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 1000
    }
    })}))

app.set('views', "./public");
app.set('view engine', 'ejs')
let allmsgs = []
let allprods = []
app.use(express.static('public'))
app.use('/home',home)
app.use('/login',login)
app.use('/signin',signIn)
app.use('/errorSignin',errorSI)
app.use('/errorLogin',errorLI)
app.use('/carrito',carrito)
Prod = new ProdContainer()



//         HTTP METHODS 
app.get('/errorSignin',(_req,res)=>{
    res.redirect('/errorSignin')
})

app.get('/errorLogin',(_req,res)=>{
    res.redirect('/errorLogin')
})

app.get('/health', (_req,res) => {
    mail()
    res.status(200).json({
        "success": true,
        "health": "yes"
    })
    
})

app.get('/',(req,res)=>{
    //const username = req.signedCookies.username
    //if(req.signedCookies.username != undefined){
    //    return res.redirect('/home')
    //}
    //req.session.destroy(error => {
    //    if(!error){
    //        return res.redirect('/login')
    //    }
    //})
    res.redirect('/home')
})

app.get('/signin',(req,res)=>{
    //if(req.session.isAuth){
    //    res.redirect('/home')
    //}
    res.redirect('/signin')
})

//app.post('/carrito/add',(req,res)=>res)

app.get('/login',(req,res)=>{
    //if(req.session.isAuth){
    //    res.redirect('/home')
    //}
    res.redirect('/login')
})

// Authentication and login

passport.use('signin', new LocalStrategy({passReqToCallback: true}, async (req, username, password, done) => {
    const userData = await modelAuth.findOne({username, password: md5(toString(password)) })
    if (userData) {
        return done(null, false);
    }
    
    const stageUser = new modelAuth({
        nombre: username,
        email: req.body.mail,
        password: md5(password),
        direccion: req.body.direccion,
        dirNum: req.body.direccionNum,
        edad: req.body.edad,
        tel: req.body.tel,
        url: req.body.url
    });
    const newUser = await stageUser.save();  
    return done(null, newUser)
}

));
passport.use('login', new LocalStrategy(async (username, password, done) => {
    const userData = await modelAuth.findOne({username ,password: md5(password)})
    if (!userData) {
        return done(null, false);
    }
    done(null, userData)
}))
passport.serializeUser((user, done)=>{
    done(null, user._id);
})
passport.deserializeUser(async (id, done)=>{
    const userData = await modelAuth.findById(id);
    done(null,userData);
})
app.use(passport.initialize());
app.use(passport.session());

app.get('/logout',(req,res)=>{
    req.logout(()=> {
        res.redirect('/login');
    })
})

module.exports = http;

