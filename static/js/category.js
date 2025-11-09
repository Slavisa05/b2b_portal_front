document.addEventListener('DOMContentLoaded', () => {
    // Mobile Filter Toggle Functionality
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterCloseBtn = document.getElementById('filterCloseBtn');
    const filterApplyBtn = document.getElementById('filterApplyBtn');
    const filterSidebar = document.getElementById('filterSidebar');
    const filterOverlay = document.getElementById('filterOverlay');

    const openFilterSidebar = () => {
        filterSidebar.classList.add('active');
        filterOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeFilterSidebar = () => {
        filterSidebar.classList.remove('active');
        filterOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', openFilterSidebar);
    }

    if (filterCloseBtn) {
        filterCloseBtn.addEventListener('click', closeFilterSidebar);
    }

    if (filterApplyBtn) {
        filterApplyBtn.addEventListener('click', closeFilterSidebar);
    }

    if (filterOverlay) {
        filterOverlay.addEventListener('click', closeFilterSidebar);
    }

    // Close sidebar on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && filterSidebar.classList.contains('active')) {
            closeFilterSidebar();
        }
    });

    // Cache DOM elements
    const categoryGrid = document.querySelector('.category-grid');
    const sortSelect = document.getElementById('sortProducts');
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const priceRange = document.getElementById('priceRange');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const clearFilterBtn = document.querySelector('.filter-clear');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');

    // State management
    let products = [];
    let activeFilters = {
        brands: [],
        types: [],
        resolutions: [],
        priceRange: {
            min: 0,
            max: 200000
        }
    };

    // Initialize products array
    const initializeProducts = () => {
        const productElements = document.querySelectorAll('.product-card');
        products = Array.from(productElements).map(product => ({
            element: product,
            brand: product.dataset.brand,
            type: product.dataset.type,
            resolution: product.dataset.resolution,
            price: parseInt(product.dataset.price),
            name: product.querySelector('h4').textContent,
            description: product.querySelector('.product-desc').textContent
        }));
    };

    // Filter functions
    const applyFilters = () => {
        products.forEach(product => {
            const matchesBrand = activeFilters.brands.length === 0 || 
                               activeFilters.brands.includes(product.brand);
            const matchesType = activeFilters.types.length === 0 || 
                              activeFilters.types.includes(product.type);
            const matchesResolution = activeFilters.resolutions.length === 0 || 
                                    activeFilters.resolutions.includes(product.resolution);
            const matchesPrice = product.price >= activeFilters.priceRange.min && 
                               product.price <= activeFilters.priceRange.max;

            if (matchesBrand && matchesType && matchesResolution && matchesPrice) {
                product.element.style.display = '';
            } else {
                product.element.style.display = 'none';
            }
        });
        updateProductCount();
    };

    // Sort functions
    const sortProducts = (sortType) => {
        const sortedProducts = [...products].sort((a, b) => {
            switch (sortType) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                // Add more sorting options as needed
                default:
                    return 0;
            }
        });

        // Reorder DOM elements
        sortedProducts.forEach(product => {
            categoryGrid.appendChild(product.element);
        });
    };

    // Price range functionality
    const updatePriceRange = () => {
        const min = parseInt(minPriceInput.value) || 0;
        const max = parseInt(maxPriceInput.value) || parseInt(priceRange.max);
        
        activeFilters.priceRange.min = min;
        activeFilters.priceRange.max = max;
        
        applyFilters();
    };

    // Update product count
    const updateProductCount = () => {
        const visibleProducts = products.filter(p => 
            p.element.style.display !== 'none'
        ).length;
        
        const countElement = document.querySelector('.products-count');
        if (countElement) {
            countElement.textContent = `${visibleProducts} proizvoda`;
        }
    };

    // Event Listeners
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const type = e.target.name; // brand, type, resolution
            const value = e.target.value;
            
            if (e.target.checked) {
                activeFilters[type + 's'].push(value);
            } else {
                activeFilters[type + 's'] = activeFilters[type + 's']
                    .filter(item => item !== value);
            }
            
            applyFilters();
        });
    });

    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            minPriceInput.value = e.target.value;
            updatePriceRange();
        });
    }

    if (minPriceInput && maxPriceInput) {
        minPriceInput.addEventListener('change', updatePriceRange);
        maxPriceInput.addEventListener('change', updatePriceRange);
    }

    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            // Reset checkboxes
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            // Reset price inputs
            if (minPriceInput && maxPriceInput) {
                minPriceInput.value = 0;
                maxPriceInput.value = priceRange.max;
                priceRange.value = priceRange.max / 2;
            }

            // Reset active filters
            activeFilters = {
                brands: [],
                types: [],
                resolutions: [],
                priceRange: {
                    min: 0,
                    max: parseInt(priceRange.max)
                }
            };

            applyFilters();

            // Close sidebar on mobile after clearing filters
            if (window.innerWidth < 1024) {
                closeFilterSidebar();
            }
        });
    }

    // Quick view button handlers
    document.addEventListener('click', (e) => {
        if (e.target.closest('.quick-view-btn')) {
            const productCard = e.target.closest('.product-card');
            const productData = products.find(p => p.element === productCard);
            if (productData) {
                createQuickViewModal(productData);
            }
        }
    });

    // Add to cart functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                // Add your cart logic here
                console.log('Adding to cart:', productCard.querySelector('h4').textContent);
                // You can dispatch a custom event for cart handling
                const event = new CustomEvent('addToCart', {
                    detail: {
                        productId: productCard.dataset.id,
                        name: productCard.querySelector('h4').textContent,
                        price: productCard.dataset.price
                    }
                });
                document.dispatchEvent(event);
            }
        }
    });

    // Initialize
    initializeProducts();
    updateProductCount();
});

// Category page functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const priceRange = document.getElementById('priceRange');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const clearFilterBtn = document.querySelector('.filter-clear');
    const productsGrid = document.querySelector('.products-grid');

    // Price range slider functionality
    if (priceRange && minPriceInput && maxPriceInput) {
        const updatePriceInputs = (value) => {
            const [min, max] = value.split(',').map(Number);
            minPriceInput.value = min;
            maxPriceInput.value = max;
            filterProducts();
        };

        // Update price range and inputs
        const updatePriceRangeUI = (min, max) => {
            min = Math.max(0, Math.min(min, max)); // Ensure min is between 0 and max
            max = Math.min(parseInt(priceRange.max), Math.max(min, max)); // Ensure max is between min and maxPossible
            
            minPriceInput.value = min;
            maxPriceInput.value = max;
            priceRange.value = min; // Update slider to min position
            filterProducts();
        };

        // Update when slider changes
        priceRange.addEventListener('input', (e) => {
            const currentMin = parseInt(e.target.value);
            const currentMax = parseInt(maxPriceInput.value);
            updatePriceRangeUI(currentMin, currentMax);
        });

        // Update when min input changes
        minPriceInput.addEventListener('change', () => {
            const newMin = parseInt(minPriceInput.value) || 0;
            const currentMax = parseInt(maxPriceInput.value);
            updatePriceRangeUI(newMin, currentMax);
        });

        // Update when max input changes
        maxPriceInput.addEventListener('change', () => {
            const currentMin = parseInt(minPriceInput.value);
            const newMax = parseInt(maxPriceInput.value) || parseInt(priceRange.max);
            updatePriceRangeUI(currentMin, newMax);
        });
    }

    // Filter checkboxes functionality
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    // Clear all filters
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            // Reset checkboxes
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            // Reset price range
            if (priceRange && minPriceInput && maxPriceInput) {
                priceRange.value = priceRange.max / 2;
                minPriceInput.value = 0;
                maxPriceInput.value = priceRange.max;
            }

            // Reapply filters (which will now show all products)
            filterProducts();
        });
    }

    // Filter products based on selected filters
    function filterProducts() {
        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(cb => cb.value);
        const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked'))
            .map(cb => cb.value);
        const selectedResolutions = Array.from(document.querySelectorAll('input[name="resolution"]:checked'))
            .map(cb => cb.value);
        
        const minPrice = parseInt(minPriceInput?.value) || 0;
        const maxPrice = parseInt(maxPriceInput?.value) || Number.MAX_SAFE_INTEGER;

        // Here you would normally filter your products array
        // For demonstration, let's assume we have product elements with data attributes
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const brand = product.dataset.brand;
            const type = product.dataset.type;
            const resolution = product.dataset.resolution;
            const price = parseInt(product.dataset.price);

            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(brand);
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);
            const matchesResolution = selectedResolutions.length === 0 || selectedResolutions.includes(resolution);
            const matchesPrice = price >= minPrice && price <= maxPrice;

            if (matchesBrand && matchesType && matchesResolution && matchesPrice) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });

        // Update product count
        updateProductCount();
    }

    // Update count of visible products
    function updateProductCount() {
        const visibleProducts = document.querySelectorAll('.product-card:not([style*="display: none"])');
        const countElement = document.querySelector('.products-count');
        if (countElement) {
            countElement.textContent = `${visibleProducts.length} proizvoda`;
        }
    }

    // Handle hash change for section navigation
    window.addEventListener('hashchange', () => {
        loadSectionProducts(window.location.hash.slice(1));
    });

    // Load products for a specific section
    function loadSectionProducts(section = 'kamere') {
        // Here you would typically make an API call to get products
        // For now, we'll just update the section title
        const sectionTitle = document.querySelector('.category-header h1');
        if (sectionTitle) {
            const sections = {
                'kamere': 'IP Kamere',
                'snimaci': 'Mrežni snimači (NVR)',
                'storage': 'Storage oprema',
                'oprema': 'Prateća oprema'
            };
            sectionTitle.textContent = sections[section] || sections['kamere'];
        }
    }

    // Initial load
    loadSectionProducts(window.location.hash.slice(1));
    filterProducts();
});