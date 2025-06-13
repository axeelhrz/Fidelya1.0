// ===== SISTEMA DE PARTÍCULAS AVANZADO =====
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.init();
  }

  init() {
    this.createCanvas();
    this.createParticles();
    this.animate();
    this.bindEvents();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'particles-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.6;
    `;
    document.body.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  createParticles() {
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomColor()
      });
    }
  }

  getRandomColor() {
    const colors = ['#00d4ff', '#8b5cf6', '#06ffa5', '#f472b6', '#ff6b35'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Actualizar posición
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Rebotar en los bordes
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Dibujar partícula
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
      
      // Efecto de resplandor
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = particle.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', debounce(() => this.resize(), 250));
    
    // Pausar animación cuando la pestaña no está visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(this.animationId);
      } else {
        this.animate();
      }
    });
  }

  destroy() {
    cancelAnimationFrame(this.animationId);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// ===== NAVEGACIÓN MEJORADA CON GLASSMORPHISM =====
class Navigation {
  constructor() {
    this.header = $('#header');
    this.navToggle = $('#nav-toggle');
    this.navMenu = $('#nav-menu');
    this.navLinks = $$('.nav__link');
    this.isMenuOpen = false;
    this.scrollY = 0;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.handleScroll();
    this.addScrollIndicator();
  }
  
  bindEvents() {
    // Mobile menu toggle
    this.navToggle?.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Handle scroll with throttling
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 16));
    
    // Smooth scroll for anchor links
    this.navLinks.forEach(link => {
      if (link.getAttribute('href').startsWith('#')) {
        link.addEventListener('click', (e) => this.smoothScroll(e));
      }
    });

    // Keyboard navigation
    this.navToggle?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleMenu();
      }
    });
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.navMenu.classList.toggle('active');
    this.navToggle.classList.toggle('active');
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    
    // Actualizar aria-expanded
    this.navToggle.setAttribute('aria-expanded', this.isMenuOpen.toString());
  }
  
  closeMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    document.body.style.overflow = '';
    this.navToggle.setAttribute('aria-expanded', 'false');
  }
  
  handleScroll() {
    this.scrollY = window.scrollY;
    
    // Add scrolled class to header with glassmorphism effect
    if (this.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    // Update active navigation link
    this.updateActiveLink();
    
    // Update scroll indicator
    this.updateScrollIndicator();
  }
  
  updateActiveLink() {
    const sections = $$('section[id]');
    const scrollPos = this.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = $(`.nav__link[href="#${sectionId}"]`);
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        navLink?.classList.add('active');
      }
    });
  }

  addScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #00d4ff 0%, #8b5cf6 50%, #06ffa5 100%);
      transform-origin: left;
      transform: scaleX(0);
      z-index: 9999;
      transition: transform 0.1s ease-out;
    `;
    document.body.appendChild(indicator);
    this.scrollIndicator = indicator;
  }

  updateScrollIndicator() {
    const scrollPercent = this.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    this.scrollIndicator.style.transform = `scaleX(${Math.min(scrollPercent, 1)})`;
  }
  
  smoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = $(targetId);
    
    if (targetSection) {
      const headerHeight = this.header.offsetHeight;
      const targetPosition = targetSection.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// ===== SISTEMA DE PARTÍCULAS AVANZADO =====
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.init();
  }

  init() {
    this.createCanvas();
    this.createParticles();
    this.animate();
    this.bindEvents();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'particles-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.6;
    `;
    document.body.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  createParticles() {
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomColor()
      });
    }
  }

  getRandomColor() {
    const colors = ['#00d4ff', '#8b5cf6', '#06ffa5', '#f472b6', '#ff6b35'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Actualizar posición
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Rebotar en los bordes
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Dibujar partícula
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
      
      // Efecto de resplandor
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = particle.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', debounce(() => this.resize(), 250));
    
    // Pausar animación cuando la pestaña no está visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(this.animationId);
      } else {
        this.animate();
      }
    });
  }

  destroy() {
    cancelAnimationFrame(this.animationId);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// ===== NAVEGACIÓN MEJORADA CON GLASSMORPHISM =====
class Navigation {
  constructor() {
    this.header = $('#header');
    this.navToggle = $('#nav-toggle');
    this.navMenu = $('#nav-menu');
    this.navLinks = $$('.nav__link');
    this.isMenuOpen = false;
    this.scrollY = 0;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.handleScroll();
    this.addScrollIndicator();
  }
  
  bindEvents() {
    // Mobile menu toggle
    this.navToggle?.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Handle scroll with throttling
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 16));
    
    // Smooth scroll for anchor links
    this.navLinks.forEach(link => {
      if (link.getAttribute('href').startsWith('#')) {
        link.addEventListener('click', (e) => this.smoothScroll(e));
      }
    });

    // Keyboard navigation
    this.navToggle?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleMenu();
      }
    });
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.navMenu.classList.toggle('active');
    this.navToggle.classList.toggle('active');
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    
    // Actualizar aria-expanded
    this.navToggle.setAttribute('aria-expanded', this.isMenuOpen.toString());
  }
  
  closeMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    document.body.style.overflow = '';
    this.navToggle.setAttribute('aria-expanded', 'false');
  }
  
  handleScroll() {
    this.scrollY = window.scrollY;
    
    // Add scrolled class to header with glassmorphism effect
    if (this.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    // Update active navigation link
    this.updateActiveLink();
    
    // Update scroll indicator
    this.updateScrollIndicator();
  }
  
  updateActiveLink() {
    const sections = $$('section[id]');
    const scrollPos = this.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = $(`.nav__link[href="#${sectionId}"]`);
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        navLink?.classList.add('active');
      }
    });
  }

  addScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #00d4ff 0%, #8b5cf6 50%, #06ffa5 100%);
      transform-origin: left;
      transform: scaleX(0);
      z-index: 9999;
      transition: transform 0.1s ease-out;
    `;
    document.body.appendChild(indicator);
    this.scrollIndicator = indicator;
  }

  updateScrollIndicator() {
    const scrollPercent = this.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    this.scrollIndicator.style.transform = `scaleX(${Math.min(scrollPercent, 1)})`;
  }
  
  smoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = $(targetId);
    
    if (targetSection) {
      const headerHeight = this.header.offsetHeight;
      const targetPosition = targetSection.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// ===== EFECTOS PARALLAX AVANZADOS =====
class ParallaxEffects {
  constructor() {
    this.elements = [];
    this.ticking = false;
    this.init();
  }

  init() {
    this.collectElements();
    this.bindEvents();
  }

  collectElements() {
    // Elementos con efecto parallax
    this.elements = [
      { el: $('.hero__video-glow'), speed: 0.5 },
      { el: $('.bg-canvas'), speed: 0.2 },
      { el: $$('.feature__phone'), speed: 0.3 },
      { el: $('.video-glow'), speed: 0.4 }
    ].filter(item => item.el);
  }

  bindEvents() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => this.updateParallax());
        this.ticking = true;
      }
    }, { passive: true });
  }

  updateParallax() {
    const scrollY = window.scrollY;
    
    this.elements.forEach(({ el, speed }) => {
      if (el.nodeType) {
        // Elemento único
        const yPos = -(scrollY * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      } else {
        // NodeList
        el.forEach(element => {
          const yPos = -(scrollY * speed);
          element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
      }
    });
    
    this.ticking = false;
  }
}

// ===== OPTIMIZACIÓN DE VIDEO AVANZADA =====
class VideoOptimizer {
  constructor() {
    this.video = $('.hero__video');
    this.observer = null;
    this.init();
  }

  init() {
    if (!this.video) return;

    this.setupVideo();
    this.createIntersectionObserver();
    this.addQualityControls();
  }

  setupVideo() {
    // Configurar atributos para mejor rendimiento
    this.video.setAttribute('playsinline', '');
    this.video.setAttribute('webkit-playsinline', '');
    this.video.setAttribute('preload', 'metadata');
    
    // Mejorar calidad de renderizado
    this.video.style.imageRendering = 'crisp-edges';
    this.video.style.willChange = 'transform';

    // Eventos de video
    this.video.addEventListener('loadeddata', () => {
      console.log('Video loaded with high quality');
    });

    this.video.addEventListener('error', (e) => {
      console.error('Video error:', e);
      this.showVideoFallback();
    });
  }

  createIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.video.play().catch(() => {
            console.log('Video autoplay prevented');
          });
        } else {
          this.video.pause();
        }
      });
    }, { threshold: 0.3 });

    this.observer.observe(this.video);
  }

  addQualityControls() {
    // Detectar conexión lenta y ajustar calidad
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        this.video.style.filter = 'blur(1px)';
        console.log('Low quality mode enabled for slow connection');
      }
    }
  }

  showVideoFallback() {
    const fallback = document.createElement('div');
    fallback.className = 'video-fallback';
    fallback.style.cssText = `
      width: 380px;
      height: 760px;
      background: linear-gradient(135deg, #151922 0%, #0a0d14 100%);
      border-radius: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 1.5rem;
      border: 1px solid rgba(0, 212, 255, 0.2);
      backdrop-filter: blur(15px);
    `;
    
    fallback.innerHTML = `
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);">
        <div style="width: 40px; height: 40px; background: white; border-radius: 8px;"></div>
      </div>
      <div style="color: #00d4ff; font-size: 1.5rem; font-weight: bold; text-align: center; font-family: 'Space Grotesk', sans-serif;">
        <div>Starflex</div>
        <div style="font-size: 1rem; color: #e2e8f0; font-weight: normal; margin-top: 0.5rem;">Amazon Flex AI</div>
      </div>
    `;
    
    this.video.parentNode.replaceChild(fallback, this.video);
  }
}

// ===== GESTOR DE VIDEO YOUTUBE =====
class YouTubeVideoManager {
  constructor() {
    this.videoContainer = $('#video-container');
    this.videoOverlay = $('#video-overlay');
    this.videoId = 'IeKGEAdEtYA'; // ID del video de YouTube
    this.isLoaded = false;
    this.init();
  }

  init() {
    if (!this.videoContainer || !this.videoOverlay) return;

    // Agregar event listeners
    this.videoOverlay.addEventListener('click', () => this.loadVideo());
    this.videoOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.loadVideo();
      }
    });

    // Hacer el overlay focusable
    this.videoOverlay.setAttribute('tabindex', '0');
    this.videoOverlay.setAttribute('role', 'button');
    this.videoOverlay.setAttribute('aria-label', 'Reproducir video de demostración de Starflex');

    // Lazy loading con Intersection Observer
    this.setupLazyLoading();
  }

  setupLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoaded) {
          // Precargar la miniatura del video
          this.preloadThumbnail();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(this.videoContainer);
  }

  preloadThumbnail() {
    // Crear imagen de miniatura de YouTube
    const thumbnail = document.createElement('div');
    thumbnail.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg');
      background-size: cover;
      background-position: center;
      border-radius: 20px;
      z-index: 1;
    `;
    
    this.videoContainer.insertBefore(thumbnail, this.videoOverlay);
  }

  loadVideo() {
    if (this.isLoaded) return;

    // Crear iframe de YouTube
    const iframe = document.createElement('iframe');
    iframe.className = 'video-iframe';
    iframe.src = `https://www.youtube.com/embed/${this.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('title', 'Demostración de Starflex - Amazon Flex Automation');

    // Agregar el iframe al contenedor
    this.videoContainer.appendChild(iframe);

    // Ocultar el overlay
    this.videoOverlay.classList.add('hidden');

    // Marcar como cargado
    this.isLoaded = true;

    // Analytics
    this.trackVideoPlay();

    console.log('YouTube video loaded and playing');
  }

  trackVideoPlay() {
    // Enviar evento a analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'video_play', {
        event_category: 'Video',
        event_label: 'YouTube_Demo_Video',
        video_title: 'Starflex Demo'
      });
    }

    // Analytics personalizado
    console.log('📹 Video Play Event: YouTube Demo Video');
  }
}

// ===== ANIMACIONES DE SCROLL AVANZADAS =====
class ScrollAnimations {
  constructor() {
    this.animatedElements = $$('[data-animate], .feature, .features__header, .video-section__header, .video-wrapper');
    this.observer = null;
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.createObserver();
    } else {
      // Fallback para navegadores antiguos
      this.animatedElements.forEach(el => el.classList.add('animate-in'));
    }
  }
  
  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Animación escalonada para elementos hijos
          const children = entry.target.querySelectorAll('.feature__list-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateX(0)';
            }, index * 100);
          });
          
          this.observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '-50px 0px'
    });
    
    this.animatedElements.forEach(element => {
      // Preparar elementos para animación
      if (element.classList.contains('feature')) {
        const listItems = element.querySelectorAll('.feature__list-item');
        listItems.forEach(item => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-20px)';
          item.style.transition = 'all 0.6s ease';
        });
      }
      
      this.observer.observe(element);
    });
  }
}

// ===== EFECTOS DE HOVER AVANZADOS =====
class HoverEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupButtonEffects();
    this.setupCardEffects();
    this.setupPhoneEffects();
    this.setupVideoEffects();
  }

  setupButtonEffects() {
    $$('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', (e) => this.createRipple(e));
      btn.addEventListener('mousemove', (e) => this.updateGlow(e));
      btn.addEventListener('mouseleave', (e) => this.removeGlow(e));
    });
  }

  setupCardEffects() {
    $$('.glass-card, .feature__content').forEach(card => {
      card.addEventListener('mousemove', (e) => this.tiltCard(e));
      card.addEventListener('mouseleave', (e) => this.resetCard(e));
    });
  }

  setupPhoneEffects() {
    $$('.feature__phone').forEach(phone => {
      phone.addEventListener('mouseenter', () => this.animatePhone(phone, true));
      phone.addEventListener('mouseleave', () => this.animatePhone(phone, false));
    });
  }

  setupVideoEffects() {
    const videoContainer = $('#video-container');
    if (videoContainer) {
      videoContainer.addEventListener('mouseenter', () => this.animateVideoContainer(videoContainer, true));
      videoContainer.addEventListener('mouseleave', () => this.animateVideoContainer(videoContainer, false));
    }
  }

  createRipple(e) {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    btn.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  updateGlow(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    btn.style.background = `
      radial-gradient(circle at ${x}% ${y}%, 
        rgba(255, 255, 255, 0.1) 0%, 
        transparent 50%),
      ${btn.style.background || 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)'}
    `;
  }

  removeGlow(e) {
    const btn = e.currentTarget;
    btn.style.background = '';
  }

  tiltCard(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateZ(10px)
    `;
  }

  resetCard(e) {
    const card = e.currentTarget;
    card.style.transform = '';
  }

  animatePhone(phone, isHover) {
    const screens = phone.querySelectorAll('.phone__content > *');
    
    if (isHover) {
      screens.forEach((screen, index) => {
        setTimeout(() => {
          screen.style.opacity = index === 0 ? '1' : '0.3';
        }, index * 200);
      });
    } else {
      screens.forEach(screen => {
        screen.style.opacity = '1';
      });
    }
  }

  animateVideoContainer(container, isHover) {
    const playButton = container.querySelector('.play-button');
    if (playButton) {
      if (isHover) {
        playButton.style.transform = 'scale(1.1)';
        playButton.style.boxShadow = '0 15px 40px rgba(255, 107, 53, 0.5), 0 0 50px rgba(255, 107, 53, 0.4)';
      } else {
        playButton.style.transform = 'scale(1)';
        playButton.style.boxShadow = '';
      }
    }
  }
}

// ===== ANALYTICS AVANZADO =====
class Analytics {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
    this.init();
  }
  
  init() {
    this.trackPageView();
    this.trackUserInteractions();
    this.trackPerformance();
    this.trackScrollDepth();
    this.trackTimeOnPage();
  }
  
  trackPageView() {
    this.trackEvent('page_view', 'Navigation', {
      page_title: document.title,
      page_location: window.location.href,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`
    });
  }
  
  trackUserInteractions() {
    // Track CTA button clicks
    $$('.btn--cta').forEach(btn => {
      btn.addEventListener('click', () => {
        this.trackEvent('cta_click', 'Engagement', {
          button_text: btn.textContent.trim(),
          button_location: this.getElementLocation(btn)
        });
      });
    });
    
    // Track download button clicks
    $$('.download-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isGooglePlay = btn.href.includes('google-play') || 
                            btn.querySelector('img').src.includes('Google-Play');
        const store = isGooglePlay ? 'Google_Play' : 'App_Store';
        this.trackEvent('download_click', 'App_Download', { store });
      });
    });
    
    // Track feature interactions
    $$('.feature').forEach(feature => {
      feature.addEventListener('click', () => {
        const featureType = feature.dataset.feature || 'unknown';
        this.trackEvent('feature_interaction', 'Engagement', { feature_type: featureType });
      });
    });
    
    // Track navigation clicks
    $$('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('navigation_click', 'Navigation', {
          link_text: link.textContent.trim(),
          link_href: link.getAttribute('href')
        });
      });
    });

    // Track video section visibility
    const videoSection = $('#video');
    if (videoSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackEvent('video_section_view', 'Video', { section: 'YouTube_Demo_Section' });
          }
        });
      }, { threshold: 0.5 });

      observer.observe(videoSection);
    }
  }
  
  trackPerformance() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paintEntries = performance.getEntriesByType('paint');
        
        this.trackEvent('performance_metrics', 'Performance', {
          load_time: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
          dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
          first_paint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
          first_contentful_paint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        });
      }, 1000);
    });
  }
  
  trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    const tracked = new Set();
    
    window.addEventListener('scroll', throttle(() => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        milestones.forEach(milestone => {
          if (scrollPercent >= milestone && !tracked.has(milestone)) {
            tracked.add(milestone);
            this.trackEvent('scroll_depth', 'Engagement', { 
              depth_percent: milestone,
              time_to_depth: Date.now() - this.sessionStart
            });
          }
        });
      }
    }, 250), { passive: true });
  }
  
  trackTimeOnPage() {
    // Track time spent on page
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - this.sessionStart;
      this.trackEvent('time_on_page', 'Engagement', { 
        duration_ms: timeOnPage,
        duration_seconds: Math.round(timeOnPage / 1000)
      });
    });
    
    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility_change', 'Engagement', {
        hidden: document.hidden,
        timestamp: Date.now() - this.sessionStart
      });
    });
  }
  
  trackEvent(action, category, data = {}) {
    const event = {
      action,
      category,
      timestamp: Date.now(),
      session_id: this.getSessionId(),
      ...data
    };
    
    this.events.push(event);
    
    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        ...data
      });
    }
    
    // Send to custom analytics endpoint
    this.sendToAnalytics(event);
    
    console.log('📊 Analytics Event:', event);
  }
  
  getElementLocation(element) {
    const rect = element.getBoundingClientRect();
    return {
      x: Math.round(rect.left + rect.width / 2),
      y: Math.round(rect.top + rect.height / 2),
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight
    };
  }
  
  getSessionId() {
    let sessionId = sessionStorage.getItem('starflex_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('starflex_session_id', sessionId);
    }
    return sessionId;
  }
  
  sendToAnalytics(event) {
    // Simulate sending to analytics endpoint
    if (navigator.sendBeacon) {
      const data = JSON.stringify(event);
      navigator.sendBeacon('/analytics', data);
    }
  }
}

// ===== ACCESIBILIDAD MEJORADA =====
class AccessibilityEnhancements {
  constructor() {
    this.init();
  }
  
  init() {
    this.addKeyboardNavigation();
    this.addFocusManagement();
    this.addAriaLabels();
    this.addReducedMotionSupport();
    this.addHighContrastSupport();
  }
  
  addKeyboardNavigation() {
    // Navegación con teclado para elementos interactivos
    $$('.feature__phone, .download-btn, .btn, .video-overlay').forEach(element => {
      element.setAttribute('tabindex', '0');
      
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });
    
    // Navegación con flechas para features
    const features = $$('.feature');
    features.forEach((feature, index) => {
      feature.addEventListener('keydown', (e) => {
        let targetIndex;
        
        switch(e.key) {
          case 'ArrowDown':
            targetIndex = (index + 1) % features.length;
            break;
          case 'ArrowUp':
            targetIndex = (index - 1 + features.length) % features.length;
            break;
          default:
            return;
        }
        
        e.preventDefault();
        features[targetIndex].focus();
      });
    });
  }
  
  addFocusManagement() {
    // Indicadores de foco mejorados
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible {
        outline: 2px solid #00d4ff !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }
      
      .focus-visible:not(.btn) {
        box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.3) !important;
      }
    `;
    document.head.appendChild(style);
    
    // Trap focus in mobile menu
    const navMenu = $('#nav-menu');
    if (navMenu) {
      navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && navMenu.classList.contains('active')) {
          const focusableElements = navMenu.querySelectorAll(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
    }
  }
  
  addAriaLabels() {
    // Mejorar etiquetas ARIA
    $$('.feature__phone').forEach((phone, index) => {
      phone.setAttribute('aria-label', `Demostración de funcionalidad ${index + 1}`);
      phone.setAttribute('role', 'img');
    });
    
    $$('.download-btn').forEach(btn => {
      const img = btn.querySelector('img');
      if (img) {
        btn.setAttribute('aria-label', img.alt);
      }
    });
    
    // Agregar landmarks
    const main = $('main') || document.body;
    main.setAttribute('role', 'main');
    
    const nav = $('nav');
    if (nav) nav.setAttribute('role', 'navigation');

    // Video section
    const videoSection = $('#video');
    if (videoSection) {
      videoSection.setAttribute('aria-label', 'Sección de video demostración');
    }
  }
  
  addReducedMotionSupport() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Deshabilitar animaciones para usuarios que prefieren movimiento reducido
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
      
      console.log('Reduced motion mode enabled');
    }
  }
  
  addHighContrastSupport() {
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.body.classList.add('high-contrast');
      console.log('High contrast mode enabled');
    }
  }
}

// ===== GESTIÓN DE ERRORES AVANZADA =====
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.init();
  }
  
  init() {
    window.addEventListener('error', (e) => this.handleError(e));
    window.addEventListener('unhandledrejection', (e) => this.handlePromiseRejection(e));
  }
  
  handleError(e) {
    const error = {
      type: 'javascript_error',
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      stack: e.error?.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.errors.push(error);
    this.reportError(error);
    
    console.error('JavaScript Error:', error);
  }
  
  handlePromiseRejection(e) {
    const error = {
      type: 'promise_rejection',
      reason: e.reason?.toString() || 'Unknown promise rejection',
      timestamp: Date.now(),
      url: window.location.href
    };
    
    this.errors.push(error);
    this.reportError(error);
    
    console.error('Promise Rejection:', error);
  }
  
  reportError(error) {
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message || error.reason,
        fatal: false
      });
    }
    
    // Send to error reporting service
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/errors', JSON.stringify(error));
    }
  }
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
class StarflexApp {
  constructor() {
    this.components = [];
    this.isInitialized = false;
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    try {
      // Inicializar componentes principales
      this.components.push(new ErrorHandler());
      this.components.push(new Navigation());
      this.components.push(new ParticleSystem());
      this.components.push(new ParallaxEffects());
      this.components.push(new VideoOptimizer());
      this.components.push(new YouTubeVideoManager());
      this.components.push(new ScrollAnimations());
      this.components.push(new HoverEffects());
      this.components.push(new Analytics());
      this.components.push(new AccessibilityEnhancements());
      
      this.isInitialized = true;
      
      // Agregar CSS de animaciones dinámicamente
      this.addDynamicStyles();
      
      console.log('🚀 Starflex Futurista con Video YouTube initialized successfully');
      
      // Trigger custom event
      window.dispatchEvent(new CustomEvent('starflexInitialized', {
        detail: { components: this.components.length }
      }));
      
    } catch (error) {
      console.error('Error initializing Starflex components:', error);
    }
  }
  
  addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      .feature__list-item {
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .particles-canvas {
        mix-blend-mode: screen;
      }
      
      @media (prefers-reduced-motion: reduce) {
        .particles-canvas {
          display: none !important;
        }
      }
      
      .video-overlay.hidden {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }
  
  destroy() {
    this.components.forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
    this.components = [];
    this.isInitialized = false;
  }
}

// ===== POLYFILLS PARA COMPATIBILIDAD =====
if (!window.IntersectionObserver) {
  console.warn('IntersectionObserver not supported. Consider loading a polyfill.');
}

if (!window.requestIdleCallback) {
  window.requestIdleCallback = function(cb) {
    return setTimeout(cb, 1);
  };
}

// ===== INICIAR APLICACIÓN =====
const app = new StarflexApp();

// ===== EXPORTAR PARA TESTING =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    StarflexApp,
    Navigation,
    ParticleSystem,
    VideoOptimizer,
    YouTubeVideoManager,
    Analytics
  };
}

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
  window.addEventListener('load', () => {
    requestIdleCallback(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('📈 Performance Metrics:', {
        'Load Time': `${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`,
        'DOM Content Loaded': `${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`,
        'First Byte': `${Math.round(perfData.responseStart - perfData.requestStart)}ms`
      });
    });
  });
}
