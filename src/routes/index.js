const express = require('express');
const ProdRouter = require('../../src/routes/productos')
const router = express.Router();

router.get('/home',(_req, res) => {
    res.send("<h1>Hello world!</h1>")
})
router.use('/productos', ProdRouter) // acá vinculo el indice ppal con los script de productos, primero se define la ruta (url) y luego la variable que contiene la ruta hacia el script a ejecutar

module.exports = router;