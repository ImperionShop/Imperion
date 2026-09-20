// Estado del Carrito
let cart = [];

// Cargar productos automáticamente al abrir la página
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
});

// Función para leer el archivo productos.json
async function cargarProductos() {
  const contenedor = document.querySelector('.products-grid');
  if (!contenedor) return;

  try {
    const respuesta = await fetch('./productos.json');
    const productos = await respuesta.json();

    let htmlProductos = '';

    productos.forEach(prod => {
      htmlProductos += `
        <div class="product-card">
          <div class="product-img" style="background-image: url('${prod.imagen}');">
            <span class="badge-purple">${prod.badge || 'NUEVO'}</span>
            <button class="fav-btn"><i data-lucide="heart"></i></button>
          </div>
          <div class="product-details">
            <h4>${prod.nombre}</h4>
            <span class="condition">${prod.condicion}</span>
            <div class="card-bottom">
              <p class="price">$${prod.precio}.00 USD</p>
              <button class="add-btn" onclick="addToCart('${prod.nombre}', ${prod.precio})">
                <i data-lucide="plus"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    contenedor.innerHTML = htmlProductos;

    // Renderizar iconos de Lucide nuevamente para los nuevos botones
    if (window.lucide) {
      lucide.createIcons();
    }

  } catch (error) {
    console.error('Error al cargar productos.json:', error);
  }
}

// ==========================================
// FUNCIONES DEL CARRITO DE COMPRAS
// ==========================================

function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  }
}

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCartUI();
  toggleCart();
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCartUI();
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');

  if (!cartItemsContainer || !cartCount || !cartTotal) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg" style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem 0;">Tu bolsa está vacía por ahora.</p>';
    cartTotal.textContent = '$0.00 USD';
    return;
  }

  let itemsHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    itemsHTML += `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-dark); padding-bottom: 0.8rem;">
        <div>
          <h5 style="font-size: 0.85rem; color: #fff; margin-bottom: 0.2rem;">${item.name}</h5>
          <p style="font-size: 0.75rem; color: var(--purple-accent); font-weight: 600;">$${item.price}.00 USD x ${item.quantity}</p>
        </div>
        <button onclick="removeFromCart('${item.name}')" style="background: none; border: none; color: #ff5555; cursor: pointer; font-size: 1.2rem;">&times;</button>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = itemsHTML;
  cartTotal.textContent = `$${totalPrice}.00 USD`;
}
// ==========================================
// LÓGICA DEL CARRUSEL / SLIDER
// ==========================================
let currentSlide = 0;

function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  if (slides.length === 0) return;

  if (index >= slides.length) currentSlide = 0;
  else if (index < 0) currentSlide = slides.length - 1;
  else currentSlide = index;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function moveSlide(direction) {
  showSlide(currentSlide + direction);
}

function setSlide(index) {
  showSlide(index);
}

// Cambio automático cada 5 segundos
setInterval(() => {
  moveSlide(1);
}, 5000);