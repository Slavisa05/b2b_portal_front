// Admin Dashboard JavaScript

// Sample Data
let products = [
    {
        id: 1,
        name: 'Hikvision DS-2CD2043G2-I 4MP',
        category: 'video-nadzor',
        price: 15990,
        status: 'active',
        image: '/static/slike/p1.jpg',
        description: '4MP AcuSense mrežna bullet kamera'
    },
    {
        id: 2,
        name: 'Hikvision Video Interfon DS-KV8113-WME1',
        category: 'interfoni',
        price: 12500,
        status: 'active',
        image: '/static/slike/p1.jpg',
        description: 'WiFi video interfon sa pozivom'
    },
    {
        id: 3,
        name: 'V-TAC LED Panel 36W 60x60cm',
        category: 'led-paneli',
        price: 2890,
        status: 'active',
        image: '/static/slike/p1.jpg',
        description: 'Kvadratni LED panel 4000K'
    },
    {
        id: 4,
        name: 'Philips LED Sijalica 9W E27',
        category: 'led-rasveta',
        price: 450,
        status: 'active',
        image: '/static/slike/p1.jpg',
        description: 'LED sijalica toplo bela'
    }
];

let sellers = [
    {
        id: 1,
        firstname: 'Marko',
        lastname: 'Petrović',
        email: 'marko.petrovic@example.com',
        phone: '+381 64 123 4567',
        company: 'Elektro Centar Beograd',
        address: 'Bulevar kralja Aleksandra 15, Beograd',
        status: 'active',
        discount: 24
    },
    {
        id: 2,
        firstname: 'Ana',
        lastname: 'Jovanović',
        email: 'ana.jovanovic@example.com',
        phone: '+381 63 987 6543',
        company: 'LED Solutions Novi Sad',
        address: 'Narodnog fronta 23, Novi Sad',
        status: 'active',
        discount: 18
    },
    {
        id: 3,
        firstname: 'Stefan',
        lastname: 'Nikolić',
        email: 'stefan.nikolic@example.com',
        phone: '+381 65 555 1234',
        company: 'Security Systems Niš',
        address: 'Obrenovićeva 10, Niš',
        status: 'inactive',
        discount: 12
    }
];

// Sample Orders Data
let orders = [
    {
        id: 1001,
        sellerId: 1,
        productId: 1,
        quantity: 2,
        date: '2025-11-07',
        status: 'completed'
    },
    {
        id: 1002,
        sellerId: 2,
        productId: 3,
        quantity: 5,
        date: '2025-11-06',
        status: 'processing'
    },
    {
        id: 1003,
        sellerId: 1,
        productId: 2,
        quantity: 1,
        date: '2025-11-05',
        status: 'pending'
    },
    {
        id: 1004,
        sellerId: 3,
        productId: 4,
        quantity: 10,
        date: '2025-11-04',
        status: 'completed'
    },
    {
        id: 1005,
        sellerId: 2,
        productId: 1,
        quantity: 3,
        date: '2025-11-03',
        status: 'cancelled'
    }
];

// Navigation
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
            
            // Close mobile menu if open
            document.getElementById('admin-sidebar').classList.remove('active');
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'products': 'Upravljanje Proizvodima',
            'sellers': 'Upravljanje Prodavcima',
            'orders': 'Porudžbine',
            'settings': 'Podešavanja'
        };
        document.getElementById('page-title').textContent = titles[sectionName] || 'Dashboard';
        
        // Update navigation active state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.dataset.section === sectionName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('admin-sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }
    
    // Open sidebar
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }
    
    // Close button inside sidebar
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // Close when clicking overlay
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Close sidebar when clicking on nav items (mobile)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 767) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });
}

// Products Management
function loadProducts() {
    const container = document.getElementById('products-table-body');
    
    console.log('loadProducts called');
    console.log('Container found:', container);
    console.log('Products array:', products);
    
    if (!container) {
        console.error('products-table-body element not found!');
        return;
    }
    
    container.innerHTML = '';
    
    products.forEach(product => {
        console.log('Creating card for product:', product.name);
        // Product card (used on all devices)
        const card = document.createElement('div');
        card.className = 'mobile-product-card';
        card.innerHTML = `
            <div class="product-header">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-main-info">
                    <h4>${product.name}</h4>
                    <div class="product-id">#${product.id}</div>
                    <span class="status-badge ${product.status}">${product.status === 'active' ? 'Aktivan' : 'Neaktivan'}</span>
                </div>
            </div>
            <div class="product-details">
                <div class="detail-item">
                    <span class="detail-label">Kategorija</span>
                    <span class="detail-value">${getCategoryName(product.category)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Cena</span>
                    <span class="detail-value">${formatPrice(product.price)}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="action-btn edit" onclick="editProduct(${product.id})" title="Izmeni">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Obriši">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
    
    console.log('All cards created. Total:', products.length);
    updateStats();
}

function getCategoryName(category) {
    const categories = {
        'video-nadzor': 'Video Nadzor',
        'interfoni': 'Interfoni',
        'led-paneli': 'LED Paneli',
        'led-rasveta': 'LED Rasveta'
    };
    return categories[category] || category;
}

function formatPrice(price) {
    return new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
        minimumFractionDigits: 0
    }).format(price);
}

// Product Modal
function openProductModal(productId = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    const form = document.getElementById('product-form');
    
    form.reset();
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            title.textContent = 'Izmeni Proizvod';
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-description').value = product.description || '';
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-image').value = product.image;
            document.getElementById('product-status').value = product.status;
        }
    } else {
        title.textContent = 'Dodaj Proizvod';
        document.getElementById('product-id').value = '';
    }
    
    modal.classList.add('active');
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
}

function editProduct(id) {
    openProductModal(id);
}

function deleteProduct(id) {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj proizvod?')) {
        products = products.filter(p => p.id !== id);
        loadProducts();
        showNotification('Proizvod je uspešno obrisan!', 'success');
    }
}

// Product Form Submit
function initProductForm() {
    const form = document.getElementById('product-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const id = document.getElementById('product-id').value;
            const productData = {
                name: document.getElementById('product-name').value,
                category: document.getElementById('product-category').value,
                description: document.getElementById('product-description').value,
                price: parseFloat(document.getElementById('product-price').value),
                image: document.getElementById('product-image').value || 'slike/default-product.jpg',
                status: document.getElementById('product-status').value
            };
            
            if (id) {
                // Update existing product
                const index = products.findIndex(p => p.id == id);
                if (index !== -1) {
                    products[index] = { ...products[index], ...productData };
                    showNotification('Proizvod je uspešno ažuriran!', 'success');
                }
            } else {
                // Add new product
                const newId = Math.max(...products.map(p => p.id), 0) + 1;
                products.push({ id: newId, ...productData });
                showNotification('Proizvod je uspešno dodat!', 'success');
            }
            
            loadProducts();
            closeProductModal();
        });
    }
}

// Sellers Management
function loadSellers() {
    const container = document.getElementById('sellers-table-body');
    
    console.log('loadSellers called');
    console.log('Container found:', container);
    
    if (!container) {
        console.error('sellers-table-body element not found!');
        return;
    }
    
    container.innerHTML = '';
    
    sellers.forEach(seller => {
        // Calculate seller's orders and total spent
        const sellerOrders = orders.filter(o => o.sellerId === seller.id);
        const orderCount = sellerOrders.length;
        
        let totalSpent = 0;
        sellerOrders.forEach(order => {
            const product = products.find(p => p.id === order.productId);
            if (product) {
                const originalPrice = product.price * order.quantity;
                const finalPrice = calculateDiscountedPrice(originalPrice, seller.discount);
                totalSpent += finalPrice;
            }
        });
        
        console.log('Creating card for seller:', seller.firstname, seller.lastname);
        
        // Seller card (used on all devices)
        const card = document.createElement('div');
        card.className = 'mobile-seller-card';
        card.innerHTML = `
            <div class="seller-header">
                <div class="seller-main-info">
                    <h4>${seller.firstname} ${seller.lastname}</h4>
                    <div class="seller-company">${seller.company}</div>
                    <div class="seller-id">#${seller.id}</div>
                </div>
                <span class="status-badge ${seller.status}">${seller.status === 'active' ? 'Aktivan' : 'Neaktivan'}</span>
            </div>
            <div class="seller-details">
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${seller.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Telefon</span>
                    <span class="detail-value">${seller.phone}</span>
                </div>
            </div>
            <div class="seller-stats">
                <div class="stat-item">
                    <span class="stat-label">Popust</span>
                    <span class="stat-value" style="color: var(--secondary);">${seller.discount || 0}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Porudžbine</span>
                    <span class="stat-value highlight">${orderCount}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Potrošeno</span>
                    <span class="stat-value highlight">${formatPrice(totalSpent)}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="action-btn edit" onclick="editSeller(${seller.id})" title="Izmeni">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="action-btn delete" onclick="deleteSeller(${seller.id})" title="Obriši">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
    
    console.log('All seller cards created. Total:', sellers.length);
    updateStats();
}

// Seller Modal
function openSellerModal(sellerId = null) {
    const modal = document.getElementById('seller-modal');
    const title = document.getElementById('seller-modal-title');
    const form = document.getElementById('seller-form');
    
    form.reset();
    
    if (sellerId) {
        const seller = sellers.find(s => s.id === sellerId);
        if (seller) {
            title.textContent = 'Izmeni Prodavca';
            document.getElementById('seller-id').value = seller.id;
            document.getElementById('seller-firstname').value = seller.firstname;
            document.getElementById('seller-lastname').value = seller.lastname;
            document.getElementById('seller-email').value = seller.email;
            document.getElementById('seller-phone').value = seller.phone;
            document.getElementById('seller-company').value = seller.company;
            document.getElementById('seller-address').value = seller.address || '';
            document.getElementById('seller-discount').value = seller.discount || 0;
            document.getElementById('seller-status').value = seller.status;
        }
    } else {
        title.textContent = 'Dodaj Prodavca';
        document.getElementById('seller-id').value = '';
        document.getElementById('seller-discount').value = 0;
    }
    
    modal.classList.add('active');
}

function closeSellerModal() {
    const modal = document.getElementById('seller-modal');
    modal.classList.remove('active');
}

function editSeller(id) {
    openSellerModal(id);
}

function deleteSeller(id) {
    if (confirm('Da li ste sigurni da želite da obrišete ovog prodavca?')) {
        sellers = sellers.filter(s => s.id !== id);
        loadSellers();
        showNotification('Prodavac je uspešno obrisan!', 'success');
    }
}

// Seller Form Submit
function initSellerForm() {
    const form = document.getElementById('seller-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const id = document.getElementById('seller-id').value;
            const discount = parseInt(document.getElementById('seller-discount').value);
            
            // Validacija popusta
            if (discount < 0 || discount > 100) {
                showNotification('Popust mora biti između 0 i 100%!', 'error');
                return;
            }
            
            const sellerData = {
                firstname: document.getElementById('seller-firstname').value,
                lastname: document.getElementById('seller-lastname').value,
                email: document.getElementById('seller-email').value,
                phone: document.getElementById('seller-phone').value,
                company: document.getElementById('seller-company').value,
                address: document.getElementById('seller-address').value,
                status: document.getElementById('seller-status').value,
                discount: discount
            };
            
            if (id) {
                // Update existing seller
                const index = sellers.findIndex(s => s.id == id);
                if (index !== -1) {
                    sellers[index] = { ...sellers[index], ...sellerData };
                    showNotification('Prodavac je uspešno ažuriran!', 'success');
                }
            } else {
                // Add new seller
                const newId = Math.max(...sellers.map(s => s.id), 0) + 1;
                sellers.push({ id: newId, ...sellerData });
                showNotification('Prodavac je uspešno dodat!', 'success');
            }
            
            loadSellers();
            closeSellerModal();
        });
    }
}

// Search and Filters
function initSearchAndFilters() {
    // Product search
    const productSearch = document.getElementById('product-search');
    if (productSearch) {
        productSearch.addEventListener('input', filterProducts);
    }
    
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterProducts);
    }
    
    // Seller search
    const sellerSearch = document.getElementById('seller-search');
    if (sellerSearch) {
        sellerSearch.addEventListener('input', filterSellers);
    }
    
    const sellerStatusFilter = document.getElementById('seller-status-filter');
    if (sellerStatusFilter) {
        sellerStatusFilter.addEventListener('change', filterSellers);
    }

    // Order search
    const orderSearch = document.getElementById('order-search');
    if (orderSearch) {
        orderSearch.addEventListener('input', filterOrders);
    }

    const orderStatusFilter = document.getElementById('order-status-filter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', filterOrders);
    }

    const orderDateFilter = document.getElementById('order-date-filter');
    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', filterOrders);
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const status = document.getElementById('status-filter').value;
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        const matchesStatus = !status || product.status === status;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(filteredProducts) {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-image"></td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${formatPrice(product.price)}</td>
            <td><span class="status-badge ${product.status}">${product.status === 'active' ? 'Aktivan' : 'Neaktivan'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editProduct(${product.id})" title="Izmeni">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Obriši">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterSellers() {
    const searchTerm = document.getElementById('seller-search').value.toLowerCase();
    const status = document.getElementById('seller-status-filter').value;
    
    const filteredSellers = sellers.filter(seller => {
        const matchesSearch = 
            seller.firstname.toLowerCase().includes(searchTerm) ||
            seller.lastname.toLowerCase().includes(searchTerm) ||
            seller.email.toLowerCase().includes(searchTerm) ||
            seller.company.toLowerCase().includes(searchTerm);
        const matchesStatus = !status || seller.status === status;
        
        return matchesSearch && matchesStatus;
    });
    
    displayFilteredSellers(filteredSellers);
}

function displayFilteredSellers(filteredSellers) {
    const tbody = document.getElementById('sellers-table-body');
    tbody.innerHTML = '';
    
    filteredSellers.forEach(seller => {
        // Calculate seller's orders and total spent
        const sellerOrders = orders.filter(o => o.sellerId === seller.id);
        const orderCount = sellerOrders.length;
        
        let totalSpent = 0;
        sellerOrders.forEach(order => {
            const product = products.find(p => p.id === order.productId);
            if (product) {
                const originalPrice = product.price * order.quantity;
                const finalPrice = calculateDiscountedPrice(originalPrice, seller.discount);
                totalSpent += finalPrice;
            }
        });
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${seller.id}</td>
            <td>${seller.firstname} ${seller.lastname}</td>
            <td>${seller.email}</td>
            <td>${seller.phone}</td>
            <td>${seller.company}</td>
            <td><span class="discount-badge">${seller.discount || 0}%</span></td>
            <td><strong style="color: var(--secondary);">${orderCount}</strong></td>
            <td><strong style="color: var(--primary);">${formatPrice(totalSpent)}</strong></td>
            <td><span class="status-badge ${seller.status}">${seller.status === 'active' ? 'Aktivan' : 'Neaktivan'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editSeller(${seller.id})" title="Izmeni">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="deleteSeller(${seller.id})" title="Obriši">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update Stats
function updateStats() {
    const totalProducts = products.length;
    const activeSellers = sellers.filter(s => s.status === 'active').length;
    
    const totalProductsEl = document.getElementById('total-products');
    const totalSellersEl = document.getElementById('total-sellers');
    
    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
    if (totalSellersEl) totalSellersEl.textContent = activeSellers;
}

// Helper function: Calculate price with discount
function calculateDiscountedPrice(originalPrice, discountPercent) {
    if (discountPercent < 0 || discountPercent > 100) {
        return originalPrice;
    }
    const discountAmount = (originalPrice * discountPercent) / 100;
    return originalPrice - discountAmount;
}

// Helper function: Get seller discount by ID
function getSellerDiscount(sellerId) {
    const seller = sellers.find(s => s.id === sellerId);
    return seller ? seller.discount : 0;
}

// Helper function: Get seller statistics
function getSellerStats(sellerId) {
    const sellerOrders = orders.filter(o => o.sellerId === sellerId);
    const orderCount = sellerOrders.length;
    
    let totalSpent = 0;
    let totalSaved = 0;
    
    sellerOrders.forEach(order => {
        const product = products.find(p => p.id === order.productId);
        const seller = sellers.find(s => s.id === sellerId);
        
        if (product && seller) {
            const originalPrice = product.price * order.quantity;
            const finalPrice = calculateDiscountedPrice(originalPrice, seller.discount);
            totalSpent += finalPrice;
            totalSaved += (originalPrice - finalPrice);
        }
    });
    
    return {
        orderCount,
        totalSpent,
        totalSaved,
        averageOrderValue: orderCount > 0 ? totalSpent / orderCount : 0
    };
}

// Example usage for order calculation:
// const originalPrice = 20000;
// const sellerDiscount = getSellerDiscount(1); // Returns 24
// const finalPrice = calculateDiscountedPrice(originalPrice, sellerDiscount);
// console.log(`Originalna cena: ${originalPrice} RSD`);
// console.log(`Popust: ${sellerDiscount}%`);
// console.log(`Konačna cena: ${finalPrice} RSD`);

// Orders Management
function loadOrders() {
    const container = document.getElementById('orders-table-body');
    
    console.log('loadOrders called');
    console.log('Container found:', container);
    
    if (!container) {
        console.error('orders-table-body element not found!');
        return;
    }
    
    container.innerHTML = '';
    
    orders.forEach(order => {
        const seller = sellers.find(s => s.id === order.sellerId);
        const product = products.find(p => p.id === order.productId);
        
        if (!seller || !product) return;
        
        const originalPrice = product.price * order.quantity;
        const discount = seller.discount;
        const finalPrice = calculateDiscountedPrice(originalPrice, discount);
        const discountAmount = originalPrice - finalPrice;
        
        console.log('Creating card for order:', order.id);
        
        // Order card (used on all devices)
        const card = document.createElement('div');
        card.className = 'mobile-order-card';
        card.innerHTML = `
            <div class="order-header">
                <div class="order-main-info">
                    <h4>${seller.firstname} ${seller.lastname}</h4>
                    <div class="order-id">Porudžbina #${order.id}</div>
                    <div class="order-date">${formatDate(order.date)}</div>
                </div>
                <span class="order-status-badge ${order.status}">${getStatusName(order.status)}</span>
            </div>
            <div class="order-product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-quantity">Količina: ${order.quantity} kom × ${formatPrice(product.price)}</div>
            </div>
            <div class="order-pricing">
                <div class="price-item">
                    <span class="price-label">Originalna cena</span>
                    <span class="price-value original">${formatPrice(originalPrice)}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Popust (${discount}%)</span>
                    <span class="price-value discount">-${formatPrice(discountAmount)}</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Konačna cena</span>
                    <span class="price-value final">${formatPrice(finalPrice)}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="action-btn edit" onclick="viewOrderDetails(${order.id})" title="Detalji">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
    
    console.log('All order cards created. Total:', orders.length);
    updateOrderStats();
}

function getStatusName(status) {
    const statuses = {
        'pending': 'Na čekanju',
        'processing': 'U obradi',
        'completed': 'Završeno',
        'cancelled': 'Otkazano'
    };
    return statuses[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

function updateOrderStats() {
    const totalOrders = orders.length;
    let totalRevenue = 0;
    let totalDiscount = 0;
    
    orders.forEach(order => {
        const seller = sellers.find(s => s.id === order.sellerId);
        const product = products.find(p => p.id === order.productId);
        
        if (seller && product) {
            const originalPrice = product.price * order.quantity;
            const finalPrice = calculateDiscountedPrice(originalPrice, seller.discount);
            totalRevenue += finalPrice;
            totalDiscount += (originalPrice - finalPrice);
        }
    });
    
    const totalOrdersEl = document.getElementById('total-orders');
    const totalRevenueEl = document.getElementById('total-revenue');
    const totalDiscountEl = document.getElementById('total-discount');
    
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (totalRevenueEl) totalRevenueEl.textContent = formatPrice(totalRevenue);
    if (totalDiscountEl) totalDiscountEl.textContent = formatPrice(totalDiscount);
}

// Order Details Modal
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const seller = sellers.find(s => s.id === order.sellerId);
    const product = products.find(p => p.id === order.productId);
    
    if (!seller || !product) return;
    
    const originalPrice = product.price * order.quantity;
    const discount = seller.discount;
    const finalPrice = calculateDiscountedPrice(originalPrice, discount);
    const discountAmount = originalPrice - finalPrice;
    
    // Populate modal
    document.getElementById('order-detail-id').textContent = order.id;
    document.getElementById('order-detail-customer').textContent = `${seller.firstname} ${seller.lastname}`;
    document.getElementById('order-detail-email').textContent = seller.email;
    document.getElementById('order-detail-phone').textContent = seller.phone;
    document.getElementById('order-detail-date').textContent = formatDate(order.date);
    
    // Products list
    const productsList = document.getElementById('order-products-list');
    productsList.innerHTML = `
        <div class="order-product-item">
            <div class="order-product-info">
                <img src="${product.image}" alt="${product.name}" class="order-product-image">
                <div class="order-product-details">
                    <h4>${product.name}</h4>
                    <p>Količina: ${order.quantity} kom × ${formatPrice(product.price)}</p>
                </div>
            </div>
            <div class="price-cell">
                <span class="original-price">${formatPrice(originalPrice)}</span>
                <span class="final-price">${formatPrice(finalPrice)}</span>
            </div>
        </div>
    `;
    
    // Pricing
    document.getElementById('order-original-total').textContent = formatPrice(originalPrice);
    document.getElementById('order-discount-percent').textContent = discount;
    document.getElementById('order-discount-amount').textContent = `-${formatPrice(discountAmount)}`;
    document.getElementById('order-final-total').textContent = formatPrice(finalPrice);
    
    // Status
    document.getElementById('order-status-update').value = order.status;
    
    // Store current order ID for status update
    window.currentOrderId = orderId;
    
    // Show modal
    document.getElementById('order-modal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
}

function updateOrderStatus() {
    const orderId = window.currentOrderId;
    const newStatus = document.getElementById('order-status-update').value;
    
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        loadOrders();
        closeOrderModal();
        showNotification('Status porudžbine je uspešno ažuriran!', 'success');
    }
}

// Filter Orders
function filterOrders() {
    const searchTerm = document.getElementById('order-search').value.toLowerCase();
    const statusFilter = document.getElementById('order-status-filter').value;
    const dateFilter = document.getElementById('order-date-filter').value;
    
    const filteredOrders = orders.filter(order => {
        const seller = sellers.find(s => s.id === order.sellerId);
        if (!seller) return false;
        
        const matchesSearch = 
            order.id.toString().includes(searchTerm) ||
            seller.firstname.toLowerCase().includes(searchTerm) ||
            seller.lastname.toLowerCase().includes(searchTerm) ||
            seller.company.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || order.status === statusFilter;
        const matchesDate = !dateFilter || order.date === dateFilter;
        
        return matchesSearch && matchesStatus && matchesDate;
    });
    
    displayFilteredOrders(filteredOrders);
}

function displayFilteredOrders(filteredOrders) {
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const seller = sellers.find(s => s.id === order.sellerId);
        const product = products.find(p => p.id === order.productId);
        
        if (!seller || !product) return;
        
        const originalPrice = product.price * order.quantity;
        const discount = seller.discount;
        const finalPrice = calculateDiscountedPrice(originalPrice, discount);
        const discountAmount = originalPrice - finalPrice;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${order.id}</strong></td>
            <td>${seller.firstname} ${seller.lastname}<br><small>${seller.company}</small></td>
            <td>${product.name}<br><small>${getCategoryName(product.category)}</small></td>
            <td>${order.quantity} kom</td>
            <td>
                <div class="price-cell">
                    <span class="original-price">${formatPrice(originalPrice)}</span>
                </div>
            </td>
            <td><span class="discount-badge">${discount}%</span></td>
            <td>
                <div class="price-cell">
                    <span class="final-price">${formatPrice(finalPrice)}</span>
                    <small class="discount-amount">-${formatPrice(discountAmount)}</small>
                </div>
            </td>
            <td>${formatDate(order.date)}</td>
            <td><span class="order-status-badge ${order.status}">${getStatusName(order.status)}</span></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" onclick="viewOrderDetails(${order.id})" title="Detalji">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modals on overlay click
function initModalClose() {
    const modals = document.querySelectorAll('.modal-overlay');
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initProductForm();
    initSellerForm();
    initSearchAndFilters();
    initModalClose();
    loadProducts();
    loadSellers();
    loadOrders();
    updateStats();
});

// Add animations to CSS
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
