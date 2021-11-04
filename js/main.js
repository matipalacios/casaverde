// Declaro productos

productos.push(new Producto(1, "Desodorante de ambientes en aerosol Poett", 150, "img/poett.jpg"));
productos.push(new Producto(2, "Detergente Magistral", 105, "img/detergenteMagis.jpg"));
productos.push(new Producto(3, "Lustramuebles Ceramicol", 180, "img/ceramicol.jpg"));

productosjQuery(productos, '#productosContenedor');

let botones = $(".btn-compra");

for (const boton of botones) {
    boton.onclick = comprarProducto;
}