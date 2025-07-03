// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav__menu--active');
            navToggle.classList.toggle('nav__toggle--active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                // Close mobile menu if open
                navMenu.classList.remove('nav__menu--active');
                navToggle.classList.remove('nav__toggle--active');
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        lastScrollY = currentScrollY;
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.hero__content, .hero__media, .phone');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Add floating animation to phone
    const phone = document.querySelector('.phone');
    if (phone) {
        let mouseX = 0;
        let mouseY = 0;
        let phoneX = 0;
        let phoneY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        });

        function animatePhone() {
            phoneX += (mouseX - phoneX) * 0.1;
            phoneY += (mouseY - phoneY) * 0.1;
            
            phone.style.transform = `translate(${phoneX}px, ${phoneY}px) rotateY(${phoneX * 0.5}deg) rotateX(${-phoneY * 0.5}deg)`;
            
            requestAnimationFrame(animatePhone);
        }
        
        animatePhone();
    }

    // Language selector functionality
    const languageBtn = document.querySelector('.language-btn');
    if (languageBtn) {
        languageBtn.addEventListener('click', function() {
            // Add language switching logic here
            console.log('Language selector clicked');
        });
    }

    // Add parallax effect to background orbs
    const bgOrbs = document.querySelectorAll('.bg-orb');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        bgOrbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.3;
            orb.style.transform = `translateY(${rate * speed}px)`;
        });
    });

    // Add glow effect on hover for CTA button
    const ctaBtn = document.querySelector('.btn--cta');
    if (ctaBtn) {
        ctaBtn.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 60px rgba(255, 45, 85, 0.6)';
        });
        
        ctaBtn.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 0 30px rgba(255, 45, 85, 0.3)';
        });
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav__menu--active {
        display: flex !important;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(20px);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999;
    }
    
    .nav__menu--active .nav__list {
        flex-direction: column;
        gap: 2rem;
        font-size: 1.5rem;
    }
    
    .nav__toggle--active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav__toggle--active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav__toggle--active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .header--scrolled {
        background: rgba(10, 10, 10, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(style);
