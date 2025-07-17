// ===== LAZY LOADING =====
const setupImageLazyLoading = () => {
    const wait = () => {
        if (!imageLoader) return setTimeout(wait, 50);
        
        const loadNow = (sel, key) => { 
            const el = document.querySelector(sel); 
            if (el) imageLoader.loadNow(el, key); 
        };
        
        const observe = (sel, key) => { 
            const el = document.querySelector(sel); 
            if (el) imageLoader.observe(el, key); 
        };
        
        loadNow('.nav__logo', 'logo');
        loadNow('.nav__drawer-logo', 'logo');
        loadNow('.hero__phone-app-image', 'hero');
        
        const keys = ['phones.horario', 'phones.estaciones', 'phones.calendario', 'phones.registro', 'phones.notificaciones', 'phones.referidos'];
        document.querySelectorAll('.phone__app-image').forEach((img, i) => {
            if (keys[i]) {
                state.isMobile ? imageLoader.loadNow(img, keys[i]) : imageLoader.observe(img, keys[i]);
            }
        });
        
        // Cargar imágenes de descarga con src directo en móviles
        if (state.isMobile) {
            const googlePlayImg = document.querySelector('.download-btn--google .download-btn__image');
            const appStoreImg = document.querySelector('.download-btn--app-store .download-btn__image');
            
            if (googlePlayImg) {
                googlePlayImg.src = './assets/GooglePlay.png';
                googlePlayImg.style.backgroundImage = 'none';
                googlePlayImg.style.display = 'block';
                googlePlayImg.style.visibility = 'visible';
                googlePlayImg.style.opacity = '1';
            }
            
            if (appStoreImg) {
                appStoreImg.src = './assets/AppleStore.png';
                appStoreImg.style.backgroundImage = 'none';
                appStoreImg.style.display = 'block';
                appStoreImg.style.visibility = 'visible';
                appStoreImg.style.opacity = '1';
            }
        } else {
            loadNow('.download-btn--app-store .download-btn__image', 'downloads.apple');
            loadNow('.download-btn--google .download-btn__image', 'downloads.google');
        }
    };
    wait();
};