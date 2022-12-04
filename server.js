require('dotenv').config()

const http = require('./app');
const Puerto = process.env.PORT1 || process.env.PORT2
http.listen(Puerto, ()=> {
    console.info(`Conectado en el puerto ${Puerto}`)
})

