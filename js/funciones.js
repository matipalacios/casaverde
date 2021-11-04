function productosjQuery(productos, id) {
    for (const producto of productos) {
        $(id).append(`<div class="card m-auto rounded-3" style="width: 18rem;">
                        <img src="${producto.img}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title title_reset">${producto.nombre}</h5>
                            <p class="card-text">$ ${producto.precio}</p>                    
                            <a href="#" id='${producto.id}' class="btn btn-primary btn-compra rounded-pill">COMPRAR</a>
                        </div>
                    </div>`);
    }
}

function comprarProducto(event) {
    event.preventDefault();
    const idProducto = event.target.id;
    const existe = carrito.find(producto => producto.id == idProducto);
    //Busco si existe en el carrito el producto ya
    if (existe == undefined) {
        const seleccionado = productos.find(producto => producto.id == idProducto);
        carrito.push(seleccionado);
    } else {
        existe.agregarCantidad(1);
    }

    //Acción de agregado al carrito
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'Agregado al carrito'
    })

    carritoUI(carrito);
}

function carritoUI(productos) {
    $("#carritoCantidad").html(productos.length);
    $("#carritoProductos").empty();

    for (const producto of productos) {
        $('#carritoProductos').append(compraCarrito(producto));
    }

    $('.btn-delete').on('click', vaciarCarrito);
    $('.btn-add').on('click', agregarCtd);
    $('.btn-sub').on('click', restarCtd);

    $('#carritoProductos').append(`<button class="btn btn-success" id="btnConfirmar">Confirmar compra</button>`);
    $("#btnConfirmar").on("click", enviarCompra);

}

function compraCarrito(producto) {
    return `<div class="card m-auto rounded-3" style="width: 10rem;">
            <img src="${producto.img}" class="card-img-top" alt="...">
            <div class="card-body">
            <h5 class="card-title title_reset">${producto.nombre}</h5>
            <p class="card-text">$ ${producto.precio}</p>
            <span class="badge bg-warning text-dark">Subtotal: $ ${producto.subtotal()}</span>
            <a id="${producto.id}" class="btn btn-secondary btn-add" >+</a> 
            <a id="${producto.id}" class="btn btn-secondary btn-sub" >-</a>  
            <a id="${producto.id}" class="btn btn-danger btn-delete" >x</a>         
            </p>`
}

function vaciarCarrito(event) {

    event.stopPropagation();

    carrito = carrito.filter(producto => producto.id != event.target.id);

    carritoUI(carrito);

}

function agregarCtd(event) {

    event.stopPropagation();

    let producto = carrito.find(p => p.id == event.target.id);
    producto.agregarCantidad(1);
    $(this).parent().children()[1].innerHTML = producto.cantidad;
    $(this).parent().children()[2].innerHTML = producto.subtotal();

}

function restarCtd(event) {

    event.stopPropagation();
    let producto = carrito.find(p => p.id == event.target.id);

    if (producto.cantidad > 1) {
        producto.agregarCantidad(-1);
        $(this).parent().children()[1].innerHTML = producto.cantidad;
        $(this).parent().children()[2].innerHTML = producto.subtotal();
    }

}

function enviarCompra() {

    $.post("https://jsonplaceholder.typicode.com/posts", JSON.stringify(carrito), function (respuesta, estado) {
        console.log(estado);
        console.log(respuesta);

        let timerInterval
        Swal.fire({
            title: 'Su compra está siendo procesada',
            timer: 5000,
            timerProgressBar: true,
            showCancelButton: true,
            didOpen: () => {
                Swal.showLoading()
            },
            willClose: () => {
                Swal.fire({
                    width: '25rem',
                    icon: 'success',
                    iconColor: '#199c3c',
                    title: 'Su compra ha sido realizada con éxito',
                    timer: 2000
                })
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    width: '25rem',
                    icon: 'error',
                    title: 'Su compra no pudo ser procesada',
                    showConfirmButton: true,
                })
            }
        })

        if (estado == "success") {
            $('#carritoProductos').empty();
            $('#carritoCantidad').html("0");

        } else {
            console.log('Los datos no se enviaron correctamente');
        }

    })
}