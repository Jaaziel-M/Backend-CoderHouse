require('dotenv').config();

const http = require('./app');
const Puerto = process.env.PORT || process.env.PORT2 
http.listen(Puerto, ()=> {
    console.info(`Conectado en el puerto ${Puerto}`)
})

