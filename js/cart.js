// Shopping Cart Functionality

// Cart array to store items
let cart = [];

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem('restaurantCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(itemName, itemPrice) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: itemPrice,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${itemName} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    saveCart();
    updateCartUI();
    showNotification(`${itemName} removed from cart`);
}

// Update quantity of item in cart
function updateQuantity(itemName, change) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemName);
            return;
        }
    }
    saveCart();
    updateCartUI();
}

// Clear entire cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
    showNotification('Cart cleared');
}

// Calculate total price
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

// Update cart UI
function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart badge
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'block' : 'none';
    }
    
    // Update cart content if cart is open
    updateCartContent();
}

// Update cart content HTML
function updateCartContent() {
    const cartContent = document.getElementById('cart-content');
    const cartTotal = document.getElementById('cart-total');
    const cartEmpty = document.getElementById('cart-empty');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    
    if (!cartContent) return;
    
    if (cart.length === 0) {
        cartContent.innerHTML = '<p class="cart-empty-msg">Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '$0.00';
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (clearCartBtn) clearCartBtn.style.display = 'none';
    } else {
        cartContent.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price} × ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity('${item.name}', -1)" class="quantity-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)" class="quantity-btn">+</button>
                    <button onclick="removeFromCart('${item.name}')" class="remove-btn">×</button>
                </div>
            </div>
        `).join('');
        
        if (cartTotal) {
            cartTotal.textContent = `$${calculateTotal()}`;
        }
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (clearCartBtn) clearCartBtn.style.display = 'block';
    }
}

// Show/hide cart
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('cart-open');
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('cart-open');
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hide and remove after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});
