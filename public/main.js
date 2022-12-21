// JS utilizado por el front 
const socket = io();

/////////////////////  SOCKET CHAT /////////////////////
// imprimo todo el historial
function updateChat(messages){
    let allmsg = ''
    
    messages.forEach(element => {
        allmsg = allmsg + `<li>${Date(element.time)} - ${element.id} - ${element.alias} - ${element.message}</li>`
    });

    document.querySelector('#chat').innerHTML = allmsg;
}
// envío un nuevo mensaje, funcion utilizada por el front 
function sendChat(){
    let msg = document.querySelector('#msg').value;
    let mail = document.querySelector('#mail').value;
    let edad = document.querySelector('#edad').value;
    let apellido = document.querySelector('#apellido').value;
    let alias = document.querySelector('#alias').value;
    let avatar = document.querySelector('#avatar').value;
    let nombre = document.querySelector('#nombre').value;
    let time = parseInt(Date.now())
    let fullmsg = {messages: msg, mail: mail, edad:edad, apellido:apellido, alias: alias, avatar: avatar, nombre: nombre, time:time}

    if(mail == ''){
        alert("Para poder chatear necesitas ingresar un mail!")
    }else{
        if(msg == ''){console.log("entró en el if");return}
        socket.emit('NEW_MSG_USR', fullmsg)
        document.querySelector('#msg').value = '';
    }

}

socket.on('NEW_MSG_FROM_BACK', dataChatRecibidaDelBack => {
    updateChat(dataChatRecibidaDelBack)
} )
socket.on('UPDATE_FROM_USR', ChatArry => {updateChat(ChatArry)})

/////////////////////  SOCKET PRODUCTOS /////////////////////

function updateProd(products){
    let allproducts = ''
    products.forEach(element => {
        allproducts = allproducts + 
        `<tr>
            <td>${element.name}</td>
            <td>${element.price}</td>
            <td><img src=${element.picture} width="25px" height="25px"/></td>
        </tr>`
    });
    document.querySelector('#table').innerHTML = allproducts;
}
// envío un nuevo producto, funcion utilizada por el front 
function sendProd(){
    let nombre = document.querySelector('#nombre').value;
    let precio = document.querySelector('#precio').value;
    let url = document.querySelector('#url').value;
    let prod = {name: nombre, price: precio, picture: url}
    if(nombre == '' && precio == '' && url == ''){console.log("entró en el if");return}
    socket.emit('NEW_PROD_USR', prod)
    document.querySelector('#nombre').value = '';
    document.querySelector('#precio').value = '';
    document.querySelector('#url').value = '';
}

socket.on('NEW_PROD_FROM_BACK', dataProdRecibidaDelBack => {
    updateProd(dataProdRecibidaDelBack)
} )
socket.on('UPDATE_PROD_FROM_USR', ProdsArry => {
    updateProd(ProdsArry)
    
})


