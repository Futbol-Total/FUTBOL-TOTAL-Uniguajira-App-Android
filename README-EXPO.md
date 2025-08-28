# Futbol Total - React Native con Expo

## 🚀 Guía para generar APK

### 1. Instalar dependencias globales

```bash
npm install -g expo-cli eas-cli
```

### 2. Instalar dependencias del proyecto

```bash
npm install
```

### 3. Configurar assets

Copia el logo existente a la carpeta `assets/` con los nombres requeridos:
- `icon.png` (1024x1024px)
- `adaptive-icon.png` (1024x1024px) 
- `splash.png` (1284x2778px)
- `logo.png` (tamaño original)

### 4. Autenticarse en Expo

```bash
eas login
```

### 5. Configurar el proyecto

```bash
eas build:configure
```

### 6. Generar APK de prueba

```bash
eas build -p android --profile preview
```

### 7. Generar APK de producción

```bash
eas build -p android --profile production
```

### 8. Descargar e instalar

Una vez completado el build, EAS te proporcionará un link para descargar el APK.

## 📱 Características de la app móvil

- ✅ Autenticación con Firebase
- ✅ Widget de partidos en vivo
- ✅ Navegación por pestañas
- ✅ Diseño responsivo
- ✅ Animaciones fluidas
- ✅ Soporte para notificaciones
- ✅ Modo offline básico

## 🔧 Comandos útiles

```bash
# Ejecutar en desarrollo
npm start

# Ejecutar en Android (emulador)
npm run android

# Ejecutar en iOS (simulador)
npm run ios

# Ejecutar en web
npm run web

# Build para Android
npm run build:android

# Build de preview
npm run build:preview
```

## 📋 Requisitos del sistema

- Node.js 18+
- Expo CLI
- EAS CLI
- Android Studio (opcional, para emulador)
- Dispositivo Android para pruebas

## 🎯 Próximos pasos

1. Configurar assets en la carpeta `assets/`
2. Probar la app en desarrollo con `npm start`
3. Generar APK con `eas build`
4. Distribuir o subir a Google Play Store