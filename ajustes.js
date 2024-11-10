// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDMFTlJxZdDGQ0IV0skUI6ozgPGxLYhsDg",
    authDomain: "futbol-total-b4166.firebaseapp.com",
    projectId: "futbol-total-b4166",
    storageBucket: "futbol-total-b4166.appspot.com",
    messagingSenderId: "510814548258",
    appId: "1:510814548258:web:a3c8599e36c621bdfd757b",
    measurementId: "G-T0J7Q4S9YP"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Función para obtener el nombre de usuario eliminando la parte después del @
function getUserNameFromEmail(email) {
    return email.split('@')[0];  // Solo la parte antes del @
}

// Función para traducir el contenido
let currentLanguage = localStorage.getItem('lang') || 'es';  // Recupera el idioma de localStorage

const translations = {
    es: {
        ajustesDeCuenta: "Ajustes de Cuenta",
        cerrarSesión: "Cerrar Sesión",
        cerrarSesiónExito: "Sesión cerrada exitosamente",
        errorCerrarSesión: "Error al cerrar sesión: ",
        flag: "🇪🇸"
    },
    en: {
        ajustesDeCuenta: "Account Settings",
        cerrarSesión: "Log Out",
        cerrarSesiónExito: "Successfully logged out",
        errorCerrarSesión: "Error logging out: ",
        flag: "🇺🇸"
    }
};

const translatePage = (lang) => {
    document.getElementById('ajustes-title').textContent = translations[lang].ajustesDeCuenta;
    document.getElementById('logout-btn').textContent = translations[lang].cerrarSesión;
    document.getElementById('language-flag').textContent = translations[lang].flag;
};

// Cambiar idioma al hacer clic en el botón de idioma
document.getElementById('language-switch-btn').addEventListener('click', () => {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    localStorage.setItem('lang', currentLanguage);
    translatePage(currentLanguage);
});

// Inicialización de traducción
translatePage(currentLanguage);

// Muestra el nombre del usuario en el perfil
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userName = getUserNameFromEmail(user.email);
        document.getElementById('user-name').textContent = userName;
        document.getElementById('email').value = user.email;
    } else {
        window.location.href = 'index.html';
    }
});

// Cerrar sesión
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            showToast(translations[currentLanguage].cerrarSesiónExito);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);  // Espera 2 segundos antes de redirigir
        })
        .catch((error) => {
            showToast(translations[currentLanguage].errorCerrarSesión + error.message);
        });
});

// Función para mostrar notificaciones (Toast)
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'show';
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}
