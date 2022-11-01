let productos = [
    {
        "nombre":"Calculadora",
        "precio": 25,
        "url": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-512.png"
    },
    {
        "nombre":"Escuadra",
        "precio": 2,
        "url": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-512.png"
    },
    {
        "nombre":"reloj",
        "precio": 250,
        "url": "https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-256.png"
    }
]

class prod{
    constructor(){}
    ShowProd(){
        return productos
    }
    SaveProducts(product){
        productos.push(product);
        return product
    }
}

module.exports = prod