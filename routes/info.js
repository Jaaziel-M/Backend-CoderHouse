const express = require('express');
const router = express.Router();
const yargs = require('yargs/yargs')(process.argv.slice(2))

router.get('/',(req,res)=>{
    res.json(
        {
            "Path de ejecución":process.cwd(),
            "Process ID":process.pid,
            "Argumentos pasados":JSON.stringify(yargs.parse()),
            "Usando la version de Node compilada para":process.platform,
            "Memoria Total Reservada":process.memoryUsage().rss
        }
    )
})

module.exports = router