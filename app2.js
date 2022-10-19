const fs = require('fs');

class Contenedor{
    constructor (title, precio, imagen, id){
        this.title = title,
        this.precio = precio,
        this.imagen = imagen
        if(id==null){
            this.id = 0
        }
        else{
            this.id = id
        }
    }
    
    getAll(){

        try{
            const content = fs.readFileSync('./articles.txt','utf-8')
            return JSON.parse(content)
        }
        catch (err){
            if (err == "Error: ENOENT: no such file or directory, open './articles.txt'"){
                console.log("Error, no existe un archivo con ese nombre!")
            }
    }}

    //async getAllAsync(){
    //    let result = undefined
    //    try {
    //        
    //        let content =  JSON.parse(await fs.promises.readFile('./articles.txt','utf-8'))
    //        result = content
    //        //console.log(result)
    //        return result
    //    }
    //    catch (err){
    //        if (err == "Error: ENOENT: no such file or directory, open './articles.txt'"){
    //            console.log("Error, no existe un archivo con ese nombre!")
    //        }
    //    }
    //}

    getByID(number){
        let items = this.getAll()
        try{
            let result = ""
            items.forEach(
                element => {
                    if (element.id == number){
                        result = element 
                    }
            })
            return result 
        }catch(err){
            console.log("error")
        }
    }
    deleteByID(number){
        let items = this.getAll()
        try{
            
            console.log(items)
            items.forEach(
                element => {
                    if (element.id == number){
                        items.splice(number-1, 1)
                        this.save(items)
                        console.log(`Object with ID: ${number} was successfully deleted`)
                    }
            });
        }
        catch (err){
            console.log(err)
        }
    }
    deleteAll(){
        this.save("")
    }
    async save (Obj){
        try{
            if (Obj == ""){
                await fs.promises.writeFile('./articles.txt', "")
                console.log("file deleted")
                return true
            }
            let content = this.getAll()
            Obj.id = content.length +1;
            
            content.push(JSON.parse(JSON.stringify(Obj)))
            await fs.promises.writeFile('./articles.txt', JSON.stringify(content))
            console.log("file updated")
            }
        catch (err){
            console.log(err)
        }
    }
    
}



module.exports = Contenedor;