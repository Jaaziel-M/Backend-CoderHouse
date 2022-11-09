require('dotenv').config()

const http = require('./app');
const Puerto = process.env.PORT || 60001
http.listen(Puerto, ()=> {
    console.info(`Conectado en el puerto ${Puerto}`)
})

