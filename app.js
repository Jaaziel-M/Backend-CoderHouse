// Importo las dependencias al codigo
const express = require('express');
require('dotenv').config();
const md5 = require('md5')
const app = express()
const cookieParser = require('cookie-parser');
const session = require('express-session');
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const passport = require('passport');
//const { Strategy } = require('passport-local');
const LocalStrategy = require('passport-local').Strategy;

//  Mongodb
const mongoose = require('mongoose');
const connect = require('./src/services/config/mongo-connection');
connect()
const MongoStore = require('connect-mongo');
const ModelAuth = require('./src/services/models/model-auth')
// Routes
const error = require('./src/routes/error');
const home = require('./src/routes/home');
const login = require('./src/routes/login');
const signin = require('./src/routes/signin');
const logout = require('./src/routes/logout');

//
app.use(cookieParser(COOKIE_SECRET))

//  Route to views folder and ejs files
app.set('views', "./public");
app.set('view engine', 'ejs')
app.use(express.static('public'))

//  Session config with mongodb, IMPORTANT! WE MUST DEFINE APP SESSION BEFORE THE app.use('/error', error), .... otherwise it wont work 
app.use(session(
    {
        store: MongoStore.create({
            mongoUrl: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ac-oxnem7u-shard-00-00.biltcc2.mongodb.net:27017,ac-oxnem7u-shard-00-01.biltcc2.mongodb.net:27017,ac-oxnem7u-shard-00-02.biltcc2.mongodb.net:27017/?ssl=true&replicaSet=atlas-14mqtq-shard-0&authSource=admin&retryWrites=true&w=majority`,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
        }),
        secret: COOKIE_SECRET,
        rolling: true,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: false,
            secure: false
            //maxAge: 1000
        }
    }))
//



app.get('/health', (_req,res) => {
    res.status(200).json({
        "success": true,
        "health": "yes"
    })
})

app.use('/error', error)
app.use('/home', home)
app.use('/signin', signin)
app.use('/login', login)

//  get to all our routes
app.get('/error', (req,res)=>{res.redirect('/error')})
app.get('/home', (req,res)=>{res.redirect('/home')})
app.get('/login', (req,res)=>{res.redirect('/login')})
app.get('/signin', (req,res)=>{res.redirect('/signin')})
//

/////////////////////////   Passport config 


//  Login function
passport.use('login', new LocalStrategy(async (username, password, done) => {
    //console.log(password);
    //console.log(md5(password))
    const userData = await ModelAuth.findOne({username, password: md5(password)});
    console.log(userData)
    if(!userData){
        console.log("errpr")
        return done(null, false)
    }
    done(null, userData)
}))
//  Signin function
passport.use('signin', new LocalStrategy({passReqToCallback: true}, async (req, username, password, done) => {
    console.log(username)
    const userData = await ModelAuth.findOne({username, password: md5(password)})
    console.log(userData)
    if(userData){
        return done(null,false);
    }
    const addNewUser = new ModelAuth({
        username,
        password: md5(password),
        email: req.body.email
    })
    const saveUserToDb = await addNewUser.save();
    done(null, saveUserToDb)
}))

passport.serializeUser((user, done)=>{done(null,user._id)});
passport.deserializeUser(async (id, done)=>{
    const userData = await ModelAuth.findById(id);
    done(null,userData)
})
app.use(passport.initialize());
app.use(passport.session());
// debemos llamar a logout despues de toda la config de passport
app.use('/logout', logout)

////////////////////////////////// 
//  Use to get all the routes


module.exports = app;

