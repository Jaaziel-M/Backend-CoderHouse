
const admin = require("firebase-admin");

const serviceAccount = require("../credentials/ecommerce-creds.json");

let connection = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = connection

// contenedor con operaciones basicas de cada clase heredar parametros de clase importada en dao