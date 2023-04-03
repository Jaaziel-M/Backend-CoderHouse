const { createTransport } = require('nodemailer')
require('dotenv').config();
const md5 = require('md5')

const testMail = "adrienne76@ethereal.email"

const transport = createTransport({
    service: 'gmail',
    auth:{
        user: md5(toString(process.env.MAIL)),
        pass: md5(toString(process.env.MAIL_PASS))
    }
    
})



//try {
//    const sendMail = transport.sendMail(mailOptions).then(items=>{console.log(items)})
//    
//
//} catch (error) {
//    console.log(error)
//}

module.exports = transport