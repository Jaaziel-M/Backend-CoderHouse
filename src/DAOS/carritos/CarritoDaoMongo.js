const ContMongo = require('../../Containers/ContainerMongo')
const mongoose = require('mongoose')
const connect = require('../../services/mongo/config/connect')
class KartDao extends ContMongo{
    constructor(){
        super(connect())
    };

}
module.exports = KartDao;