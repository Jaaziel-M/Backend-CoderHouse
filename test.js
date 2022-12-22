const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema
const util = require('util')
// Desde el front por cada usuario logueado se añade una entrada en users 
// por cada comentario se añade un ID, un Author y un text dentro del array de chat 
// cuando la envío a la db, la tengo que normalizar 
// cuando recibo desde la db toda la data debo desdnormalizarla y manipularla normalmente


dataToNormalize = {id: 999, users:[
    {
        id: 'pepe@argento.com',
        nombre: "pepe",
        apellido: "argento",
        edad: "45",
        alias: "Chevi01",
        avatar: "url"
    },
    {
        id:'mariaelena@fuseneco.com',
        nombre: "mariaelena",
        apellido: "fuseneco",
        edad: "43",
        alias: "MariFuseneco01",
        avatar: "url"
    }
], chats:[
        {
            id: '100',
            author: {
                id: 'pepe@argento.com',
                nombre: "pepe",
                apellido: "argento",
                edad: "45",
                alias: "Chevi01",
                avatar: "url"
            },
            text: "Hola como va" 
        },
        {
            id: '101',
            author: {
                id:'mariaelena@fuseneco.com',
                nombre: "mariaelena",
                apellido: "fuseneco",
                edad: "43",
                alias: "MariFuseneco01",
                avatar: "url"
            },
            text: "viejo verde"
        },
        {
            id: '102',
            author: {
                id: 'pepe@argento.com',
                nombre: "pepe",
                apellido: "argento",
                edad: "45",
                alias: "Chevi01",
                avatar: "url"
            },
            text: "callate cara de galleta marinera"
        },
        {
            id: '103',
            author: {
                id:'mariaelena@fuseneco.com',
                nombre: "mariaelena",
                apellido: "fuseneco",
                edad: "43",
                alias: "MariFuseneco01",
                avatar: "url"
            },
            text: "Bigote careta"
        }
]}





// Schemas 
const usrSchema = new schema.Entity('usuarios',{id: 'email'});
//const msgSchema = new schema.Entity('chatsines',{author:usrSchema});

const order = new schema.Entity('all', {
    users: [usrSchema],
    chats: [{author:usrSchema}]
    
});



// Normalizacion 

const dataNormalized = normalize(dataToNormalize, order);
//const dataDenom = denormalize(dataNormalized.result, order, dataNormalized.entities)



console.log(util.inspect(dataNormalized,false, 12, true))

//const optimizationPercentage = (parseInt(JSON.stringify(dataNormalized).length)*100)/parseInt(JSON.stringify(dataToNormalize).length)
//console.log(`Optimization: ${optimizationPercentage}%`)
//console.log(`Peso del objeto sin normalizar: ${JSON.stringify(dataToNormalize).length} bytes`)
//console.log(`Peso del objeto sin normalizar: ${JSON.stringify(dataNormalized).length} bytes`)
