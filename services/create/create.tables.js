const knexConfig = require('../config')
const knex = require('knex')(knexConfig)

knex.schema.createTable('chats', table => {
    table.string('mail'),
    table.string('msgtime'),
    table.string('messages')
}).then(() => {
    console.log("table chats created")
}).catch(err =>{
    console.log(err)
}).finally(()=>{
    knex.destroy()
})

knex.schema.createTable('Products', table => {
    table.increments('id'),
    table.string('name'),
    table.string('price'),
    table.string('picture')
}).then(() => {
    console.log("table Poducts created")
}).catch(err =>{
    console.log(err)
}).finally(()=>{
    knex.destroy()
})