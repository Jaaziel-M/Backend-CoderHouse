process.on("message",(message)=>{
    if(message){
        for (let index = 0; index < message; index++) {
            //console.log(parseInt(Math.random()*1000))
            process.send(parseInt(Math.random()*1000))
        }
    }

})

module.exports = process