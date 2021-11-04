//Declaración de clase producto

class Producto {
    constructor(id, nombre, precio, img) {
        this.id = parseInt(id);
        this.nombre = nombre;
        this.precio = parseFloat(precio);
        this.img = img;
        this.cantidad = 1;
    }
    agregarCantidad(valor) {
        this.cantidad += valor;
    }
    subtotal() {
        return this.cantidad * this.precio;
    }
}