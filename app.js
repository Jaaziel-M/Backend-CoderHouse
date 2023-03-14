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
//      Mongo
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const modelAuth = require('./src/Services/models/authModels')

const mail = require('./src/Services/config/mail').transport

app.use(cookieParser(COOKIE_SECRET))
app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ac-oxnem7u-shard-00-00.biltcc2.mongodb.net:27017,ac-oxnem7u-shard-00-01.biltcc2.mongodb.net:27017,ac-oxnem7u-shard-00-02.biltcc2.mongodb.net:27017/?ssl=true&replicaSet=atlas-14mqtq-shard-0&authSource=admin&retryWrites=true&w=majority`,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
    },
    {
    secret: COOKIE_SECRET,
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        secure: false
        //maxAge: 1000
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

app.get('/logout',(req,res)=>{
    req.logout(()=> {
        res.redirect('/login');
    })
})

app.get('/signin',(req,res)=>{
    // if con res.redirect.isAuth para proteger rutas
    res.redirect('/signin')
})

app.get('/login',(req,res)=>{
    // if con res.redirect.isAuth para proteger rutas
    res.redirect('/login')
})


////////////PASSPORT 

passport.use('login', new LocalStrategy(async (mail, password, done) => {
    //      TRAIGO EL USUARIO DESDE MONGO
    const userData = await modelAuth.findOne({ mail, password: md5(password) })
    if (!userData) {
        // DONE ES EL CALLBACK
        try {
            return done(null, false);
        } catch (error) {
            console.log(error)
        }
        
    }
    done(null, userData)
}))
// {passReqToCallback: true},
passport.use('signin', new LocalStrategy( async (req, username, mail, password, direccion, direccionNum, edad, tel, url, done) => {

    const userData = await modelAuth.findOne({ username, password: md5(toString(password)) })
    if (userData) {
        return done(null,false);
    }
    
    const stageUser = new modelAuth({
        nombre: toString(username),
        email: toString(mail),
        password: md5(toString(password)),
        direccion: md5(toString(direccion)),
        dirNum: md5(toString(direccionNum)),
        edad: md5(toString(edad)),
        tel: md5(toString(tel)),
        url: md5(toString(url))
    });
    const newUser = await stageUser.save();
    
    try {
        mail.sendMail(
            {
                from : 'Airsoft shop account',
                to : toString(mail),
                subject : 'Bienvenido/a a  Airsoft shop!',
                html : `<h1>Hola!</h1><h2>Gracias por crearte una cuenta, te dejamos //los datos ingresados a continuacion:</h2><h3>Nombre: ${username}<///h3>Dirección: ${direccion}<h3>Edad: ${edad}</h3>Telefono de contacto: //${tel}<h3>Foto: ${url}</h3><h4>Gracias por elegirnos! </h4>`
            }
        ).then(items=>{console.log(items);done(null, newUser)})
    } catch (error) {
        console.log(error)
    }    
    done(null, newUser)
}

));

passport.serializeUser((user, done)=>{
    done(null, user._id);
})
passport.deserializeUser(async (id, done)=>{
    const userData = await modelAuth.findById(id);
    done(null,userData);
})
app.use(passport.initialize());
app.use(passport.session());
/////////////////////

module.exports = http;

