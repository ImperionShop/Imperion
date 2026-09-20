// ==========================================
// 1. CARGA DINÁMICA DE PRODUCTOS DESDE JSON
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});

function cargarProductos() {
  fetch('./productos.json')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar productos.json');
      return response.json();
    })
    .then(data => renderizarProductos(data))
    .catch(error => {
      console.error('Error al cargar el catálogo:', error);
      const grid = document.querySelector('.products-grid');
      if (grid) {
        grid.innerHTML = '<p style="color: #a1a1aa; text-align: center; grid-column: 1/-1;">Recuerda ejecutar Live Server para cargar productos.json</p>';
      }
    });
}

function renderizarProductos(productos) {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (productos.length === 0) {
    grid.innerHTML = '<p style="color: #a1a1aa; text-align: center; grid-column: 1/-1; padding: 40px 0;">No hay productos disponibles por ahora.</p>';
    return;
  }

  productos.forEach(prod => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    // Tarjeta sin imagen
    card.innerHTML = `
      <div class="product-info">
        ${prod.etiqueta ? `<span class="tag ${prod.etiqueta.toLowerCase()}">${prod.etiqueta}</span>` : ''}
        <h3>${prod.nombre}</h3>
        <p class="condition">Condición: ${prod.condicion} | Talla: ${prod.talla}</p>
        <div class="product-footer">
          <span class="price">$${prod.precio.toFixed(2)} USD</span>
          <button class="add-btn" onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio}, '')">
            <i data-lucide="plus"></i>
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 2. LÓGICA DEL CARRITO DE COMPRAS
// ==========================================
let carrito = [];

function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  }
}

function agregarAlCarrito(id, nombre, precio, imagen) {
  const existe = carrito.find(item => item.id === id);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
  }
  actualizarCarritoUI();
  toggleCart();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  actualizarCarritoUI();
}

function actualizarCarritoUI() {
  const cartBody = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');

  if (!cartBody) return;

  if (carrito.length === 0) {
    cartBody.innerHTML = '<p class="empty-cart-msg">Tu bolsa está vacía por ahora.</p>';
    if (cartCount) cartCount.textContent = '0';
    if (cartTotal) cartTotal.textContent = '$0.00 USD';
    return;
  }

  cartBody.innerHTML = '';
  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach(item => {
    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;

    const itemEl = document.createElement('div');
    itemEl.classList.add('cart-item');
    itemEl.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}">
      <div class="item-details">
        <h4>${item.nombre}</h4>
        <p>$${item.precio.toFixed(2)} x ${item.cantidad}</p>
      </div>
      <button class="remove-btn" onclick="eliminarDelCarrito(${item.id})">&times;</button>
    `;
    cartBody.appendChild(itemEl);
  });

  if (cartCount) cartCount.textContent = cantidadTotal;
  if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)} USD`;
}

function toggleFav(btn) {
  btn.classList.toggle('active');
}

// ==========================================
// 3. CARRUSEL / SLIDER DE PORTADA
// ==========================================
let currentSlide = 0;

function showSlide(index) {
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  if (!slides.length) return;

  if (index >= slides.length) currentSlide = 0;
  else if (index < 0) currentSlide = slides.length - 1;
  else currentSlide = index;

  slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function moveSlide(step) {
  showSlide(currentSlide + step);
}

function setSlide(index) {
  showSlide(index);
}

setInterval(() => {
  moveSlide(1);
}, 5000);
