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

    function actualizarCarrito() {
       localStorage.setItem("imperion-carrito", JSON.stringify(carrito));
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

    actualizarCarrito();

      const formularioCuenta = document.querySelector("#account-form");
    const botonCambiarCuenta = document.querySelector("#account-switch-button");
    const tituloCuenta = document.querySelector("#account-title");
    const descripcionCuenta = document.querySelector("#account-description");
    const textoBotonCuenta = document.querySelector("#account-submit-text");
    const preguntaCuenta = document.querySelector("#account-switch-question");
    const etiquetaNombre = document.querySelector("#account-name-label");
    const campoNombre = document.querySelector("#account-name");
    const campoContrasena = document.querySelector("#account-password");
    const mensajeCuenta = document.querySelector("#account-feedback");

    let modoInicioSesion = false;

    function actualizarFormularioCuenta() {
        if (modoInicioSesion) {
            tituloCuenta.innerHTML = "Bienvenido<br><em>de nuevo.</em>";
            descripcionCuenta.textContent = "Inicia sesión para continuar con tu experiencia en Imperion.";
            textoBotonCuenta.textContent = "Iniciar sesión";
            preguntaCuenta.textContent = "¿Aún no tienes una cuenta?";
            botonCambiarCuenta.textContent = "Crear cuenta";
            etiquetaNombre.style.display = "none";
            campoNombre.style.display = "none";
            campoNombre.required = false;
            campoContrasena.autocomplete = "current-password";
        } else {
            tituloCuenta.innerHTML = "Crea tu<br><em>espacio.</em>";
            descripcionCuenta.textContent = "Regístrate para guardar tus datos y disfrutar una experiencia más personalizada.";
            textoBotonCuenta.textContent = "Crear cuenta";
            preguntaCuenta.textContent = "¿Ya tienes una cuenta?";
            botonCambiarCuenta.textContent = "Iniciar sesión";
            etiquetaNombre.style.display = "block";
            campoNombre.style.display = "block";
            campoNombre.required = true;
            campoContrasena.autocomplete = "new-password";
        }

        mensajeCuenta.textContent = "";
        formularioCuenta.reset();
    }

    if (botonCambiarCuenta) {
        botonCambiarCuenta.addEventListener("click", () => {
            modoInicioSesion = !modoInicioSesion;
            actualizarFormularioCuenta();
        });
    }

    if (formularioCuenta) {
        formularioCuenta.addEventListener("submit", (evento) => {
            evento.preventDefault();

            const nombre = campoNombre.value.trim();
            const correo = document.querySelector("#account-email").value.trim();
            const contrasena = campoContrasena.value;

            if (!modoInicioSesion && nombre.length < 2) {
                mensajeCuenta.textContent = "Escribe un nombre válido.";
                return;
            }

            if (contrasena.length < 6) {
                mensajeCuenta.textContent = "La contraseña debe tener al menos 6 caracteres.";
                return;
            }

            mensajeCuenta.textContent = modoInicioSesion
                ? "El inicio de sesión real se conectará próximamente."
                : "El registro real se conectará próximamente.";
        });
    }
});

