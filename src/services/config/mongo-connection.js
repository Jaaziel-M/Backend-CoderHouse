const mongoose = require('mongoose');

const CONNECT = async () => {
    let MONGO_URI;
    const MONGO_USER = process.env.MONGO_USER;
    if(MONGO_USER == ""){
        //MONGO_URI =  `mongodb://localhost:27017/ecommerce`
        MONGO_URI =  `mongodb://127.0.0.1:27017/ecommerce`
    }else{
        MONGO_URI = `mongodb+srv://${MONGO_USER}:${process.env.MONGO_PASS}@cluster0.biltcc2.mongodb.net/?retryWrites=true&w=majority`;
    }
    
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("connected to db")
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = CONNECT;