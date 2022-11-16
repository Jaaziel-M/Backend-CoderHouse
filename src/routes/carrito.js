const express = require('express');
const carrito = express();
const fs = require('fs');
const {v4 : uuidv4} = require('uuid')
const {Prods} = require('./productos')
let carritos = []

class Carrito {
    constructor(productos){
        this.id_cart = uuidv4();
        this.timestamp = Date.now()
        this.productos = []
        this.productos.push(productos)
    }
}

let Karts = async (option, parameter, search, search2) => {
    
    switch(option){
        
        case "readOnly":
            
            try{
                let content = await fs.promises.readFile('./src/storagefiles/db2.json','utf-8')
                let data = JSON.parse(content)
                let found = false
                let productsFound = []
                data.forEach(element => {
                    if(element != undefined){
                        if(element.id_cart == search){
                            found = true
                            productsFound.push(element.productos)       
                        }
                    }
                });
                
                if(!found){
                    return `No se encontró data con el ID: ${search}`
                }
                return productsFound
            }catch(err){
                return err
            }
        case "readAndUpdate":
            try{
                let content = await fs.promises.readFile('./src/storagefiles/db2.json','utf-8')
                let data = JSON.parse(content)
                data.push(JSON.parse(parameter))
                //console.log(data)
                let del = await fs.promises.writeFile('./src/storagefiles/db2.json',"")
                let wr = await fs.promises.writeFile('./src/storagefiles/db2.json', JSON.stringify(data))
                return data
            }catch(err){
                return err
            }
        case "SearchAndAdd":
            try{
                let content = await fs.promises.readFile('./src/storagefiles/db2.json','utf-8');
                let data = JSON.parse(content);
                let updated = false;
                let parameterParsed = JSON.parse(parameter)
                
                data.forEach(element => {
                    if(element.id_cart == search){
                        updated = true;
                        element.timestamp = Date.now();
                        element.productos.push(parameterParsed);
                        if(element.productos[0]==undefined){element.productos.splice(0,1)}
                    }
                });
                if(updated){
                    let del = await fs.promises.writeFile('./src/storagefiles/db2.json',"")
                    let wr = await fs.promises.writeFile('./src/storagefiles/db2.json', JSON.stringify(data))
                    console.log(`carrito con el ID: ${search} actualizado`)
                    return data
                }
                else{
                    return `No se encontró data con el ID: ${search}`
                }
            }catch(err){
                return err
            }
        case "SearchAndDelete":
            try{
                let content = await fs.promises.readFile('./src/storagefiles/db2.json','utf-8');
                let data = JSON.parse(content);
                let i = 0;
                let j = 0;
                let deleted = false;
                let found = false;
                data.forEach(element => {
                    
                    if(element.id_cart == search){
                        deleted = true
                        
                        if(search2 == null){
                            data.splice(i,1)
                        }
                        else{
                            if(element.productos[0] != undefined){
                                element.productos.forEach(element => {
                                
                                    if(element.id == search2){
                                        found = true
                                        data[i].productos.splice(j,1)
                                    }
                                    j++
                                });
                                if(!found){
                                    return `No se encontró elemento con ID: ${search2} en el carro ID: ${search}`
                                }
                            }
                        }
                    }
                    i++
                });
                if(deleted){
                    let del = await fs.promises.writeFile('./src/storagefiles/db2.json',"")
                    let wr = await fs.promises.writeFile('./src/storagefiles/db2.json', JSON.stringify(data))
                    console.log(`carrito con el ID: ${search} eliminado`)
                    return data
                }
                return `No hubo coincidencias de ningun tipo, por favor ingrese parametros validos!`
            }catch(err){
                return err
            }
        
    }

}

carrito.get('/:id_carro/productos',(req,res)=>{
    const id_carro = req.params.id_carro;
    Karts("readOnly", null, id_carro, null).then(kartList =>{
        try {
            console.log(kartList)
        } catch (err) {
            return err
        }
    })
})
// Creo el carrito y lo agrego al db.json
carrito.post('/',(req_,res)=>{
    let kart = new Carrito()
    carritos.push(kart)
    res.send(`Carrito creado, ID: ${kart.id_cart}`)
    kartParsed = JSON.stringify(kart)
    console.log(kartParsed)
    Karts("readAndUpdate", kartParsed, null).then(kartList => {
        try{
            console.log(kartList)
            return kartList
        }catch(err){
            return err
        }
    })
})
// Vacía un carrito y lo elimina.
carrito.delete('/:id_carro',(req,res)=>{
    const query = req.params.id_carro
    Karts("SearchAndDelete",null,query,null).then(kartList => {
        try {
            console.log(kartList)
        } catch (err) {
            return err
        }
    })
    
})

//Para incorporar productos al carrito por su id de producto
carrito.post('/:id_prod/productos/:id_carro',(req,res)=>{
    // busca el producto en db2.json por id y lo agrega al array 
    // Acá le agregué la funcionalidad que el 2do uuid pasado por parametros, id = id del producto, id2 = id del carrito a editar
    const query = req.params.id_prod
    const query2 = req.params.id_carro
    let data = [];
    let found = false;
    Prods("readOnly").then(prodList => {
        //Busco la data del fichero de productos "db.json" y la agrego al array data
        try{
            prodList.forEach(element => {
                if(element.id == query){
                    data.push(element)
                    found = true;
                }
            });
            if(!found){
                found = false
                return `No se encontraron productos con este ID: ${query}`
            }

        }catch(err){
            return err
        }
        console.log(JSON.stringify(data[0]))
        Karts("SearchAndAdd",JSON.stringify(data[0]),query2,null).then(kartList => {
            try{
                console.log(kartList)
            }catch(err){
                return err
            }
        })
    });
    


})
// Eliminar un producto del carrito por su id de carrito y de producto
carrito.delete('/:id_prod/productos/:id_carro',(req,res)=>{
    const id_prod = req.params.id_prod
    const id_carro = req.params.id_carro
    Karts("SearchAndDelete", null, id_carro, id_prod).then(kartList =>{
        try {
            console.log(kartList)
        } catch (err) {
            return err
        }
    })
})

module.exports = carrito;