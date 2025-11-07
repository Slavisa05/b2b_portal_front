// ===== Seller Dashboard JavaScript =====

// Current logged-in seller (mock data)
let currentSeller = {
    id: 1,
    firstName: 'Marko',
    lastName: 'Petrović',
    email: 'marko@example.com',
    phone: '+381 60 123 4567',
    company: 'Marko Company',
    address: 'Bulevar Oslobođenja 123, Novi Sad',
    discount: 24, // percentage
    profileImage: 'slike/logo_nobg.png' // default image
};

// Sample products
let products = [
    {
        id: 1,
        name: 'Hikvision DS-2CD2143G0-I',
        category: 'video-nadzor',
        price: 15000,
        stock: 25,
        image: 'slike/logo_nobg.png',
        active: true
    },
    {
        id: 2,
        name: 'Dahua IPC-HFW1230S',
        category: 'video-nadzor',
        price: 8500,
        stock: 40,
        image: 'slike/logo_nobg.png',
        active: true
    },
    {
        id: 3,
        name: 'Commax DP-LA01',
        category: 'interfoni',
        price: 22000,
        stock: 0,
        image: 'slike/logo_nobg.png',
        active: true
    },
    {
        id: 4,
        name: 'Aiphone GT-1C7',
        category: 'interfoni',
        price: 28000,
        stock: 12,
        image: 'slike/logo_nobg.png',
        active: true
    },
    {
        id: 5,
        name: 'LED Panel 60x60 40W',
        category: 'led-paneli',
        price: 3500,
        stock: 100,
        image: 'slike/logo_nobg.png',
        active: true
    },
    {
        id: 6,
        name: 'LED Sijalica E27 12W',
        category: 'led-rasveta',
        price: 450,
        stock: 200,
        image: 'slike/logo_nobg.png',
        active: true
    }
];

// Sample orders for current seller
let myOrders = [
    {
        id: 1,
        sellerId: 1,
        products: [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 }
        ],
        date: '2024-01-15',
        status: 'completed'
    },
    {
        id: 2,
        sellerId: 1,
        products: [
            { productId: 4, quantity: 1 }
        ],
        date: '2024-01-20',
        status: 'processing'
    }
];

// Shopping cart
let cart = [];

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    initNavigation();
    loadDashboard();
    loadShop();
    loadMyOrders();
    loadSettings();
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('seller-sidebar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveSettings();
        });
    }

    // Profile image upload
    const profileImageInput = document.getElementById('profile-image-input');
    if (profileImageInput) {
        profileImageInput.addEventListener('change', handleProfileImageUpload);
    }
});

// ===== User Info =====
function loadUserInfo() {
    const fullName = `${currentSeller.firstName} ${currentSeller.lastName}`;
    
    document.getElementById('header-user-name').textContent = fullName;
    document.getElementById('header-user-discount').textContent = `Popust: ${currentSeller.discount}%`;
    document.getElementById('welcome-user-name').textContent = currentSeller.firstName;
    document.getElementById('welcome-discount').textContent = `${currentSeller.discount}%`;
    
    // Update all profile images
    updateProfileImages();
}

function updateProfileImages() {
    const avatarElements = document.querySelectorAll('.user-avatar, #profile-image-display');
    avatarElements.forEach(img => {
        img.src = currentSeller.profileImage;
    });
}

// ===== Navigation =====
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const section = item.dataset.section;
            showSection(section);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Update page title
            const titles = {
                'dashboard': 'Dashboard',
                'shop': 'Kupovina',
                'orders': 'Moje Porudžbine',
                'settings': 'Podešavanja'
            };
            document.getElementById('page-title').textContent = titles[section];
            
            // Close mobile menu
            const sidebar = document.getElementById('seller-sidebar');
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.seller-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`section-${sectionName}`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

// ===== Dashboard Section =====
function loadDashboard() {
    const stats = calculateSellerStats();
    
    document.getElementById('seller-total-orders').textContent = stats.totalOrders;
    document.getElementById('seller-total-spent').textContent = formatPrice(stats.totalSpent);
    document.getElementById('seller-total-saved').textContent = formatPrice(stats.totalSaved);
    
    loadRecentOrders();
}

function calculateSellerStats() {
    const sellerOrders = myOrders.filter(order => order.sellerId === currentSeller.id);
    
    let totalSpent = 0;
    let totalSaved = 0;
    
    sellerOrders.forEach(order => {
        order.products.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                const originalPrice = product.price * item.quantity;
                const discountedPrice = originalPrice * (1 - currentSeller.discount / 100);
                const saved = originalPrice - discountedPrice;
                
                totalSpent += discountedPrice;
                totalSaved += saved;
            }
        });
    });
    
    return {
        totalOrders: sellerOrders.length,
        totalSpent: totalSpent,
        totalSaved: totalSaved
    };
}

function loadRecentOrders() {
    const recentOrdersList = document.getElementById('recent-orders-list');
    const sellerOrders = myOrders
        .filter(order => order.sellerId === currentSeller.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    if (sellerOrders.length === 0) {
        recentOrdersList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Nemate porudžbina</p>';
        return;
    }
    
    recentOrdersList.innerHTML = sellerOrders.map(order => {
        const total = calculateOrderTotal(order);
        return `
            <div class="order-item">
                <div class="order-info">
                    <h4>Porudžbina #${order.id}</h4>
                    <p>${formatDate(order.date)}</p>
                </div>
                <div class="order-meta">
                    <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
                    <span class="order-price">${formatPrice(total)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function calculateOrderTotal(order) {
    let total = 0;
    order.products.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const discountedPrice = product.price * (1 - currentSeller.discount / 100);
            total += discountedPrice * item.quantity;
        }
    });
    return total;
}

// ===== Shop Section =====
function loadShop() {
    displayProducts(products);
}

function displayProducts(productsToDisplay) {
    const grid = document.getElementById('products-grid');
    
    const activeProducts = productsToDisplay.filter(p => p.active);
    
    if (activeProducts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 2rem;">Nema proizvoda</p>';
        return;
    }
    
    grid.innerHTML = activeProducts.map(product => {
        const discountedPrice = product.price * (1 - currentSeller.discount / 100);
        const isAvailable = product.stock > 0;
        
        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-body">
                    <div class="product-category">${getCategoryName(product.category)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-pricing">
                        <span class="original-price">${formatPrice(product.price)}</span>
                        <span class="discounted-price">${formatPrice(discountedPrice)}</span>
                        <span class="discount-badge">-${currentSeller.discount}%</span>
                    </div>
                    <p class="product-stock ${isAvailable ? 'stock-available' : 'stock-unavailable'}">
                        ${isAvailable ? `Na stanju: ${product.stock}` : 'Nema na stanju'}
                    </p>
                    <button class="btn-primary" onclick="addToCart(${product.id})" ${!isAvailable ? 'disabled' : ''}>
                        ${isAvailable ? 'Dodaj u korpu' : 'Nedostupno'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function applyFilters() {
    const searchTerm = document.getElementById('shop-search').value.toLowerCase();
    const categoryCheckboxes = document.querySelectorAll('.filter-checkbox input:checked');
    const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    
    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const discountedPrice = product.price * (1 - currentSeller.discount / 100);
        const matchesPrice = discountedPrice >= minPrice && discountedPrice <= maxPrice;
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    displayProducts(filtered);
}

function applySorting() {
    const sortValue = document.getElementById('sort-select').value;
    let sorted = [...products];
    
    switch(sortValue) {
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            sorted.sort((a, b) => {
                const priceA = a.price * (1 - currentSeller.discount / 100);
                const priceB = b.price * (1 - currentSeller.discount / 100);
                return priceA - priceB;
            });
            break;
        case 'price-desc':
            sorted.sort((a, b) => {
                const priceA = a.price * (1 - currentSeller.discount / 100);
                const priceB = b.price * (1 - currentSeller.discount / 100);
                return priceB - priceA;
            });
            break;
    }
    
    displayProducts(sorted);
}

function clearFilters() {
    document.getElementById('shop-search').value = '';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('sort-select').value = '';
    document.querySelectorAll('.filter-checkbox input').forEach(cb => cb.checked = false);
    
    displayProducts(products);
}

// ===== Shopping Cart =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('Nema više dostupnih proizvoda na stanju', 'warning');
            return;
        }
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('Proizvod dodat u korpu', 'success');
}

function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Korpa je prazna</p>';
    } else {
        cartItems.innerHTML = cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return '';
            
            const discountedPrice = product.price * (1 - currentSeller.discount / 100);
            
            return `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${product.name}</h4>
                        <p class="cart-item-price">${formatPrice(discountedPrice)}</p>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="updateQuantity(${item.productId}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.productId}, 1)">+</button>
                        </div>
                        <button class="cart-remove" onclick="removeFromCart(${item.productId})">Ukloni</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updateCartTotals();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.productId === productId);
    const product = products.find(p => p.id === productId);
    
    if (!item || !product) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else if (newQuantity <= product.stock) {
        item.quantity = newQuantity;
        updateCart();
    } else {
        showNotification('Nema više dostupnih proizvoda na stanju', 'warning');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCart();
    showNotification('Proizvod uklonjen iz korpe', 'success');
}

function updateCartTotals() {
    let originalTotal = 0;
    let discountAmount = 0;
    let finalTotal = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const itemOriginal = product.price * item.quantity;
            const itemDiscounted = itemOriginal * (1 - currentSeller.discount / 100);
            
            originalTotal += itemOriginal;
            finalTotal += itemDiscounted;
        }
    });
    
    discountAmount = originalTotal - finalTotal;
    
    document.getElementById('cart-original-total').textContent = formatPrice(originalTotal);
    document.getElementById('cart-discount-percent').textContent = currentSeller.discount;
    document.getElementById('cart-discount-amount').textContent = formatPrice(discountAmount);
    document.getElementById('cart-final-total').textContent = formatPrice(finalTotal);
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Korpa je prazna', 'warning');
        return;
    }
    
    // Create new order
    const newOrder = {
        id: myOrders.length + 1,
        sellerId: currentSeller.id,
        products: cart.map(item => ({ ...item })),
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
    };
    
    myOrders.push(newOrder);
    
    // Update product stock
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            product.stock -= item.quantity;
        }
    });
    
    // Clear cart
    cart = [];
    updateCart();
    toggleCart();
    
    // Refresh dashboard and orders
    loadDashboard();
    loadMyOrders();
    loadShop();
    
    showNotification('Porudžbina uspešno kreirana!', 'success');
}

// ===== Orders Section =====
function loadMyOrders() {
    displayMyOrders(myOrders);
}

function displayMyOrders(ordersToDisplay) {
    const ordersList = document.getElementById('my-orders-list');
    const sellerOrders = ordersToDisplay
        .filter(order => order.sellerId === currentSeller.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sellerOrders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Nemate porudžbina</p>';
        return;
    }
    
    ordersList.innerHTML = sellerOrders.map(order => {
        const total = calculateOrderTotal(order);
        const originalTotal = calculateOriginalTotal(order);
        const saved = originalTotal - total;
        
        return `
            <div class="order-card">
                <div class="order-card-header">
                    <div>
                        <h3 class="order-id">Porudžbina #${order.id}</h3>
                        <p class="order-date">${formatDate(order.date)}</p>
                    </div>
                    <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
                </div>
                <div class="order-card-body">
                    ${order.products.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        if (!product) return '';
                        
                        const discountedPrice = product.price * (1 - currentSeller.discount / 100);
                        
                        return `
                            <div class="order-product">
                                <div class="order-product-info">
                                    <img src="${product.image}" alt="${product.name}" class="order-product-image">
                                    <div class="order-product-details">
                                        <h4>${product.name}</h4>
                                        <p>Količina: ${item.quantity} × ${formatPrice(discountedPrice)}</p>
                                    </div>
                                </div>
                                <span class="order-price">${formatPrice(discountedPrice * item.quantity)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="order-card-footer">
                    <div class="order-total">
                        <span class="order-total-label">Ušteda: ${formatPrice(saved)}</span>
                        <span class="order-total-price">${formatPrice(total)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function calculateOriginalTotal(order) {
    let total = 0;
    order.products.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    });
    return total;
}

// Filter orders
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('my-orders-search');
    const statusFilter = document.getElementById('my-orders-status-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterMyOrders);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterMyOrders);
    }
});

function filterMyOrders() {
    const searchTerm = document.getElementById('my-orders-search')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('my-orders-status-filter')?.value || '';
    
    let filtered = myOrders.filter(order => {
        if (order.sellerId !== currentSeller.id) return false;
        
        const matchesSearch = order.id.toString().includes(searchTerm) || 
                             order.date.includes(searchTerm);
        const matchesStatus = !statusFilter || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    displayMyOrders(filtered);
}

// ===== Settings Section =====
function loadSettings() {
    document.getElementById('settings-firstname').value = currentSeller.firstName;
    document.getElementById('settings-lastname').value = currentSeller.lastName;
    document.getElementById('settings-email').value = currentSeller.email;
    document.getElementById('settings-phone').value = currentSeller.phone;
    document.getElementById('settings-company').value = currentSeller.company;
    document.getElementById('settings-address').value = currentSeller.address || '';
    document.getElementById('settings-discount').textContent = `${currentSeller.discount}%`;
}

function saveSettings() {
    currentSeller.firstName = document.getElementById('settings-firstname').value;
    currentSeller.lastName = document.getElementById('settings-lastname').value;
    currentSeller.email = document.getElementById('settings-email').value;
    currentSeller.phone = document.getElementById('settings-phone').value;
    currentSeller.company = document.getElementById('settings-company').value;
    currentSeller.address = document.getElementById('settings-address').value;
    
    loadUserInfo();
    showNotification('Podešavanja uspešno sačuvana!', 'success');
}

// ===== Profile Image =====
function handleProfileImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Molimo izaberite sliku (JPG, PNG, itd.)', 'warning');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Slika je prevelika. Maksimalna veličina je 5MB.', 'warning');
        return;
    }
    
    // Read and display the image
    const reader = new FileReader();
    reader.onload = (e) => {
        currentSeller.profileImage = e.target.result;
        updateProfileImages();
        showNotification('Slika uspešno promenjena!', 'success');
    };
    reader.readAsDataURL(file);
}

function removeProfileImage() {
    currentSeller.profileImage = 'slike/logo_nobg.png'; // Reset to default
    updateProfileImages();
    
    // Clear the file input
    const fileInput = document.getElementById('profile-image-input');
    if (fileInput) {
        fileInput.value = '';
    }
    
    showNotification('Slika uspešno uklonjena!', 'success');
}

// ===== Utility Functions =====
function formatPrice(price) {
    return new Intl.NumberFormat('sr-RS').format(Math.round(price)) + ' RSD';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getCategoryName(category) {
    const names = {
        'video-nadzor': 'Video Nadzor',
        'interfoni': 'Interfoni',
        'led-paneli': 'LED Paneli',
        'led-rasveta': 'LED Rasveta'
    };
    return names[category] || category;
}

function getStatusText(status) {
    const statuses = {
        'pending': 'Na čekanju',
        'processing': 'U obradi',
        'completed': 'Završeno',
        'cancelled': 'Otkazano'
    };
    return statuses[status] || status;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
