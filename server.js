require('dotenv').config()

const app = require('./app');
const Puerto = process.env.PORT || process.env.PORT2 
app.listen(Puerto, ()=> {
    console.info(`Conectado en el puerto ${Puerto}`)
})

