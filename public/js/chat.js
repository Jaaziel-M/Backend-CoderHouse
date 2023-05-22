const socket = io();


/////////////////////  SOCKET CHAT /////////////////////
// imprimo todo el historial
function updateChat(arry){
    console.log("####DATA FROM DB###")
    console.log(arry.length)
    console.log(arry)
    console.log("###################")
    let allmsg = ''
    arry.forEach(element => {
        allmsg = allmsg + `<li>${element.email} - ${element.timestamp} - ${element.mensaje}</li>`

    });

    document.querySelector('#chat').innerHTML = allmsg;
}

// envío un nuevo mensaje
function sendChat(){

    let msg = document.querySelector('#mensaje').value;
    let mail = document.querySelector('#email').value;
    let tipo = "usuario"
    if (mail == "admin@lalal.com"){tipo = "sistema"}
    let fullmsg = {email: mail, tipo: tipo, mensaje: msg}
    if(mail == ''){
        alert("Para poder chatear necesitas ingresar un mail!")
    }else{
        if(msg == ''){console.log("entró en el if");return}
        socket.emit('NEW_MSG_USR', fullmsg)
        document.querySelector('#mensaje').value = '';
    }
}
socket.on('NEW_MSG_FROM_BACK', dataChatRecibidaDelBack => {
    updateChat(dataChatRecibidaDelBack)
} )
socket.on('UPDATE_FROM_USR', ChatArry => {updateChat(ChatArry)})
