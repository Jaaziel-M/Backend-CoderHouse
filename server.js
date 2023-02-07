require('dotenv').config()
const yargs = require('yargs/yargs')(process.argv.slice(2))
const cluster = require('cluster')
const numCpus = require('os').cpus().length
//const args = yargs.default({
//    puerto: 8080,
//    modo: "fork"
//}).argv;
const app = require('./app');
const Puerto = args.puerto 
if(cluster.isMaster || args.modo == "cluster"){
    for(let i = 0;i<numCpus; i++){
        cluster.fork()
    }
    cluster.on("exit",()=>{console.log("process "+process.pid+" died")})
}else{
    const app = require('./app');
    const Puerto = args.puerto 
    app.listen(Puerto, ()=> {
        console.info(`Conectado en el puerto: ${Puerto}`)
    })
}
if(args.modo == "fork")
app.listen(Puerto, ()=> {
    console.info(`Conectado en el puerto: ${Puerto}`)
})

