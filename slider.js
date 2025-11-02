// SLIDER
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('heroSlider');
    const sliderContainer = slider.querySelector('.slider-container');
    const slides = slider.querySelectorAll('.slide');
    const indicators = slider.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    let isMoving = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let autoSlideInterval;

    // Inicijalizacija touch eventova
    function initSlider() {
        sliderContainer.addEventListener('touchstart', touchStart);
        sliderContainer.addEventListener('touchmove', touchMove);
        sliderContainer.addEventListener('touchend', touchEnd);
        
        // Mouse events
        sliderContainer.addEventListener('mousedown', touchStart);
        sliderContainer.addEventListener('mousemove', touchMove);
        sliderContainer.addEventListener('mouseup', touchEnd);
        sliderContainer.addEventListener('mouseleave', touchEnd);

        // Disable context menu on right click
        sliderContainer.addEventListener('contextmenu', e => e.preventDefault());

        // Auto slide timer
        startAutoSlide();
    }

    function touchStart(event) {
        if (isMoving) return;
        
        // Stop auto sliding when user interacts
        stopAutoSlide();
        
        const touch = event.type === 'mousedown' ? event : event.touches[0];
        startPos = touch.clientX;
        isMoving = true;
        
        animationID = requestAnimationFrame(animation);
    }

    function touchMove(event) {
        if (!isMoving) return;
        
        const touch = event.type === 'mousemove' ? event : event.touches[0];
        const currentPosition = touch.clientX;
        currentTranslate = prevTranslate + currentPosition - startPos;
    }

    function touchEnd() {
        isMoving = false;
        cancelAnimationFrame(animationID);
        
        const movedBy = currentTranslate - prevTranslate;
        
        // If moved enough negative, move to next slide
        if (movedBy < -100 && currentSlide < slides.length - 1) {
            currentSlide++;
        }
        // If moved enough positive, move to previous slide
        else if (movedBy > 100 && currentSlide > 0) {
            currentSlide--;
        }
        
        setSlidePosition(currentSlide);
        updateIndicators();
        
        // Restart auto sliding
        startAutoSlide();
    }

    function animation() {
        setSlidePosition(currentSlide, currentTranslate);
        if (isMoving) requestAnimationFrame(animation);
    }

    function setSlidePosition(slideIndex, translate = null) {
        const position = translate ?? slideIndex * -100;
        sliderContainer.style.transform = `translateX(${position}%)`;
        prevTranslate = position;
        currentTranslate = position;
    }

    function updateIndicators() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            setSlidePosition(currentSlide);
            updateIndicators();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            setSlidePosition(currentSlide);
            updateIndicators();
        }
    }

    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval
        autoSlideInterval = setInterval(() => {
            if (currentSlide === slides.length - 1) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            setSlidePosition(currentSlide);
            updateIndicators();
        }, 3000); // Change slide every 5 seconds
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoSlide();
            currentSlide = index;
            setSlidePosition(currentSlide);
            updateIndicators();
            startAutoSlide();
        });
    });

    // Initialize slider
    initSlider();
});