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