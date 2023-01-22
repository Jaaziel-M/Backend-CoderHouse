// Importo las dependencias al codigo
const express = require('express');
require('dotenv').config();
const {v4 : uuidv4} = require('uuid');
const app = express()
const cookieParser = require('cookie-parser')
const session = require('express-session');
const COOKIE_SECRET = process.env.COOKIE_SECRET
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const { Strategy } = require('passport-local');
// Routes
const error = require('./src/routes/error')
const home = require('./src/routes/home')
const login = require('./src/routes/login')
const signin = require('./src/routes/signin')
//
app.use(cookieParser(COOKIE_SECRET))

//  Route to views folder and ejs files
app.set('views', "./public");
app.set('view engine', 'ejs')
app.use(express.static('public'))

//  Use to get all the routes
app.use('/error', error)
app.use('/home', home)
app.use('/signin', signin)
app.use('/login', login)

app.get('/health', (_req,res) => {
    res.status(200).json({
        "success": true,
        "health": "yes"
    })
})

//  get to all our routes
app.get('/error', (req,res)=>{res.redirect('/error')})
app.get('/home', (req,res)=>{res.redirect('/home')})
app.get('/login', (req,res)=>{res.redirect('/login')})
app.get('/signin', (req,res)=>{res.redirect('/signin')})

module.exports = app;

