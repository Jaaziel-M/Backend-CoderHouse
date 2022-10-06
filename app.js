class Libros {
    constructor (nombre, autor){
        this.nombre = nombre;
        this.autor = autor;
    }
}

class Usuario {
    constructor (nombre, apellido){
        this.nombre = nombre;
        this.apellido = apellido;
        this.mascotas = [];
        this.libros = [];
    }
    addBook(nombre, autor){
        let libro = new Libros(nombre, autor)
        this.libros.push(libro)
    }
    addMascota(nombre){
        let mascota = nombre
        this.mascotas.push(mascota)
    }
    getFullName(){
        return(`Nombre completo: ${this.nombre} ${this.apellido}`)
    }
    countMascotas(){
        return(this.mascotas.length)
    }
    getBookNames(arry){
        for (let i of this.libros){
            arry.push(i.nombre)
        }
    }
}


persona1 = new Usuario("Matt", "Murdock")
persona1.addBook("El principe", "Nicolas Maquiavelo")
persona1.addBook("El sabueso de los  Baskerville", "Arthur Conan Doyle")
persona1.addBook("Los cantos de hyperion", "Dan Simmons")
persona1.addMascota("firulais")
persona1.addMascota("sabino navarro")
persona1.addMascota("Nucete")


let nombresLibros = []
persona1.getBookNames(nombresLibros)
console.log(`${persona1.getFullName()}`)
console.log(`${persona1.countMascotas()}`)
console.log(nombresLibros)