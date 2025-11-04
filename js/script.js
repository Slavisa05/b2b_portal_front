// Small helper: load external HTML fragments (navbar)
function loadNavbar() {
	const placeholder = document.getElementById('nav-placeholder');
	if (!placeholder) return; // no placeholder on this page

	fetch('navbar.html', { cache: 'no-store' })
		.then(function (res) {
			if (!res.ok) throw new Error('Network response was not ok');
			return res.text();
		})
		.then(function (html) {
			placeholder.innerHTML = html;
			// initialize navbar widgets (cart toggle, etc.) after insertion
			try { initNavbarWidgets(); } catch (e) { console.error('initNavbarWidgets error', e); }
		})
		.catch(function (err) {
			console.error('Failed to load navbar:', err);
		});
}

// try to load navbar fragment (if placeholder exists)
try { loadNavbar(); } catch (e) { console.error(e); }

// Small helper: load footer fragment (same pattern as navbar)
function loadFooter() {
	const placeholder = document.getElementById('footer-placeholder');
	if (!placeholder) return;

	fetch('footer.html', { cache: 'no-store' })
		.then(function (res) {
			if (!res.ok) throw new Error('Network response was not ok');
			return res.text();
		})
		.then(function (html) {
			placeholder.innerHTML = html;
			// no special init required, but could wire footer widgets here
		})
		.catch(function (err) {
			console.error('Failed to load footer:', err);
		});
}	

// try to load footer fragment (if placeholder exists)
try { loadFooter(); } catch (e) { console.error(e); }

// Initialize cart/menu behaviors for the injected navbar
function initNavbarWidgets() {
	const cartButton = document.getElementById('cart-button');
	const cartMenu = document.getElementById('cart-menu');
	const cartClose = document.getElementById('cart-close');

	if (!cartButton || !cartMenu) return;

	function openCart() {
		cartMenu.setAttribute('aria-hidden', 'false');
		cartButton.setAttribute('aria-expanded', 'true');
		// focus first actionable item for keyboard users
		const first = cartMenu.querySelector('.cart-actions a');
		if (first) first.focus();
	}

	function closeCart() {
		cartMenu.setAttribute('aria-hidden', 'true');
		cartButton.setAttribute('aria-expanded', 'false');
		cartButton.focus();
	}

	cartButton.addEventListener('click', function (e) {
		const expanded = cartButton.getAttribute('aria-expanded') === 'true';
		if (expanded) closeCart(); else openCart();
	});

	if (cartClose) cartClose.addEventListener('click', closeCart);

	// Close cart when clicking outside
	document.addEventListener('click', function (e) {
		if (!cartMenu.contains(e.target) && !cartButton.contains(e.target)) {
			if (cartMenu.getAttribute('aria-hidden') === 'false') closeCart();
		}
	});

	// Close on Escape
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			if (cartMenu.getAttribute('aria-hidden') === 'false') closeCart();
		}
	});

	// Example: update cart count if there's data in localStorage (simple demo)
	try {
		const countEl = document.getElementById('cart-count');
		const items = JSON.parse(localStorage.getItem('cart') || '[]');
		if (countEl) countEl.textContent = items.length || 0;
	} catch (e) { /* ignore parse errors */ }

	// MEGA-MENU: categories dropdown
	try {
		const catBtn = document.getElementById('categories-button');
		const mega = document.getElementById('mega-menu');
		if (catBtn && mega) {
			function openMega() {
				mega.setAttribute('aria-hidden', 'false');
				catBtn.setAttribute('aria-expanded', 'true');
			}
			function closeMega() {
				mega.setAttribute('aria-hidden', 'true');
				catBtn.setAttribute('aria-expanded', 'false');
			}

			catBtn.addEventListener('click', function (e) {
				e.preventDefault();
				const expanded = catBtn.getAttribute('aria-expanded') === 'true';
				if (expanded) closeMega(); else openMega();
			});

			// keyboard support
			catBtn.addEventListener('keydown', function (e) {
				if (e.key === 'Escape') return closeMega();
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					catBtn.click();
				}
			});

			// close on outside click
			document.addEventListener('click', function (e) {
				if (!mega.contains(e.target) && !catBtn.contains(e.target)) {
					if (mega.getAttribute('aria-hidden') === 'false') closeMega();
				}
			});

			// close on Escape
			document.addEventListener('keydown', function (e) {
				if (e.key === 'Escape') {
					if (mega.getAttribute('aria-hidden') === 'false') closeMega();
				}
			});
		}
	} catch (e) { /* ignore if elements absent */ }
}

// Password visibility toggle
document.addEventListener('DOMContentLoaded', function () {
	const pwInput = document.getElementById('password');
	const toggleBtn = document.getElementById('pw-toggle');

	if (!pwInput || !toggleBtn) return; // nothing to do

	const showIcon = function () {
		// simple open-eye SVG
		return `
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
				<circle cx="12" cy="12" r="3"></circle>
			</svg>`;
	};

	const hideIcon = function () {
		// eye-off SVG
		return `
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.79 21.79 0 0 1 5-7.11"></path>
				<path d="M1 1l22 22"></path>
				<path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"></path>
			</svg>`;
	};

	function updateIcon(isShown) {
		toggleBtn.innerHTML = isShown ? hideIcon() : showIcon();
		toggleBtn.setAttribute('aria-pressed', isShown ? 'true' : 'false');
		toggleBtn.setAttribute('aria-label', isShown ? 'Sakrij šifru' : 'Prikaži šifru');
	}

	// initialize
	updateIcon(false);

	toggleBtn.addEventListener('click', function () {
		const isPassword = pwInput.type === 'password';
		pwInput.type = isPassword ? 'text' : 'password';
		updateIcon(isPassword);
		// keep focus on the input for easier typing
		pwInput.focus();
	});

	// keyboard support: Enter or Space toggles when button focused
	toggleBtn.addEventListener('keydown', function (e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleBtn.click();
		}
	});


	// --- Forgot password (frontend only) ---
	const forgotLink = document.getElementById('forgot-link');
	const forgotModal = document.getElementById('forgot-modal');
	const modalOverlay = document.getElementById('modal-overlay');
	const modalClose = document.getElementById('modal-close');
	const forgotForm = document.getElementById('forgot-form');
	const forgotResult = document.getElementById('forgot-result');

	function openModal() {
		if (!forgotModal) return;
		forgotModal.setAttribute('aria-hidden', 'false');
		const input = document.getElementById('forgot-email');
		if (input) input.focus();
	}

	function closeModal() {
		if (!forgotModal) return;
		forgotModal.setAttribute('aria-hidden', 'true');
		if (forgotResult) forgotResult.textContent = '';
	}

	if (forgotLink && forgotModal) {
		forgotLink.addEventListener('click', function (e) {
			e.preventDefault();
			openModal();
		});

		modalOverlay.addEventListener('click', closeModal);
		modalClose.addEventListener('click', closeModal);

		// handle modal form submit (frontend only)
		forgotForm.addEventListener('submit', function (e) {
			e.preventDefault();
			const email = document.getElementById('forgot-email').value;
			// simulate sending
			if (forgotResult) forgotResult.textContent = `Poslato (simulirano) na: ${email}`;
			// keep modal open briefly then close
			setTimeout(() => {
				closeModal();
			}, 1500);
		});

		// close on Escape
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') closeModal();
		});
	}

});

// TABS - dynamic tab population
document.addEventListener('DOMContentLoaded', function () {
	const tabBtns = document.querySelectorAll('.buttons-wrapper button');
	const tabContent = document.querySelector('.tab-content');
	const allDiv = document.getElementById('all-div');
	if (!tabBtns.length || !tabContent || !allDiv) return;

	// make sure the 'all' pane is active initially
	allDiv.classList.add('active');

	// helpers
	function getSourceItems() {
		return Array.from(allDiv.children);
	}

	function hideAllTabPanes() {
		tabContent.querySelectorAll('.grid-3-col').forEach(d => {
			d.classList.remove('active');
			// hide panes explicitly so cloned/created panes don't stay visible
			d.style.display = 'none';
		});
	}

	function getOrCreatePane(name) {
		const id = `${name}-div`;
		let pane = document.getElementById(id);
		if (!pane) {
			pane = document.createElement('div');
			pane.className = 'grid-3-col';
			pane.id = id;
			tabContent.appendChild(pane);
		} else {
			pane.innerHTML = ''; // reset before populating
		}
		return pane;
	}

	function populatePane(name) {
		// if 'all' requested, just return the original allDiv
		if (name === 'all') return allDiv;

		const items = getSourceItems();
		const pane = getOrCreatePane(name);

		// Support elements that use data-category or data-tp-category
		const filtered = items.filter(it => {
			const cat = (it.dataset.category || it.dataset.tpCategory || '').toString();
			return cat === name;
		});

		if (filtered.length === 0) {
			pane.innerHTML = '<p class="empty-tab">Nema proizvoda u ovoj kategoriji.</p>';
		} else {
			filtered.forEach(el => pane.appendChild(el.cloneNode(true)));
		}

		return pane;
	}

	// wire buttons
	tabBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			const name = btn.id;

			// update active button
			tabBtns.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');

			// show appropriate pane
			hideAllTabPanes();
			if (name === 'all') {
				allDiv.classList.add('active');
				allDiv.style.display = '';
			} else {
				allDiv.classList.remove('active');
				allDiv.style.display = 'none';
				const pane = populatePane(name);
				pane.classList.add('active');
				// ensure pane is visible (grid layout assumed)
				pane.style.display = '';
			}
		});
	});
});