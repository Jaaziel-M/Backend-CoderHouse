// JS utilizado por el front 
const socket = io();

const messages = []
const products = []

/////////////////////  SOCKET CHAT /////////////////////
// imprimo todo el historial
function updateChat(messages){
    let allmsg = ''
    messages.forEach(element => {
        allmsg = allmsg + `<li>${element.mail} - ${element.ts} - ${element.msg}</li>`
    });
    document.querySelector('#chat').innerHTML = allmsg;
}

// envío un nuevo mensaje
function sendChat(){

    let msg = document.querySelector('#msg').value;
    let mail = document.querySelector('#mail').value;
    let fullmsg = {messages: msg, mails: mail}
    if(mail == ''){
        alert("Para poder chatear necesitas ingresar un mail!")
    }else{
        if(msg == ''){console.log("entró en el if");return}
        socket.emit('NEW_MSG_USR', fullmsg)
        document.querySelector('#msg').value = '';
    }
}


socket.on('NEW_MSG_FROM_BACK', dataChatRecibidaDelBack => {
    messages.push(dataChatRecibidaDelBack);
    updateChat(messages)
} )
socket.on('UPDATE_FROM_USR', ChatArry => {
    ChatArry.forEach(element => {messages.push(element)})
    updateChat(messages)
})

/////////////////////  SOCKET PRODUCTOS /////////////////////

function updateProd(products){
    let allproducts = ''
    products.forEach(element => {
        allproducts = allproducts + 
        `<tr>
            <td>${element.name}</td>
            <td>${element.price}</td>
            <td><img src=${element.pic} width="25px" height="25px"/></td>
        </tr>`
    });
    console.log(`Array ingresado:  ${allproducts}`)
    document.querySelector('#table').innerHTML = allproducts;
}

// envío un nuevo producto
function sendProd(){
    let nombre = document.querySelector('#nombre').value;
    let precio = document.querySelector('#precio').value;
    let url = document.querySelector('#url').value;
    let prod = {name: nombre,price: precio,pic: url}
    console.log(`${nombre}  -  ${precio}  -  ${url}`)
    if(nombre == '' && precio == '' && url == ''){console.log("entró en el if");return}
    socket.emit('NEW_PROD_USR', prod)
    document.querySelector('#nombre').value = '';
    document.querySelector('#precio').value = '';
    document.querySelector('#url').value = '';
}


socket.on('NEW_PROD_FROM_BACK', dataProdRecibidaDelBack => {
    products.push(dataProdRecibidaDelBack);
    updateProd(products)
} )
socket.on('UPDATE_PROD_FROM_USR', ChatArry => {
    ChatArry.forEach(element => {products.push(element)})
    updateProd(products)
})


