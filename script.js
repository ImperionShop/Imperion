// Estado del Carrito
let cart = [];

// Función para abrir/cerrar el carrito
function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// Función para agregar productos
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
  toggleCart(); // Abre el carrito automáticamente al añadir
}

// Función para eliminar un producto
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCartUI();
}

// Actualizar la interfaz del carrito
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');

  // Calcular total de productos
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Si está vacío
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu bolsa de compra está vacía por ahora.</p>';
    cartTotal.textContent = '$0.00 USD';
    return;
  }

  // Generar HTML de productos
  let itemsHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    itemsHTML += `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(212, 175, 55, 0.15); padding-bottom: 1rem;">
        <div>
          <h5 style="font-family: 'Cinzel', serif; font-size: 0.95rem; color: #fff; margin-bottom: 0.2rem;">${item.name}</h5>
          <p style="font-size: 0.8rem; color: var(--primary-gold); font-weight: 600;">$${item.price}.00 USD x ${item.quantity}</p>
        </div>
        <button onclick="removeFromCart('${item.name}')" style="background: none; border: none; color: #ff5555; cursor: pointer; font-size: 1.2rem;">&times;</button>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = itemsHTML;
  cartTotal.textContent = `$${totalPrice}.00 USD`;
}