document.addEventListener("DOMContentLoaded", () => {
    /*
    =========================================
    CARRUSEL PRINCIPAL
    =========================================
    */

    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const nextButton = document.querySelector(".next");
    const previousButton = document.querySelector(".previous");
    const hero = document.querySelector(".hero");

    let currentSlide = 0;
    let slideTimer;

    function showSlide(index) {
        if (slides.length === 0) return;

        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentSlide);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function previousSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlider() {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 5000);
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            nextSlide();
            startSlider();
        });
    }

    if (previousButton) {
        previousButton.addEventListener("click", () => {
            previousSlide();
            startSlider();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            startSlider();
        });
    });

    if (hero) {
        hero.addEventListener("mouseenter", () => {
            clearInterval(slideTimer);
        });

        hero.addEventListener("mouseleave", () => {
            startSlider();
        });
    }

    let touchStartX = 0;
    let touchEndX = 0;

    if (hero) {
        hero.addEventListener("touchstart", (event) => {
            touchStartX = event.changedTouches[0].screenX;
            clearInterval(slideTimer);
        });

        hero.addEventListener("touchend", (event) => {
            touchEndX = event.changedTouches[0].screenX;

            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }
            }

            startSlider();
        });
    }

    showSlide(0);
    startSlider();


    /*
    =========================================
    MENÚ PARA CELULAR
    =========================================
    */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");
    const navLinks = document.querySelectorAll(".main-nav a");

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            mainNav.classList.toggle("open");
            document.body.classList.toggle("menu-open");
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                mainNav.classList.remove("open");
                document.body.classList.remove("menu-open");
            });
        });
    }


    /*
    =========================================
    CARRITO
    =========================================
    */

    const cartNumber = document.querySelector(".cart-number");
    const addButtons = document.querySelectorAll(".add-cart");
    const toast = document.querySelector("#toast");

    let cartCount = 0;

    addButtons.forEach((button) => {
        button.addEventListener("click", () => {
            cartCount++;

            if (cartNumber) {
                cartNumber.textContent = cartCount;
            }

            const originalText = button.textContent;

            button.textContent = "AGREGADO ✓";
            button.classList.add("added");

            if (toast) {
                toast.classList.add("show");
            }

            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove("added");

                if (toast) {
                    toast.classList.remove("show");
                }
            }, 1600);
        });
    });


    /*
    =========================================
    FORMULARIO DE NEWSLETTER
    =========================================
    */

    const newsletterForm = document.querySelector("#newsletter-form");
    const emailInput = document.querySelector("#email");
    const newsletterMessage = document.querySelector("#newsletter-message");

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!emailInput.value.trim()) {
                return;
            }

            newsletterMessage.textContent =
                "Gracias por unirte al legado de Imperion.";

            newsletterMessage.classList.add("success");

            newsletterForm.reset();
        });
    }


    /*
    =========================================
    ANIMACIONES AL DESPLAZARSE
    =========================================
    */

    const animatedElements = document.querySelectorAll(
        ".category-card, .product, .benefit, .about-text, .about-card, .contact-grid > div"
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    animatedElements.forEach((element) => {
        observer.observe(element);
    });
});
