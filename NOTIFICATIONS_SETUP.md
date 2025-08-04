# 🔔 Sistema de Notificaciones Gratuitas - Guía de Configuración

Este documento explica cómo configurar el sistema de notificaciones completamente gratuito implementado en Fidelya.

## 📋 Características del Sistema

### ✅ Servicios Gratuitos Incluidos
- **Notificaciones In-App**: Siempre funcionan, no requieren configuración externa
- **Notificaciones del Navegador**: Nativas, sin límites
- **Firebase Cloud Messaging (FCM)**: 20M mensajes/mes gratis
- **EmailJS**: 200 emails/mes gratis
- **Sistema de Fallback**: Si un servicio falla, usa otro automáticamente

### 🚫 Servicios Pagos Removidos
- ~~SendGrid~~ (reemplazado por EmailJS)
- ~~Twilio SMS~~ (opcional, solo si lo necesitas)
- ~~Sistema de cola complejo~~ (simplificado)

## 🚀 Configuración Rápida (Solo Servicios Gratuitos)

### 1. Firebase Cloud Messaging (Push Notifications)

#### Paso 1: Generar VAPID Key
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** > **Cloud Messaging**
4. En la sección **Web configuration**, genera un nuevo par de claves
5. Copia la **VAPID key**

#### Paso 2: Obtener Server Key
1. En la misma página, ve a la pestaña **Cloud Messaging API (Legacy)**
2. Copia el **Server key**

#### Paso 3: Configurar Variables de Entorno
```bash
# En tu archivo .env.local
NEXT_PUBLIC_FCM_VAPID_KEY=tu_vapid_key_aqui
FCM_SERVER_KEY=tu_server_key_aqui
```

### 2. EmailJS (Emails Gratuitos)

#### Paso 1: Crear Cuenta en EmailJS
1. Ve a [EmailJS](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

#### Paso 2: Configurar Servicio de Email
1. En el dashboard, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona tu proveedor (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. Copia el **Service ID**

#### Paso 3: Crear Template de Email
1. Ve a **Email Templates**
2. Haz clic en **Create New Template**
3. Usa este template básico:

```html
Hola {{to_name}},

{{message}}

{{#action_url}}
{{action_label}}: {{action_url}}
{{/action_url}}

Saludos,
{{from_name}}
```

4. Guarda y copia el **Template ID**

#### Paso 4: Obtener Public Key
1. Ve a **Account** > **General**
2. Copia tu **Public Key**

#### Paso 5: Configurar Variables de Entorno
```bash
# En tu archivo .env.local
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key
```

### 3. Configuración de la App
```bash
# En tu archivo .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Cambia por tu dominio en producción
```

## 📦 Instalación de Dependencias

El sistema usa EmailJS que se carga dinámicamente, pero puedes instalarlo para mejor rendimiento:

```bash
npm install @emailjs/browser
```

## 🔧 Uso del Sistema

### Importar el Hook
```typescript
import { useFreeNotifications } from '@/hooks/useFreeNotifications';

function MyComponent() {
  const {
    // Funciones básicas
    success,
    error,
    warning,
    info,
    urgent,
    
    // Funciones avanzadas
    sendExternalNotification,
    sendBulkNotification,
    requestPermissions,
    
    // Estado
    status,
    loading,
    isHealthy,
    hasPermissions
  } = useFreeNotifications();

  // Mostrar notificación simple
  const handleSuccess = () => {
    success('¡Éxito!', 'La operación se completó correctamente');
  };

  // Enviar notificación externa
  const handleExternalNotification = async () => {
    await sendExternalNotification(
      'user-id',
      'Título',
      'Mensaje',
      {
        type: 'info',
        priority: 'medium',
        actionUrl: '/dashboard',
        actionLabel: 'Ver Dashboard'
      }
    );
  };

  return (
    <div>
      <button onClick={handleSuccess}>Mostrar Éxito</button>
      <button onClick={handleExternalNotification}>Enviar Externa</button>
      <button onClick={requestPermissions}>Solicitar Permisos</button>
    </div>
  );
}
```

### Funciones Globales (Compatibilidad)
```typescript
import { showSuccess, showError, showWarning, showInfo, showUrgent } from '@/lib/free-notification-manager';

// Usar en cualquier parte de la app
showSuccess('Título', 'Mensaje');
showError('Error', 'Algo salió mal');
showUrgent('¡Urgente!', 'Acción requerida inmediatamente');
```

## 🔍 Diagnóstico del Sistema

### Verificar Estado
```typescript
const { runDiagnostic, status } = useFreeNotifications();

const checkSystem = async () => {
  const diagnostic = await runDiagnostic();
  console.log('Estado:', diagnostic.status); // 'healthy', 'warning', 'error'
  console.log('Problemas:', diagnostic.issues);
  console.log('Recomendaciones:', diagnostic.recommendations);
};
```

### Verificar Servicios Disponibles
```typescript
const {
  isEmailAvailable,
  isPushAvailable,
  isBrowserAvailable,
  hasPermissions,
  isHealthy
} = useFreeNotifications();

console.log('Email disponible:', isEmailAvailable);
console.log('Push disponible:', isPushAvailable);
console.log('Browser disponible:', isBrowserAvailable);
console.log('Tiene permisos:', hasPermissions);
console.log('Sistema saludable:', isHealthy);
```

## 🛠️ Solución de Problemas

### Problema: Push Notifications No Funcionan
**Solución:**
1. Verifica que `NEXT_PUBLIC_FCM_VAPID_KEY` esté configurado
2. Verifica que `FCM_SERVER_KEY` esté configurado
3. Asegúrate de que el service worker (`/public/sw.js`) esté accesible
4. Verifica permisos del navegador

### Problema: Emails No Se Envían
**Solución:**
1. Verifica configuración de EmailJS
2. Revisa que el template tenga los campos correctos: `{{to_name}}`, `{{message}}`, etc.
3. Verifica límites de EmailJS (200 emails/mes en plan gratuito)
4. Revisa la consola del navegador para errores

### Problema: Notificaciones del Navegador No Aparecen
**Solución:**
1. Solicita permisos: `requestPermissions()`
2. Verifica configuración del navegador
3. Algunos navegadores bloquean notificaciones en localhost

## 📊 Límites de Servicios Gratuitos

### Firebase Cloud Messaging
- **Límite:** 20,000,000 mensajes/mes
- **Costo adicional:** $0.50 por cada 1M mensajes extra
- **Recomendación:** Más que suficiente para la mayoría de aplicaciones

### EmailJS
- **Límite:** 200 emails/mes
- **Costo adicional:** $15/mes por 1,000 emails
- **Recomendación:** Ideal para notificaciones importantes

### Notificaciones del Navegador
- **Límite:** Sin límite
- **Costo:** Completamente gratis
- **Recomendación:** Usar como principal método de notificación

## 🔄 Migración desde Sistema Anterior

Si tenías el sistema anterior con SendGrid/Twilio, puedes migrar gradualmente:

1. **Mantén configuración anterior** (opcional)
2. **Agrega configuración nueva** (EmailJS, FCM)
3. **El sistema detecta automáticamente** qué servicios están disponibles
4. **Usa fallbacks inteligentes** si algún servicio falla

## 🚀 Despliegue en Producción

### Variables de Entorno Requeridas
```bash
# Firebase (obligatorio para push)
NEXT_PUBLIC_FCM_VAPID_KEY=
FCM_SERVER_KEY=

# EmailJS (obligatorio para emails)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

# App URL (obligatorio)
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### Verificación Post-Despliegue
1. Abre la consola del navegador
2. Busca mensajes de inicialización: `🔔 Inicializando gestor de notificaciones gratuitas...`
3. Verifica que no haya errores de configuración
4. Prueba cada tipo de notificación

## 📈 Monitoreo y Métricas

El sistema incluye métricas automáticas:

```typescript
const { status, queueSize, diagnosticStatus } = useFreeNotifications();

// Estado del sistema
console.log('Inicializado:', status.initialized);
console.log('Cola de notificaciones:', queueSize);
console.log('Estado diagnóstico:', diagnosticStatus);
```

## 🎯 Mejores Prácticas

1. **Solicita permisos al momento adecuado** (no inmediatamente al cargar)
2. **Usa prioridades correctamente** (urgent solo para emergencias)
3. **Proporciona URLs de acción** para mejor UX
4. **Monitorea límites de servicios** gratuitos
5. **Implementa fallbacks** para casos de fallo

## 🆘 Soporte

Si tienes problemas:

1. **Revisa la consola** del navegador para errores
2. **Ejecuta diagnóstico** con `runDiagnostic()`
3. **Verifica configuración** de variables de entorno
4. **Consulta documentación** de Firebase y EmailJS

---

¡El sistema está diseñado para funcionar sin problemas con servicios completamente gratuitos! 🎉