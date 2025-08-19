// Componentes y funcionalidades para aplicativo móvil

class MobileApp {
  constructor() {
    this.init();
    this.setupEventListeners();
    this.setupServiceWorker();
  }

  init() {
    // Configurar viewport para móvil
    this.setupViewport();
    
    // Detectar tipo de dispositivo
    this.detectDevice();
    
    // Configurar gestos táctiles
    this.setupTouchGestures();
    
    // Configurar navegación
    this.setupNavigation();
    
    // Configurar notificaciones
    this.setupNotifications();
  }

  setupViewport() {
    // Prevenir zoom en inputs
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Configurar meta viewport dinámicamente
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
  }

  detectDevice() {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isMobile = /Mobi|Android/i.test(userAgent);
    
    document.body.classList.add(
      isIOS ? 'ios' : isAndroid ? 'android' : 'desktop',
      isMobile ? 'mobile' : 'desktop'
    );

    // Configurar safe areas para dispositivos con notch
    if (isIOS) {
      document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
    }
  }

  setupTouchGestures() {
    let startY = 0;
    let startX = 0;
    let isScrolling = false;

    document.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isScrolling = false;
    }, {passive: true});

    document.addEventListener('touchmove', (e) => {
      if (!startY || !startX) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = startY - currentY;
      const diffX = startX - currentX;

      if (Math.abs(diffY) > Math.abs(diffX)) {
        isScrolling = true;
      }

      // Pull to refresh
      if (diffY < -100 && window.scrollY === 0 && !isScrolling) {
        this.triggerRefresh();
      }
    }, {passive: true});

    document.addEventListener('touchend', () => {
      startY = 0;
      startX = 0;
      isScrolling = false;
    }, {passive: true});
  }

  setupNavigation() {
    // Navegación con historial
    window.addEventListener('popstate', (e) => {
      if (e.state) {
        this.navigateTo(e.state.page, false);
      }
    });

    // Interceptar enlaces para navegación SPA
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-page]');
      if (link) {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        this.navigateTo(page, true);
      }
    });
  }

  navigateTo(page, addToHistory = true) {
    // Animación de transición
    document.body.classList.add('page-transition');
    
    setTimeout(() => {
      // Cambiar contenido
      this.loadPage(page);
      
      if (addToHistory) {
        history.pushState({page}, '', `#${page}`);
      }
      
      document.body.classList.remove('page-transition');
    }, 150);
  }

  loadPage(page) {
    // Lógica para cargar diferentes páginas
    const pages = {
      'home': this.loadHomePage,
      'matches': this.loadMatchesPage,
      'profile': this.loadProfilePage,
      'settings': this.loadSettingsPage
    };

    if (pages[page]) {
      pages[page].call(this);
    }
  }

  setupNotifications() {
    // Solicitar permisos de notificación
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notificaciones habilitadas');
        }
      });
    }
  }

  showNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/img/logo_3-removebg-preview.png',
        badge: '/img/logo_3-removebg-preview.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado:', registration);
        })
        .catch(error => {
          console.log('Error al registrar Service Worker:', error);
        });
    }
  }

  triggerRefresh() {
    // Mostrar indicador de recarga
    this.showToast('Actualizando...', 'info');
    
    // Simular recarga de datos
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  showToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, duration);
  }

  // Métodos para cargar páginas
  loadHomePage() {
    document.getElementById('main-content').innerHTML = `
      <div class="mobile-card">
        <h2>Partidos de Hoy</h2>
        <div class="matches-container">
          <!-- Contenido de partidos -->
        </div>
      </div>
    `;
  }

  loadMatchesPage() {
    document.getElementById('main-content').innerHTML = `
      <div class="mobile-card">
        <h2>Todos los Partidos</h2>
        <div class="matches-list">
          <!-- Lista de partidos -->
        </div>
      </div>
    `;
  }

  loadProfilePage() {
    document.getElementById('main-content').innerHTML = `
      <div class="mobile-card">
        <h2>Mi Perfil</h2>
        <div class="profile-content">
          <!-- Contenido del perfil -->
        </div>
      </div>
    `;
  }

  loadSettingsPage() {
    document.getElementById('main-content').innerHTML = `
      <div class="mobile-card">
        <h2>Configuración</h2>
        <div class="settings-content">
          <!-- Opciones de configuración -->
        </div>
      </div>
    `;
  }
}

// Utilidades para móvil
class MobileUtils {
  static vibrate(pattern = [100]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  static isOnline() {
    return navigator.onLine;
  }

  static getNetworkInfo() {
    if ('connection' in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      };
    }
    return null;
  }

  static shareContent(data) {
    if (navigator.share) {
      return navigator.share(data);
    } else {
      // Fallback para navegadores que no soportan Web Share API
      if (navigator.clipboard) {
        navigator.clipboard.writeText(data.url || data.text);
        return Promise.resolve();
      }
    }
  }

  static requestWakeLock() {
    if ('wakeLock' in navigator) {
      return navigator.wakeLock.request('screen');
    }
    return Promise.reject('Wake Lock no soportado');
  }

  static detectOrientation() {
    if (screen.orientation) {
      return screen.orientation.angle;
    }
    return window.orientation || 0;
  }

  static addToHomeScreen() {
    // Esta función se llamará cuando el evento beforeinstallprompt se dispare
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuario aceptó instalar la app');
        }
        window.deferredPrompt = null;
      });
    }
  }
}

// Inicializar la aplicación móvil
document.addEventListener('DOMContentLoaded', () => {
  window.mobileApp = new MobileApp();
  window.mobileUtils = MobileUtils;
});

// Manejar el evento de instalación de PWA
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  
  // Mostrar botón de instalación personalizado
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', MobileUtils.addToHomeScreen);
  }
});

// Manejar cambios de conectividad
window.addEventListener('online', () => {
  window.mobileApp.showToast('Conexión restaurada', 'success');
});

window.addEventListener('offline', () => {
  window.mobileApp.showToast('Sin conexión a internet', 'warning');
});