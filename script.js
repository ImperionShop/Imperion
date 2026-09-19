document.addEventListener("DOMContentLoaded", () => {
    const botonesAgregar = document.querySelectorAll(".boton-agregar");
    const contadorCarrito = document.querySelector("#contador-carrito");
    const botonCarrito = document.querySelector("#boton-carrito");
    const panelCarrito = document.querySelector("#panel-carrito");
    const cerrarCarrito = document.querySelector("#cerrar-carrito");
    const productosCarrito = document.querySelector("#productos-carrito");
    const totalCarrito = document.querySelector("#total-carrito");
    const botonComprar = document.querySelector("#boton-comprar");

    const botonCuenta = document.querySelector("#boton-cuenta");
    const modalCuenta = document.querySelector("#modal-cuenta");
    const fondoModal = document.querySelector("#fondo-modal");
    const cerrarCuenta = document.querySelector("#cerrar-cuenta");

    const botonMenu = document.querySelector("#boton-menu");
    const navegacion = document.querySelector("#navegacion");
    const notificacion = document.querySelector("#notificacion");

    let carrito = [];

    function mostrarNotificacion(mensaje) {
        if (!notificacion) return;

        notificacion.textContent = mensaje;
        notificacion.classList.add("visible");

        setTimeout(() => {
            notificacion.classList.remove("visible");
        }, 2200);
    }

    function formatearPrecio(precio) {
        return `$${precio.toLocaleString("es-CO")} COP`;
    }

    function actualizarCarrito() {
        if (contadorCarrito) {
            contadorCarrito.textContent = carrito.reduce(
                (total, producto) => total + producto.cantidad,
                0
            );
        }

        if (!productosCarrito || !totalCarrito) return;

        if (carrito.length === 0) {
            productosCarrito.innerHTML = `
                <div class="carrito-vacio">
                    <span>♛</span>
                    <p>Tu carrito está vacío.</p>
                    <small>Agrega una pieza de la colección.</small>
                </div>
            `;

            totalCarrito.textContent = "$0 COP";
            return;
        }

        productosCarrito.innerHTML = "";

        carrito.forEach((producto, indice) => {
            const elemento = document.createElement("div");

            elemento.className = "producto-carrito";

            elemento.innerHTML = `
                <div>
                    <h3>${producto.nombre}</h3>
                    <p>${formatearPrecio(producto.precio)}</p>
                </div>

                <div class="controles-producto">
                    <button class="disminuir-producto" data-indice="${indice}">
                        −
                    </button>

                    <span>${producto.cantidad}</span>

                    <button class="aumentar-producto" data-indice="${indice}">
                        +
                    </button>

                    <button class="eliminar-producto" data-indice="${indice}">
                        ×
                    </button>
                </div>
            `;

            productosCarrito.appendChild(elemento);
        });

        const total = carrito.reduce(
            (suma, producto) => suma + producto.precio * producto.cantidad,
            0
        );

        totalCarrito.textContent = formatearPrecio(total);
    }

    function agregarAlCarrito(nombre, precio) {
        const productoExistente = carrito.find(
            (producto) => producto.nombre === nombre
        );

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({
                nombre,
                precio,
                cantidad: 1
            });
        }

        actualizarCarrito();
        mostrarNotificacion(`${nombre} fue agregado al carrito`);
    }

    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const nombre = boton.dataset.nombre;
            const precio = Number(boton.dataset.precio);

            agregarAlCarrito(nombre, precio);
        });
    });

    if (productosCarrito) {
        productosCarrito.addEventListener("click", (evento) => {
            const boton = evento.target.closest("button");

            if (!boton) return;

            const indice = Number(boton.dataset.indice);

            if (boton.classList.contains("aumentar-producto")) {
                carrito[indice].cantidad++;
            }

            if (boton.classList.contains("disminuir-producto")) {
                carrito[indice].cantidad--;

                if (carrito[indice].cantidad <= 0) {
                    carrito.splice(indice, 1);
                }
            }

            if (boton.classList.contains("eliminar-producto")) {
                carrito.splice(indice, 1);
            }

            actualizarCarrito();
        });
    }

    function abrirCarrito() {
        if (!panelCarrito) return;

        panelCarrito.classList.add("abierto");
        document.body.classList.add("bloquear-scroll");
    }

    function cerrarPanelCarrito() {
        if (!panelCarrito) return;

        panelCarrito.classList.remove("abierto");
        document.body.classList.remove("bloquear-scroll");
    }

    if (botonCarrito) {
        botonCarrito.addEventListener("click", abrirCarrito);
    }

    if (cerrarCarrito) {
        cerrarCarrito.addEventListener("click", cerrarPanelCarrito);
    }

    if (botonComprar) {
        botonComprar.addEventListener("click", () => {
            if (carrito.length === 0) {
                mostrarNotificacion("Agrega un producto antes de continuar");
                return;
            }

            mostrarNotificacion("La compra estará disponible próximamente");
        });
    }

    function abrirCuenta() {
        if (!modalCuenta || !fondoModal) return;

        modalCuenta.classList.add("visible");
        fondoModal.classList.add("visible");
        document.body.classList.add("bloquear-scroll");
    }

    function cerrarModalCuenta() {
        if (!modalCuenta || !fondoModal) return;

        modalCuenta.classList.remove("visible");
        fondoModal.classList.remove("visible");
        document.body.classList.remove("bloquear-scroll");
    }

    if (botonCuenta) {
        botonCuenta.addEventListener("click", abrirCuenta);
    }

    if (cerrarCuenta) {
        cerrarCuenta.addEventListener("click", cerrarModalCuenta);
    }

    if (fondoModal) {
        fondoModal.addEventListener("click", cerrarModalCuenta);
    }

    if (botonMenu && navegacion) {
        botonMenu.addEventListener("click", () => {
            navegacion.classList.toggle("abierta");
            botonMenu.classList.toggle("activo");
        });

        navegacion.querySelectorAll("a").forEach((enlace) => {
            enlace.addEventListener("click", () => {
                navegacion.classList.remove("abierta");
                botonMenu.classList.remove("activo");
            });
        });
    }

    actualizarCarrito();
});
