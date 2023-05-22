const mongoose = require('mongoose')
const connect = require('../Services/config/connect')
const orderModel = require('../Services/models/order.model')

class orderContainer {
    constructor(){
        this.connect = connect()
    };
    async createOrder(bodyFromPage, username){
        try {
            let datenow = new Date();
            console.log(bodyFromPage)
            const newOrder = new orderModel({
                user: username,
                products: bodyFromPage,
                time: datenow
            });
            const addOrder = await newOrder.save(); 
            
        } catch (error) {
            throw new Error(error)
        }
    }

}

module.exports = orderContainer;