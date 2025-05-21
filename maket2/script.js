const products = [
    { id: 1, name: "EL003 Elleven Checkpoint-Friendly Compu-Backpack", price: 50.00, image: "./img/klipartz 3.png" },
    { id: 2, name: "EL003 Elleven Checkpoint-Friendly Compu-Backpack", price: 120.00, image: "./img/klipartz 3.png" },
    { id: 3, name: "EL003 Elleven Checkpoint-Friendly Compu-Backpack", price: 210.00, image: "./img/klipartz 3.png" },
    { id: 4, name: "EL003 Elleven Checkpoint-Friendly Compu-Backpack", price: 300.00, image: "./img/klipartz 3.png" },
    { id: 5, name: "EL003 Elleven Checkpoint-Friendly Compu-Backpack", price: 400.00, image: "./img/klipartz 3.png" },
    { id: 6, name: "EL003 Elleven Checkpoint-Friendly Compu-Backpack", price: 500.00, image: "./img/klipartz 3.png" },
    { id: 7, name: "EL003 Elleven Checkpoint-Friendly Compu-Backpack", price: 600.00, image: "./img/klipartz 3.png" },
    { id: 8, name: "EL003 Elleven Checkpoint-Friendly Compu-Backpack", price: 700.00, image: "./img/klipartz 3.png" },
];

// Корзина
let cart = [];

// DOM элементы
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsElement = document.getElementById('cart-items');
const catalogElement = document.getElementById('catalog');

// Функция открытия корзины
function openCart() {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCart();
}

// Функция закрытия корзины
function closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Обработчики событий для модального окна
closeCartBtn.addEventListener('click', closeCart);
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCart();
    }
});

// Инициализация каталога товаров
function initCatalog() {
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-card">
                <div class="img-section">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="text-section">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="desc">EL003 Elleven Checkpoint-Friendly Compu-Backpack</p>
                    <ul class="colors">
                        <li><img src="./img/Ellipse 2.png" alt=""></li>
                        <li><img src="./img/Ellipse 3.png" alt=""></li>
                        <li><img src="./img/Ellipse 4.png" alt=""></li>
                    </ul>
                </div>
                <div class="price-buy-section">
                    <p>From Price <br> $${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <img src="./img/shopping-basket.png" alt="Add to cart">
                    </button>
                </div>
            </div>
        `;
        
        catalogElement.appendChild(productCard);
    });
}

// Функция добавления товара в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 5, // Минимальное количество 5
                color: "Black",
                size: "XS"
            });
        }
        
        updateCart();
        openCart();
    }
}

// Функция изменения количества товара
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        // Не позволяем количеству быть меньше 5
        if (item.quantity < 5) {
            item.quantity = 5;
        }
        
        updateCart();
    }
}

// Функция удаления товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Обновление корзины
function updateCart() {
    cartItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        document.querySelector('.cart-total').textContent = 'Всего: $0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-color">Цвет <img src="./img/Ellipse 4.png" alt="Color"></div>
                <div class="cart-item-size">Размер <span>${item.size}</span></div>
            </div>
            <div class="cart-item-quantity">
                <div class="quantity-control">
                    <button class="quantity-btn minus" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="min-quantity">min</div>
            </div>
            <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <img src="./img/close.png" alt="Удалить">
            </button>
        `;
        
        cartItemsElement.appendChild(itemElement);
        
        if (index < cart.length - 1) {
            const separator = document.createElement('div');
            separator.className = 'item-separator';
            cartItemsElement.appendChild(separator);
        }
    });
    
    document.querySelector('.cart-total').textContent = `Всего: $${total.toFixed(2)}`;
}

// Оформление заказа
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    alert('Заказ оформлен! Менеджер свяжется с вами в течение часа.');
    cart = [];
    updateCart();
    closeCart();
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
});