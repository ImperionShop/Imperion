document.addEventListener("DOMContentLoaded", () => {
    const botonesAgregar = document.querySelectorAll(".add-button");
    const contadorCarrito = document.querySelector("#cart-count");
    const botonCarrito = document.querySelector("#cart-button");
    const panelCarrito = document.querySelector("#cart-panel");
    const cerrarCarrito = document.querySelector("#close-cart");
    const productosCarrito = document.querySelector("#cart-items");
    const totalCarrito = document.querySelector("#cart-total");
    const botonComprar = document.querySelector("#checkout-button");

    const botonCuenta = document.querySelector("#account-button");
    const modalCuenta = document.querySelector("#account-modal");
    const fondoModal = document.querySelector("#overlay");
    const cerrarCuenta = document.querySelector("#close-account");
    const botonMensaje = document.querySelector("#modal-message");

    const botonMenu = document.querySelector("#menu-toggle");
    const navegacion = document.querySelector("#nav");
    const notificacion = document.querySelector("#toast");
    const botonArriba = document.querySelector("#boton-arriba");

    let carrito = JSON.parse(localStorage.getItem("imperion-carrito")) || [];

    function mostrarNotificacion(mensaje) {
        if (!notificacion) {
            return;
        }

        notificacion.textContent = mensaje;
        notificacion.classList.add("show");

        setTimeout(() => {
            notificacion.classList.remove("show");
        }, 2200);
    }

    function formatearPrecio(precio) {
        return `$${precio.toLocaleString("es-CO")}`;
    }
 const tarjetasCatalogo = document.querySelectorAll(".catalog-card");

    if (tarjetasCatalogo.length > 0) {
        const observadorCatalogo = new IntersectionObserver(
            (entradas, observador) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("visible");
                        observador.unobserve(entrada.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        tarjetasCatalogo.forEach((tarjeta, indice) => {
            tarjeta.style.transitionDelay = `${indice * 120}ms`;
            observadorCatalogo.observe(tarjeta);
        });
    }

    const selectoresTalla = document.querySelectorAll(".catalog-card");

    selectoresTalla.forEach((tarjeta) => {
        const botonesTalla = tarjeta.querySelectorAll(".size-button");
        const botonAgregar = tarjeta.querySelector(".catalog-add-button");

        botonesTalla.forEach((boton) => {
            boton.addEventListener("click", () => {
                botonesTalla.forEach((otroBoton) => {
                    otroBoton.classList.remove("selected");
                });

                boton.classList.add("selected");
                botonAgregar.classList.remove("disabled");
                botonAgregar.dataset.size = boton.dataset.size;
            });
        });

        botonAgregar.addEventListener("click", () => {
            const tallaSeleccionada = botonAgregar.dataset.size;

            if (!tallaSeleccionada) {
                mostrarNotificacion("Selecciona una talla antes de continuar");
                return;
            }

            const nombre = `${botonAgregar.dataset.name} - Talla ${tallaSeleccionada}`;
            const precio = Number(botonAgregar.dataset.price);

            agregarAlCarrito(nombre, precio);
        });
    });
    function actualizarCarrito() {
        const cantidadTotal = carrito.reduce(
            (total, producto) => total + producto.cantidad,
            0
        );

        if (contadorCarrito) {
            contadorCarrito.textContent = cantidadTotal;
        }

        if (!productosCarrito || !totalCarrito) {
            return;
        }

        if (carrito.length === 0) {
            productosCarrito.innerHTML = `
                <div class="empty-cart">
                    <span>♛</span>
                    <p>Tu carrito está vacío.</p>
                    <small>Elige una pieza de la colección.</small>
                </div>
            `;

            totalCarrito.textContent = "$0";
            return;
        }

        productosCarrito.innerHTML = "";

        carrito.forEach((producto, indice) => {
            const elemento = document.createElement("div");

            elemento.className = "cart-product";

            elemento.innerHTML = `
                <div>
                    <h3>${producto.nombre}</h3>
                    <p>${formatearPrecio(producto.precio)}</p>
                </div>

                <div class="cart-controls">
                    <button
                        class="decrease-product"
                        data-indice="${indice}"
                        aria-label="Disminuir cantidad"
                    >
                        −
                    </button>

                    <span>${producto.cantidad}</span>

                    <button
                        class="increase-product"
                        data-indice="${indice}"
                        aria-label="Aumentar cantidad"
                    >
                        +
                    </button>

                    <button
                        class="remove-product"
                        data-indice="${indice}"
                        aria-label="Eliminar producto"
                    >
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
            productoExistente.cantidad += 1;
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
            const nombre = boton.dataset.name;
            const precio = Number(boton.dataset.price);

            if (!nombre || !Number.isFinite(precio)) {
                mostrarNotificacion("No se pudo agregar este producto");
                return;
            }

            agregarAlCarrito(nombre, precio);
        });
    });

    if (productosCarrito) {
        productosCarrito.addEventListener("click", (evento) => {
            const boton = evento.target.closest("button");

            if (!boton) {
                return;
            }

            const indice = Number(boton.dataset.indice);

            if (!Number.isInteger(indice) || !carrito[indice]) {
                return;
            }

            if (boton.classList.contains("increase-product")) {
                carrito[indice].cantidad += 1;
            }

            if (boton.classList.contains("decrease-product")) {
                carrito[indice].cantidad -= 1;

                if (carrito[indice].cantidad <= 0) {
                    carrito.splice(indice, 1);
                }
            }

            if (boton.classList.contains("remove-product")) {
                carrito.splice(indice, 1);
            }

            actualizarCarrito();
        });
    }

    function abrirCarrito() {
        if (!panelCarrito || !fondoModal) {
            return;
        }

        panelCarrito.classList.add("open");
        fondoModal.classList.add("visible");
        document.body.classList.add("no-scroll");
    }

    function cerrarPanelCarrito() {
        if (!panelCarrito || !fondoModal) {
            return;
        }

        panelCarrito.classList.remove("open");
        fondoModal.classList.remove("visible");
        document.body.classList.remove("no-scroll");
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
        if (!modalCuenta || !fondoModal) {
            return;
        }

        modalCuenta.classList.add("open");
        fondoModal.classList.add("visible");
        document.body.classList.add("no-scroll");
    }

    function cerrarModalCuenta() {
        if (!modalCuenta || !fondoModal) {
            return;
        }

        modalCuenta.classList.remove("open");
        fondoModal.classList.remove("visible");
        document.body.classList.remove("no-scroll");
    }

if (botonCuenta) {
    botonCuenta.addEventListener("click", abrirCuenta);
}

    if (cerrarCuenta) {
        cerrarCuenta.addEventListener("click", cerrarModalCuenta);
    }

    if (fondoModal) {
        fondoModal.addEventListener("click", () => {
            cerrarPanelCarrito();
            cerrarModalCuenta();
        });
    }

    if (botonMensaje) {
        botonMensaje.addEventListener("click", () => {
            mostrarNotificacion("La creación de cuentas estará disponible próximamente");
        });
    }

    if (botonMenu && navegacion) {
        botonMenu.addEventListener("click", () => {
            const menuAbierto = navegacion.classList.toggle("open");
            botonMenu.setAttribute("aria-expanded", menuAbierto);
        });

        navegacion.querySelectorAll("a").forEach((enlace) => {
            enlace.addEventListener("click", () => {
                navegacion.classList.remove("open");
                botonMenu.setAttribute("aria-expanded", "false");
            });
        });
    }

    if (botonArriba) {
        window.addEventListener("scroll", () => {
            botonArriba.classList.toggle("visible", window.scrollY > 500);
        });

        botonArriba.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
 const carrusel = document.querySelector("#carousel");
    const pistaCarrusel = document.querySelector("#carousel-track");
    const botonAnterior = document.querySelector("#carousel-prev");
    const botonSiguiente = document.querySelector("#carousel-next");
    const puntosCarrusel = document.querySelectorAll(".carousel-dot");

    if (carrusel && pistaCarrusel) {
        let imagenActual = 0;
        const totalImagenes = pistaCarrusel.querySelectorAll("img").length;

        function mostrarImagen(indice) {
            imagenActual = (indice + totalImagenes) % totalImagenes;

            pistaCarrusel.style.transform =
                `translateX(-${imagenActual * 100}%)`;

            puntosCarrusel.forEach((punto, indicePunto) => {
                punto.classList.toggle(
                    "active",
                    indicePunto === imagenActual
                );
            });
        }

        if (botonSiguiente) {
            botonSiguiente.addEventListener("click", () => {
                mostrarImagen(imagenActual + 1);
            });
        }

        if (botonAnterior) {
            botonAnterior.addEventListener("click", () => {
                mostrarImagen(imagenActual - 1);
            });
        }

        puntosCarrusel.forEach((punto) => {
            punto.addEventListener("click", () => {
                mostrarImagen(Number(punto.dataset.slide));
            });
        });

        setInterval(() => {
            mostrarImagen(imagenActual + 1);
        }, 5000);
    }

    actualizarCarrito();
});
