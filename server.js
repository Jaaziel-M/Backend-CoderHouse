require('dotenv').config()
const yargs = require('yargs/yargs')(process.argv.slice(2))
const args = yargs.default({
    puerto: 8081
}).argv;
const app = require('./app');
const Puerto = args.puerto 
app.listen(Puerto, ()=> {
    console.info(`Conectado en el puerto ${Puerto}`)
})

