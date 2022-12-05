const connect = require('../../services/firebase/config/connect')
const admin = require("firebase-admin")
const ContFirebase = require('../../Containers/ContainerFirebase')
class KartDao extends ContFirebase{
    constructor(){
        super(admin.firestore(), admin.firestore().collection('carritos'))
    };

}
module.exports = KartDao;