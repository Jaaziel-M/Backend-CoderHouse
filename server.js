require('dotenv').config()

const app = require('./app');
const Puerto = process.env.PORT || 60001
app.listen(Puerto, ()=> {
    console.info(`Conectado en el puerto ${Puerto}`)
})