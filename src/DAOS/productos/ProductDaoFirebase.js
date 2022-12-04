const connect = require('../../services/firebase/config/connect')
const admin = require("firebase-admin")
const ContFirebase = require('../../Containers/ContainerFirebase')
class ProductDao extends ContFirebase{
    constructor(){
        super(admin.firestore(), admin.firestore().collection('productos'))
    };

}
module.exports = ProductDao;