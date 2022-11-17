const express = require('express');
const productos = express()
const fs = require('fs');
const {v4 : uuidv4} = require('uuid')
productos.use(express.json());
productos.use(express.urlencoded({extended:true}));


class Products{
    constructor(title,price,url,stock,descripcion){
        this.title = title;
        this.price = price;
        this.url = url;
        this.id = uuidv4();
        this.stock = stock;
        this.descripcion = descripcion;
        this.timestamp = Date.now();
    }
}



let Prods = async (option, parameter, search) => {
    switch(option){
        case "readOnly":
            try{
                let content = await fs.promises.readFile('./src/storagefiles/db.json','utf-8')
                return JSON.parse(content)
            }catch(err){
                return err
            }
        case "readAndUpdate":
            try{
                
                let content = await fs.promises.readFile('./src/storagefiles/db.json','utf-8')
                let data = JSON.parse(content)
                console.log(typeof(parameter))
                
                data.push(JSON.parse(parameter))
                console.log(data)
                let del = await fs.promises.writeFile('./src/storagefiles/db.json',"")
                let wr = await fs.promises.writeFile('./src/storagefiles/db.json', JSON.stringify(data))
                return data
            }catch(err){
                return err
            }
        case "SearchAndUpdate":
            try{
                let content = await fs.promises.readFile('./src/storagefiles/db.json','utf-8');
                let data = JSON.parse(content);
                let updated = false;
                let parameterParsed = JSON.parse(parameter)
                data.forEach(element => {
                    if(element.id == search){
                        updated = true
                        element.title = parameterParsed.title;
                        element.price = parameterParsed.price;
                        element.url = parameterParsed.url;
                        element.stock = parameterParsed.stock;
                        element.descripcion = parameterParsed.descripcion;
                        element.timestamp = Date.now()
                    }
                });
                if(updated){
                    let del = await fs.promises.writeFile('./src/storagefiles/db.json',"")
                    let wr = await fs.promises.writeFile('./src/storagefiles/db.json', JSON.stringify(data))
                    console.log(`producto con el ID: ${search} actualizado`)
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
                let content = await fs.promises.readFile('./src/storagefiles/db.json','utf-8');
                let data = JSON.parse(content);
                let i = 0;
                let deleted = false;
                data.forEach(element => {
                    
                    if(element.id == search){
                        deleted = true
                        data.splice(i,1)
                    }
                    i++
                });
                if(deleted){
                    let del = await fs.promises.writeFile('./src/storagefiles/db.json',"")
                    let wr = await fs.promises.writeFile('./src/storagefiles/db.json', JSON.stringify(data))
                    console.log(`producto con el ID: ${search} eliminado`)
                    return data
                }
                return `No se encontró elemento con ID: ${search}`
            }catch(err){
                return err
            }
        
    }

}

productos.get('/',(req_,res)=>{
    Prods("readOnly").then(prodList => {
        try {
                res.send(prodList)
        }   
        catch(err){
            res.send(`<h1>nope</h1><p>${err}</p>`)
        }
    })
})
productos.get('/:id',(req,res)=>{
        //esta función está mal, tiene que buscar por uuid 
        Prods("readOnly").then(prodList => {
            const query = parseInt(req.params.id)
            try {
                if((query-1) <= prodList.length){
                    res.send(`<img src=${prodList[query-1].url}><h2>${prodList[query-1].price}</h2>`)
                }
            }   
            catch(err){
                res.send(`<h1>nope</h1><p>${err}</p>`)
            }
        })
})
productos.post('/',(req,res)=>{
    const { body } = req;
    let newProd = new Products(body.title, body.price, body.url, body.stock, body.descripcion)
    Prods("readAndUpdate", JSON.stringify(newProd),null).then(prodList => {
        try {
            console.log(newProd.title)
            //Para probar con postman por favor sacar los // en res.send(prodList) y colocarlos en res.redirect('/')
            //res.send(prodList)
            res.redirect('/')
        }   
        catch(err){
            res.send(`<h1>nope</h1><p>${err}</p>`)
        }
    })
    
    
})
productos.put('/:id',(req,res)=>{
    const { body } = req;
    let updatedProd = new Products(body.title, body.price, body.url, body.stock, body.descripcion)
    const query = req.params.id
    console.log(`Body ingresado: ${body.title},  ${body.price},  ${body.url},  ${body.stock},  ${body.descripcion},  `)
    console.log(`Body parseado: ${JSON.stringify(updatedProd)}`)
    Prods("SearchAndUpdate", JSON.stringify(updatedProd), query).then(prodList => {
        try {
            console.log(prodList)
        }   
        catch(err){
            res.send(`<h1>nope</h1><p>${err}</p>`)
        }
    })


})
productos.delete('/:id',(req,res)=>{
    const query = req.params.id;
    Prods("SearchAndDelete",null,query).then(prodList => {
        try {
            console.log(`query received ${query}`)
            //Para probar con postman por favor sacar los // en res.send(prodList) y colocarlos en res.redirect('/')
            //res.send(prodList)
            res.redirect('/')
        }   
        catch(err){
            res.send(`<h1>nope callback del delete</h1><p>${err}</p>`)
        }
    })
})

module.exports = {
    productos: productos,
    Prods: Prods,
    ProductsClass: Products
};
