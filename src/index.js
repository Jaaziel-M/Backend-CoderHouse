require('dotenv').config();

// IMPORT CONDICIONAL CON TEMPLATE STRINGS

const ProductDao = async () => {
    const ModuleSrc = await require(`./DAOS/productos/ProductDao${process.env.DATASOURCE_PROD}.js`)
    return ModuleSrc
}
const KartDao = async () => {
    const ModuleSrc = await require(`./DAOS/carritos/CarritoDao${process.env.DATASOURCE_KART}.js`)
    return ModuleSrc
}
// LLAMADA AL IMPORT CONDICIONAL 

const ProdSvc = ProductDao().then(data => {
    const CalltoDB = new data();
    return CalltoDB
});
const KartSvc = KartDao().then(data => {
    const CalltoDB = new data();
    return CalltoDB
});

module.exports = {ProdSvc, KartSvc};