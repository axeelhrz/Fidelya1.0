// ===== UTILIDADES ===== 
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== NAVEGACIÓN MÓVIL MEJORADA =====
class MobileNav {
    constructor() {
        this.toggle = $('#nav-toggle');
        this.menu = $('#nav-menu');
        this.links = $$('.nav__link');
        this.init();
    }

    init() {
        this.toggle?.addEventListener('click', () => this.toggleMenu());
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        document.addEventListener('click', (e) => {
            if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
                this.closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== REPRODUCTOR DE VIDEO PERSONALIZADO =====
class VideoPlayer {
    constructor() {
        this.video = $('#main-video');
        this.playOverlay = $('#play-overlay');
        this.progressBar = $('.videos__progress-bar');
        this.progressFill = $('.videos__progress-fill');
        this.currentTimeDisplay = $('.videos__current-time');
        this.durationDisplay = $('.videos__duration');
        this.progressIndicators = $('.videos__progress-indicators');
        this.init();
    }

    init() {
        if (!this.video) return;

        this.setupEventListeners();
        this.updateDuration();
    }

    setupEventListeners() {
        // Click en overlay para reproducir
        this.playOverlay?.addEventListener('click', () => this.togglePlay());
        
        // Click en video para pausar/reproducir
        this.video.addEventListener('click', () => this.togglePlay());
        
        // Actualizar progreso
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        
        // Video cargado
        this.video.addEventListener('loadedmetadata', () => this.updateDuration());
        
        // Video terminado
        this.video.addEventListener('ended', () => this.onVideoEnded());
        
        // Click en barra de progreso
        this.progressBar?.addEventListener('click', (e) => this.seekVideo(e));
        
        // Teclas de control
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Mostrar/ocultar controles al hacer hover
        const playerFrame = $('.videos__player-frame');
        if (playerFrame) {
            playerFrame.addEventListener('mouseenter', () => this.showControls());
            playerFrame.addEventListener('mouseleave', () => this.hideControls());
        }
    }

    togglePlay() {
        if (this.video.paused) {
            this.playVideo();
        } else {
            this.pauseVideo();
        }
    }

    playVideo() {
        this.video.play().then(() => {
            this.playOverlay?.classList.add('hidden');
            this.showControls();
            console.log('🎬 Video reproduciendo');
        }).catch(error => {
            console.error('Error al reproducir video:', error);
            this.showError('Error al reproducir el video. Por favor, intenta de nuevo.');
        });
    }

    pauseVideo() {
        this.video.pause();
        this.playOverlay?.classList.remove('hidden');
        console.log('⏸️ Video pausado');
    }

    updateProgress() {
        if (!this.video.duration) return;

        const progress = (this.video.currentTime / this.video.duration) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }

        // Actualizar tiempo actual
        if (this.currentTimeDisplay) {
            this.currentTimeDisplay.textContent = this.formatTime(this.video.currentTime);
        }
    }

    updateDuration() {
        if (this.video.duration && this.durationDisplay) {
            this.durationDisplay.textContent = this.formatTime(this.video.duration);
        }
    }

    seekVideo(e) {
        if (!this.video.duration) return;

        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.video.duration;
        
        this.video.currentTime = newTime;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    showControls() {
        if (this.progressIndicators && !this.video.paused) {
            this.progressIndicators.classList.add('visible');
        }
    }

    hideControls() {
        if (this.progressIndicators) {
            setTimeout(() => {
                if (!this.video.paused) {
                    this.progressIndicators.classList.remove('visible');
                }
            }, 2000);
        }
    }

    onVideoEnded() {
        this.playOverlay?.classList.remove('hidden');
        this.progressIndicators?.classList.remove('visible');
        console.log('✅ Video terminado');
    }

    handleKeyboard(e) {
        if (!this.video) return;

        // Solo funcionar si el video está visible en pantalla
        const videoRect = this.video.getBoundingClientRect();
        const isVideoVisible = videoRect.top < window.innerHeight && videoRect.bottom > 0;
        
        if (!isVideoVisible) return;

        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.video.currentTime = Math.max(0, this.video.currentTime - 10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
                break;
            case 'KeyM':
                e.preventDefault();
                this.video.muted = !this.video.muted;
                break;
        }
    }

    showError(message) {
        // Crear notificación de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'video-error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: var(--font-primary);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// ===== BOTONES FLOTANTES PARA WHATSAPP Y TELEGRAM =====
class FloatingButtons {
    constructor() {
        this.init();
    }

    init() {
        this.createFloatingButtons();
    }

    createFloatingButtons() {
        // Crear contenedor de botones flotantes
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-buttons';
        floatingContainer.innerHTML = `
            <div class="floating-buttons__container">
                <!-- Botón de WhatsApp -->
                <a href="https://www.whatsapp.com/channel/0029VaL0DdmIyPtQxdrlHm1d" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="floating-btn floating-btn--whatsapp"
                   aria-label="Unirse al canal de WhatsApp">
                    <div class="floating-btn__icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                    </div>
                    <span class="floating-btn__tooltip">Canal WhatsApp</span>
                </a>

                <!-- Botón de Telegram -->
                <a href="https://t.me/starflexnews" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="floating-btn floating-btn--telegram"
                   aria-label="Unirse al canal de Telegram">
                    <div class="floating-btn__icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                    </div>
                    <span class="floating-btn__tooltip">Canal Telegram</span>
                </a>
            </div>
        `;

        document.body.appendChild(floatingContainer);
        
        // Añadir estilos CSS
        this.addFloatingButtonsCSS();
    }

    addFloatingButtonsCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* ===== BOTONES FLOTANTES ROJIZOS STARFLEX - POSICIÓN FIJA ===== */
            .floating-buttons {
                position: fixed !important;
                right: 20px !important;
                bottom: 20px !important;
                z-index: 9999 !important;
                pointer-events: none !important;
                /* Asegurar que no se mueva con scroll */
                transform: none !important;
                transition: none !important;
                opacity: 1 !important;
            }

            .floating-buttons__container {
                display: flex !important;
                flex-direction: column !important;
                gap: 15px !important;
                pointer-events: auto !important;
                /* Asegurar posición estática */
                position: static !important;
                transform: none !important;
                transition: none !important;
            }

            .floating-btn {
                position: relative !important;
                width: 60px !important;
                height: 60px !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                text-decoration: none !important;
                color: white !important;
                box-shadow: 
                    0 4px 20px rgba(0, 0, 0, 0.3),
                    0 0 0 1px rgba(255, 69, 105, 0.2) !important;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                overflow: hidden !important;
                border: 2px solid rgba(255, 69, 105, 0.3) !important;
                /* Asegurar que no se mueva */
                transform: translateY(0) !important;
                animation: floating-btn-bounce 3s ease-in-out infinite !important;
            }

            .floating-btn::before {
                content: '' !important;
                position: absolute !important;
                top: -2px !important;
                left: -2px !important;
                right: -2px !important;
                bottom: -2px !important;
                border-radius: 50% !important;
                background: linear-gradient(45deg, 
                    var(--starflex-crimson-glow) 0%,
                    var(--starflex-crimson-bright) 25%,
                    var(--starflex-crimson) 50%,
                    var(--starflex-crimson-bright) 75%,
                    var(--starflex-crimson-glow) 100%
                ) !important;
                z-index: -1 !important;
                opacity: 0 !important;
                transition: opacity 0.3s ease !important;
                animation: crimson-pulse-ring 4s ease-in-out infinite !important;
            }

            .floating-btn:hover {
                transform: translateY(-5px) scale(1.1) !important;
                box-shadow: 
                    0 8px 30px rgba(0, 0, 0, 0.4),
                    0 0 25px rgba(255, 69, 105, 0.6),
                    0 0 50px rgba(184, 0, 46, 0.4) !important;
                border-color: rgba(255, 69, 105, 0.8) !important;
            }

            .floating-btn:hover::before {
                opacity: 1 !important;
            }

            .floating-btn:active {
                transform: translateY(-2px) scale(1.05) !important;
            }

            /* Botón WhatsApp con tema rojizo */
            .floating-btn--whatsapp {
                background: linear-gradient(135deg, 
                    var(--starflex-crimson-dark) 0%, 
                    var(--starflex-crimson) 25%, 
                    var(--starflex-crimson-light) 50%, 
                    var(--starflex-crimson-bright) 100%
                ) !important;
                animation-delay: 0s !important;
            }

            .floating-btn--whatsapp:hover {
                box-shadow: 
                    0 8px 30px rgba(0, 0, 0, 0.4),
                    0 0 25px rgba(255, 69, 105, 0.7),
                    0 0 50px rgba(184, 0, 46, 0.5) !important;
            }

            /* Botón Telegram con tema rojizo */
            .floating-btn--telegram {
                background: linear-gradient(135deg, 
                    var(--starflex-crimson) 0%, 
                    var(--starflex-crimson-bright) 25%, 
                    var(--starflex-crimson-glow) 50%, 
                    #ff6b9d 100%
                ) !important;
                animation-delay: 1.5s !important;
            }

            .floating-btn--telegram:hover {
                box-shadow: 
                    0 8px 30px rgba(0, 0, 0, 0.4),
                    0 0 25px rgba(255, 23, 68, 0.7),
                    0 0 50px rgba(255, 69, 105, 0.5) !important;
            }

            .floating-btn__icon {
                width: 28px !important;
                height: 28px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: transform 0.3s ease !important;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) !important;
            }

            .floating-btn:hover .floating-btn__icon {
                transform: scale(1.1) rotate(5deg) !important;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) !important;
            }

            .floating-btn__icon svg {
                width: 100% !important;
                height: 100% !important;
            }

            /* Tooltip mejorado con tema rojizo */
            .floating-btn__tooltip {
                position: absolute !important;
                right: 75px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                background: linear-gradient(135deg, 
                    rgba(184, 0, 46, 0.95) 0%, 
                    rgba(156, 0, 37, 0.95) 100%
                ) !important;
                color: white !important;
                padding: 8px 12px !important;
                border-radius: 8px !important;
                font-size: 12px !important;
                font-weight: 600 !important;
                white-space: nowrap !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transition: all 0.3s ease !important;
                pointer-events: none !important;
                font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif) !important;
                border: 1px solid rgba(255, 69, 105, 0.3) !important;
                box-shadow: 
                    0 4px 15px rgba(0, 0, 0, 0.3),
                    0 0 10px rgba(255, 69, 105, 0.2) !important;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
            }

            .floating-btn__tooltip::after {
                content: '' !important;
                position: absolute !important;
                top: 50% !important;
                right: -6px !important;
                transform: translateY(-50%) !important;
                width: 0 !important;
                height: 0 !important;
                border-left: 6px solid rgba(184, 0, 46, 0.95) !important;
                border-top: 6px solid transparent !important;
                border-bottom: 6px solid transparent !important;
            }

            .floating-btn:hover .floating-btn__tooltip {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(-50%) translateX(-5px) !important;
            }

            /* Animación de rebote mejorada */
            @keyframes floating-btn-bounce {
                0%, 100% {
                    transform: translateY(0) !important;
                }
                50% {
                    transform: translateY(-8px) !important;
                }
            }

            /* Animación del anillo de pulso rojizo */
            @keyframes crimson-pulse-ring {
                0%, 100% {
                    transform: scale(1) !important;
                    opacity: 0 !important;
                }
                50% {
                    transform: scale(1.2) !important;
                    opacity: 0.3 !important;
                }
            }

            /* Efectos de brillo adicionales */
            .floating-btn::after {
                content: '' !important;
                position: absolute !important;
                top: 10% !important;
                left: 10% !important;
                width: 80% !important;
                height: 80% !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.2) 0%, 
                    transparent 50%
                ) !important;
                opacity: 0 !important;
                transition: opacity 0.3s ease !important;
                pointer-events: none !important;
            }

            .floating-btn:hover::after {
                opacity: 1 !important;
            }

            /* Responsivo */
            @media (max-width: 768px) {
                .floating-buttons {
                    right: 15px !important;
                    bottom: 15px !important;
                }

                .floating-btn {
                    width: 55px !important;
                    height: 55px !important;
                }

                .floating-btn__icon {
                    width: 24px !important;
                    height: 24px !important;
                }

                .floating-btn__tooltip {
                    display: none !important;
                }
            }

            @media (max-width: 480px) {
                .floating-buttons {
                    right: 10px !important;
                    bottom: 10px !important;
                }

                .floating-btn {
                    width: 50px !important;
                    height: 50px !important;
                    border-width: 1px !important;
                }

                .floating-btn__icon {
                    width: 22px !important;
                    height: 22px !important;
                }
            }

            /* Estados especiales */
            .floating-btn:focus {
                outline: 2px solid var(--starflex-crimson-bright) !important;
                outline-offset: 3px !important;
            }

            /* Ocultar en impresión */
            @media print {
                .floating-buttons {
                    display: none !important;
                }
            }

            /* Mejoras para modo oscuro */
            @media (prefers-color-scheme: dark) {
                .floating-btn__tooltip {
                    background: linear-gradient(135deg, 
                        rgba(184, 0, 46, 0.98) 0%, 
                        rgba(156, 0, 37, 0.98) 100%
                    ) !important;
                    border-color: rgba(255, 69, 105, 0.5) !important;
                }
            }

            /* Reducir movimiento para usuarios que lo prefieren */
            @media (prefers-reduced-motion: reduce) {
                .floating-btn {
                    animation: none !important;
                }
                
                .floating-btn::before {
                    animation: none !important;
                }
                
                .floating-btn:hover {
                    transform: scale(1.05) !important;
                }
                
                .floating-btn__icon {
                    transition: none !important;
                }
                
                .floating-btn:hover .floating-btn__icon {
                    transform: scale(1.1) !important;
                }
            }

            /* Mejoras de contraste */
            @media (prefers-contrast: high) {
                .floating-btn {
                    border-width: 3px !important;
                    border-color: rgba(255, 69, 105, 0.8) !important;
                }
                
                .floating-btn__tooltip {
                    border-width: 2px !important;
                    border-color: rgba(255, 69, 105, 0.8) !important;
                }
            }

            /* OVERRIDE PARA CUALQUIER CONFLICTO DE CSS EXISTENTE */
            .floating-buttons,
            .floating-buttons * {
                box-sizing: border-box !important;
            }

            /* Asegurar que no hay interferencia con otros elementos */
            .floating-buttons {
                isolation: isolate !important;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// ===== DESPLAZAMIENTO SUAVE =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = $(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===== ACORDEÓN FAQ =====
class FAQAccordion {
    constructor() {
        this.faqItems = $$('.faq__item');
        this.searchInput = $('#faq-search');
        this.noResults = $('#faq-no-results');
        this.init();
    }

    init() {
        this.setupAccordion();
        this.setupSearch();
    }

    setupAccordion() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');
            const answer = item.querySelector('.faq__answer');

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Cerrar todos los otros items
                this.faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherQuestion = otherItem.querySelector('.faq__question');
                        const otherAnswer = otherItem.querySelector('.faq__answer');
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        otherAnswer.style.maxHeight = '0';
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle el item actual
                if (isExpanded) {
                    question.setAttribute('aria-expanded', 'false');
                    answer.style.maxHeight = '0';
                    item.classList.remove('active');
                } else {
                    question.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    item.classList.add('active');
                }
            });

            // Soporte para teclado
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    setupSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            this.faqItems.forEach(item => {
                const questionText = item.querySelector('.faq__question-text').textContent.toLowerCase();
                const answerText = item.querySelector('.faq__answer-text').textContent.toLowerCase();
                
                if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                    // Cerrar si está abierto
                    const question = item.querySelector('.faq__question');
                    const answer = item.querySelector('.faq__answer');
                    question.setAttribute('aria-expanded', 'false');
                    answer.style.maxHeight = '0';
                    item.classList.remove('active');
                }
            });

            // Mostrar/ocultar mensaje de no resultados
            if (this.noResults) {
                if (visibleCount === 0 && searchTerm !== '') {
                    this.noResults.classList.add('show');
                } else {
                    this.noResults.classList.remove('show');
                }
            }
        });
    }
}

// ===== ANIMACIONES DE CARACTERÍSTICAS =====
class FeatureAnimations {
    constructor() {
        this.features = $$('.feature');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.features.forEach(feature => {
            observer.observe(feature);
        });
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las funcionalidades
    new MobileNav();
    new VideoPlayer(); // ¡Reproductor de video funcional!
    new FloatingButtons(); // ¡Botones flotantes rojizos que no se ocultan!
    new SmoothScroll();
    new FAQAccordion();
    new FeatureAnimations();
    
    console.log('🚀 StarFlex Landing Page cargada completamente');
});

// ===== OPTIMIZACIÓN DE RENDIMIENTO =====
// Throttle para eventos de scroll
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Precargar recursos críticos
function preloadCriticalResources() {
    const criticalImages = [
        './assets/phones/Horario.jpg',
        './assets/phones/Estaciones.jpg',
        './assets/phones/Calendario.jpg',
        './assets/phones/Registro.jpg',
        './assets/phones/Configuracion.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Ejecutar precarga cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalResources);
} else {
    preloadCriticalResources();
}