let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productos = JSON.parse(localStorage.getItem('productos')) || [];

// Cargar productos desde el JSON si no hay en localStorage
async function cargarProductosDesdeJSON() {
    // Primero intentamos cargar desde localStorage
    const productosGuardados = localStorage.getItem('productos');
    
    if (productosGuardados) {
        // Si hay productos en localStorage, los cargamos desde allí
        productos = JSON.parse(productosGuardados);
        console.log("Productos cargados desde localStorage");
    } else {
        // Si no hay productos en localStorage, cargamos desde el archivo JSON
        try {
            const response = await fetch('../data/producto.json');
            if (!response.ok) throw new Error('Error al cargar productos desde el JSON');
            
            productos = await response.json();
            console.log("Productos cargados desde el archivo JSON");

            // Guardamos los productos iniciales en localStorage
            guardarProductosEnLocalStorage();
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    // Mostrar productos en todas las páginas
    mostrarProductos();
    actualizarCarrito();
}

function mostrarProductos() {
    const listaProductos = document.getElementById('lista-productos') || document.getElementById('lista-celulares') || document.getElementById('lista-accesorios') || document.getElementById('lista-ofertas');
    if (!listaProductos) return;

    listaProductos.innerHTML = ''; // Limpiar el contenedor

    const currentPage = window.location.pathname.split('/').pop(); // Obtener la página actual
    let productosFiltrados = productos; // Definir aquí para que esté disponible

    // Filtrar productos por categoría en celular.html y accesorio.html
    if (currentPage === 'celular.html') {
        productosFiltrados = productos.filter(producto => producto.categoria === 'Celular');
    } else if (currentPage === 'accesorio.html') {
        productosFiltrados = productos.filter(producto => producto.categoria === 'Accesorio');
    } else if (currentPage === 'oferta.html') {
        productosFiltrados = productos.filter(producto => producto.precio_Descuento && producto.precio_Descuento < producto.precio);
    }

    productosFiltrados.forEach(producto => {
        const tarjeta = document.createElement('div');
        const precioMostrar = producto.precio_descuento ? producto.precio_descuento : producto.precio;

        tarjeta.className = 'product-card col-md-4';

        tarjeta.innerHTML = `
            <img src="${producto.url_imagen}" alt="${producto.nombre}" class="img-fluid">
            <div class="card-body">
                <h5>${producto.nombre}</h5>
                <p>${producto.descripcion}</p>
                <p><strong>Precio: $${producto.precio}</strong></p>
                <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
                <button class="btn btn-info" onclick="verDetalleProducto(${producto.id})">Ver Más</button>
            </div>
        `;

        // Agregar botones de editar y eliminar solo en admin.html
        if (currentPage === 'admin.html') {
            tarjeta.innerHTML += `
                <button class="btn btn-warning" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            `;
        }

        listaProductos.appendChild(tarjeta);
    });
}

// Cargar los productos al inicio
cargarProductosDesdeJSON();
cargarProductoEnOferta();


// Función para agregar un producto (para admin)
function agregarProducto() {
    const nuevoProducto = {
        id: productos.length + 1, // Puedes ajustar esto para usar un ID único
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        especificacion: document.getElementById('especificacion').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        categoria: document.getElementById('categoria').value,
        url_imagen: document.getElementById('url_imagen').value
    };

    productos.push(nuevoProducto);
    guardarProductos();
    mostrarProductos(); // Refrescar la lista de productos
    resetForm(); // Reiniciar el formulario
}

// Función para editar un producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('especificacion').value=producto.especificacion;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('stock').value = producto.stock;
        document.getElementById('categoria').value = producto.categoria;
        document.getElementById('url_imagen').value = producto.url_imagen;

        // Cambiar la función del botón de agregar a editar
        const btnAgregar = document.getElementById('btn-agregar');
        btnAgregar.innerText = "Guardar Cambios";
        btnAgregar.onclick = () => guardarCambios(id);
    }
}

// Función para guardar cambios al editar
function guardarCambios(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        producto.nombre = document.getElementById('nombre').value;
        producto.descripcion = document.getElementById('descripcion').value;
        document.especificacion =document.getElementById('especificacion').value;
        producto.precio = parseFloat(document.getElementById('precio').value);
        producto.stock = parseInt(document.getElementById('stock').value);
        producto.categoria = document.getElementById('categoria').value;
        producto.url_imagen = document.getElementById('url_imagen').value;

        guardarProductos();
        mostrarProductos(); // Refrescar la lista de productos
        resetForm(); // Reiniciar el formulario
    }
}

// Función para eliminar un producto
function eliminarProducto(id) {
    // Preguntar al usuario si está seguro de eliminar el producto
    const confirmacion = confirm("¿Estás seguro de eliminar este producto?");
    
    if (confirmacion) {
        // Si el usuario acepta, eliminar el producto
        productos = productos.filter(p => p.id !== id);
        guardarProductos();
        mostrarProductos(); // Refrescar la lista de productos
    } else {
        // Si el usuario cancela, no hacer nada
        console.log("Eliminación cancelada");
    }
}

// Guardar productos en el localStorage
function guardarProductos() {
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Reiniciar el formulario
function resetForm() {
    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('especificacion').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('url_imagen').value = '';

    const btnAgregar = document.getElementById('btn-agregar');
    btnAgregar.innerText = "Agregar Producto"; // Restablecer el texto del botón
    btnAgregar.onclick = agregarProducto; // Restablecer la función del botón
}

// Mostrar y ocultar el carrito deslizante
document.getElementById('ver-carrito').addEventListener('click', function() {
    const carritoSlider = document.getElementById('carrito-slider');
    carritoSlider.classList.toggle('active');
});

// Cerrar el carrito deslizante
function cerrarCarrito() {
    document.getElementById('carrito-slider').classList.remove('active');
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem('carrito');
    actualizarCarrito();
    mostrarMensaje('El carrito ha sido vaciado.', "info");
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }

    const existingProduct = carrito.find(item => item.nombre === producto.nombre);

    if (existingProduct) {
        if (existingProduct.cantidad < producto.stock) {
            existingProduct.cantidad += 1;
            mostrarMensaje(`${producto.nombre} se ha agregado al carrito.`, "success");
        } else {
            mostrarMensaje(`No hay suficiente stock de ${producto.nombre}.`, "error");
        }
    } else {
        carrito.push({ nombre: producto.nombre, precio: producto.precio, imagen: producto.url_imagen, cantidad: 1 });
        mostrarMensaje(`${producto.nombre} se ha agregado al carrito.`, "success");
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

// Actualizar carrito visualmente
function actualizarCarrito() {
    const totalProductos = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    document.getElementById('carrito-count').innerText = totalProductos;

    const productosCarrito = document.getElementById('productos-carrito');
    productosCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        productosCarrito.innerHTML += `
            <div class="carrito-item">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div>
                    <p>${producto.nombre}</p>
                    <p>Precio: $${producto.precio}</p>
                    <p>Cantidad: 
                        <button onclick="actualizarCantidad('${producto.nombre}', -1)">-</button>
                        <span>${producto.cantidad}</span>
                        <button onclick="actualizarCantidad('${producto.nombre}', 1)">+</button>
                    </p>
                    <p>Subtotal: $${subtotal}</p>
                </div>
            </div>`;
        total += subtotal;
    });

    document.getElementById('total-carrito').innerText = `Total: $${total}`;
}

// Actualizar cantidad de producto en el carrito
function actualizarCantidad(nombre, cambio) {
    const producto = carrito.find(item => item.nombre === nombre);

    if (producto) {
        const stockProducto = productos.find(p => p.nombre === nombre)?.stock;

        // Verificar si stockProducto no es undefined
        if (stockProducto === undefined) {
            console.error(`Producto no encontrado: ${nombre}`);
            return;
        }

        // Verificar si el cambio de cantidad es válido
        if (producto.cantidad + cambio > stockProducto) {
            mostrarMensaje(`No hay suficiente stock de ${producto.nombre}.`, "error");
        } else {
            producto.cantidad += cambio;

            // Eliminar el producto del carrito si la cantidad es 0
            if (producto.cantidad <= 0) {
                carrito = carrito.filter(item => item.nombre !== nombre);
                mostrarMensaje(`${producto.nombre} ha sido eliminado del carrito.`, "info");
            }

            // Guardar cambios en el localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarCarrito(); // Actualizar visualmente el carrito
        }
    } else {
        console.error(`Producto no encontrado en el carrito: ${nombre}`);
    }
}

// Función para ver el detalle del producto
function verDetalleProducto(idProducto) {
    const productoSeleccionado = productos.find(producto => producto.id === idProducto);

    if (productoSeleccionado) {
        localStorage.setItem('productoSeleccionado', JSON.stringify(productoSeleccionado));
        window.location.href = '../Pages/producto.html';
    } else {
        console.error('Producto no encontrado.');
    }
}

// Mostrar mensajes de éxito o error
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje-dinamico');
    mensajeDiv.innerText = mensaje;
    mensajeDiv.className = `mensaje-dinamico ${tipo}`;
    mensajeDiv.style.display = 'block';

    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 3000);
}

// Cerrar los detalles del producto
function cerrarDetalle() {
    document.getElementById('detalle-producto').style.display = 'none';
}
function cargarProductoEnOferta() {
    const productoEnOferta = productos.find(p => p.precio_descuento); // Filtrar el producto que tiene descuento
    const listaProductos = document.getElementById('lista-ofertas');

    if (!listaProductos) return;

    listaProductos.innerHTML = ''; // Limpiar el contenedor

    if (productoEnOferta) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'product-card';

        tarjeta.innerHTML = `
            <img src="${productoEnOferta.url_imagen}" alt="${productoEnOferta.nombre}" class="img-fluid">
            <div class="card-body">
                <h5>${productoEnOferta.nombre}</h5>
                <p>${productoEnOferta.descripcion}</p>
                <p><strong>Precio Original: $${productoEnOferta.precio}</strong></p>
                <p><strong>Precio con Descuento: $${productoEnOferta.precio_descuento}</strong></p>
                <button class="btn btn-primary" onclick="agregarAlCarrito(${productoEnOferta.id})">Agregar al Carrito</button>
                <button class="btn btn-info" onclick="verDetalleProducto(${productoEnOferta.id})">Ver Más</button>
            </div>
        `;

        listaProductos.appendChild(tarjeta);
    }
}