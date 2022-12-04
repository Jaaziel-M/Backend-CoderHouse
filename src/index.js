const express = require('express');

require('dotenv').config();

// IMPORT CONDICIONAL CON TEMPLATE STRINGS

const ProductDao = async () => {
    const ModuleSrc = await require(`./DAOS/productos/ProductDao${process.env.DATASOURCE}.js`)
    return ModuleSrc
}

// LLAMADA AL IMPORT CONDICIONAL 

const ProdSvc = ProductDao().then(data => {
    const CalltoDB = new data();
    return CalltoDB
});


module.exports = ProdSvc;