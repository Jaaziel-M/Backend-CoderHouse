// Importo las dependencias al codigo
const express = require('express');
require('dotenv').config();
const app = express()
const random = require('./routes/random');
const { fork } = require('child_process')

app.use('/random',random)

app.get('/health', (_req,res) => {
    res.status(200).json({
        "success": true,
        "health": "yes"
    })
    
})

module.exports = app;
