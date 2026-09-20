// Estado global del Carrito
let cart = [];
let total = 0;

// Abrir o cerrar el panel del carrito y la capa de fondo
function toggleCart() {
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  
  cartSidebar.classList.toggle('active');
  cartOverlay.classList.toggle('active');
}

// Agregar prenda al carrito
function addToCart(name, price) {
  cart.push({ name, price });
  total += price;
  updateCartUI();
  
  // Abrir automáticamente el carrito si está cerrado
  const cartSidebar = document.getElementById('cart-sidebar');
  if (!cartSidebar.classList.contains('active')) {
    toggleCart();
  }
}

// Actualizar la interfaz del carrito en tiempo real
function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  // Actualizar la cantidad de elementos en el contador
  cartCount.textContent = cart.length;

  // Actualizar el valor total acumulado
  cartTotal.textContent = `$${total.toFixed(2)} USD`;

  // Renderizar la lista de productos
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío por ahora.</p>';
  } else {
    cartItemsContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} USD</div>
        </div>
        <button onclick="removeFromCart(${index})" style="background:none; border:none; color: #ef4444; cursor:pointer;">Eliminar</button>
      </div>
    `).join('');
  }
}

// Eliminar un producto del carrito según su índice
function removeFromCart(index) {
  total -= cart[index].price;
  cart.splice(index, 1);
  updateCartUI();
}
