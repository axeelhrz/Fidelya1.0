# Configuración del Sistema de Notificaciones

Este documento describe cómo configurar el sistema completo de envío de notificaciones externas.

## Servicios Externos Requeridos

### 1. SendGrid (Email)

1. Crear cuenta en [SendGrid](https://sendgrid.com)
2. Generar API Key en Settings > API Keys
3. Verificar dominio de envío
4. Configurar variables de entorno:

   SENDGRID_API_KEY=your_sendgrid_api_key
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Fidelita


### 2. Twilio (SMS)

1. Crear cuenta en [Twilio](https://twilio.com)
2. Obtener Account SID y Auth Token del dashboard
3. Comprar número de teléfono para envío
4. Configurar variables de entorno:

   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_FROM_NUMBER=+1234567890


### 3. Firebase Cloud Messaging (Push)

1. Ir a Firebase Console > Project Settings > Cloud Messaging
2. Generar Server Key
3. Configurar variable de entorno:

   FCM_SERVER_KEY=your_fcm_server_key


## Configuración de Webhooks

### SendGrid Webhooks

1. Ir a Settings > Mail Settings > Event Webhook
2. Configurar URL: `https://yourdomain.com/api/webhooks/delivery`
3. Seleccionar eventos: `processed`, `delivered`, `bounce`, `dropped`
4. Activar webhook

### Twilio Webhooks

1. En la configuración del número de teléfono
2. Configurar Status Callback URL: `https://yourdomain.com/api/webhooks/delivery`
3. Seleccionar eventos de estado

## Configuración de Base de Datos

### Colecciones de Firestore

El sistema utiliza las siguientes colecciones:


// Configuración de notificaciones de usuario
notificationSettings: {
  userId: string,
  emailNotifications: boolean,
  pushNotifications: boolean,
  smsNotifications: boolean,
  categories: {
    system: boolean,
    membership: boolean,
    payment: boolean,
    event: boolean,
    general: boolean
  },
  priorities: {
    low: boolean,
    medium: boolean,
    high: boolean,
    urgent: boolean
  },
  quietHours: {
    enabled: boolean,
    start: string,
    end: string
  },
  frequency: string,
  updatedAt: Date
}

// Registros de entrega
notificationDeliveries: {
  notificationId: string,
  recipientId: string,
  channel: string, // 'email' | 'sms' | 'push' | 'app'
  status: string,  // 'pending' | 'sent' | 'delivered' | 'failed'
  sentAt?: Date,
  deliveredAt?: Date,
  failureReason?: string,
  retryCount: number,
  metadata: object
}


## Configuración de Seguridad

### Reglas de Firestore


rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Configuración de notificaciones - solo el usuario puede leer/escribir
    match /notificationSettings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Registros de entrega - solo lectura para el usuario
    match /notificationDeliveries/{deliveryId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.recipientId;
      allow write: if false; // Solo el servidor puede escribir
    }
    
    // Notificaciones - lectura para usuarios autenticados
    match /notifications/{notificationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.token.role == 'asociacion';
    }
  }
}


## Uso del Sistema

### Crear Notificación con Envío Externo


import { useNotifications } from '@/hooks/useNotifications';

const { createNotification } = useNotifications();

await createNotification({
  title: 'Nueva promoción disponible',
  message: 'Descubre nuestras ofertas especiales...',
  type: 'announcement',
  priority: 'high',
  category: 'general',
  sendExternal: true,
  recipientIds: ['user1', 'user2'], // o undefined para todos
  actionUrl: 'https://app.com/promociones',
  actionLabel: 'Ver promociones'
});


### Configurar Preferencias de Usuario


import { NotificationSettingsComponent } from '@/components/settings/NotificationSettings';

<NotificationSettingsComponent
  userId={currentUser.uid}
  onSettingsChange={(settings) => {
    console.log('Settings updated:', settings);
  }}
/>


### Ver Estadísticas de Entrega


import { DeliveryStats } from '@/components/notifications/DeliveryStats';

<DeliveryStats
  notificationId="notification_id"
  onRefresh={() => {
    console.log('Stats refreshed');
  }}
/>


## Monitoreo y Logs

### Logs de Entrega

El sistema registra automáticamente:
- Intentos de envío
- Confirmaciones de entrega
- Fallos y razones
- Reintentos automáticos

### Métricas Disponibles

- Tasa de entrega por canal
- Tiempo promedio de entrega
- Fallos por tipo
- Engagement por tipo de notificación

## Solución de Problemas

### Problemas Comunes

1. **Emails no se envían**
   - Verificar API key de SendGrid
   - Confirmar dominio verificado
   - Revisar límites de envío

2. **SMS fallan**
   - Verificar créditos en Twilio
   - Confirmar formato de números
   - Revisar restricciones geográficas

3. **Push notifications no llegan**
   - Verificar FCM server key
   - Confirmar tokens de dispositivo válidos
   - Revisar permisos de la app

### Logs de Debug


// Activar logs detallados
localStorage.setItem('debug_notifications', 'true');


## Escalabilidad

### Consideraciones de Rendimiento

- Envío en lotes para grandes volúmenes
- Rate limiting por proveedor
- Reintentos automáticos con backoff exponencial
- Caching de configuraciones de usuario

### Límites de Servicios

- SendGrid: 100 emails/día (plan gratuito)
- Twilio: Según créditos comprados
- FCM: Sin límite (con rate limiting)

## Cumplimiento y Privacidad

### GDPR/LOPD

- Consentimiento explícito para cada canal
- Opción de darse de baja fácilmente
- Eliminación de datos bajo solicitud
- Logs de consentimiento

### Mejores Prácticas

- Respetar horarios de silencio
- Frecuencia apropiada de envíos
- Contenido relevante y personalizado
- Opciones granulares de configuración


## Resumen de la Implementación

He implementado un sistema completo de envío de notificaciones externas que incluye:

### ✅ **Funcionalidades Implementadas:**

1. **Servicio de Notificaciones Externas** (`notifications.service.ts`)
   - Integración con SendGrid para emails
   - Integración con Twilio para SMS
   - Integración con Firebase Cloud Messaging para push notifications
   - Sistema de reintentos y manejo de errores
   - Templates personalizables para emails

2. **Configuración de Usuario** (`NotificationSettings.tsx`)
   - Preferencias por canal (email, SMS, push)
   - Configuración por categoría y prioridad
   - Horarios de silencio
   - Frecuencia de notificaciones

3. **Estadísticas de Entrega** (`DeliveryStats.tsx`)
   - Métricas en tiempo real
   - Tasa de éxito por canal
   - Visualización de fallos y entregas

4. **Formulario Mejorado** (`CreateNotificationDialog.tsx`)
   - Opciones de envío externo
   - Selección de canales
   - Selección de destinatarios
   - Vista previa en tiempo real

5. **Hook Actualizado** (`useNotifications.ts`)
   - Integración con servicios externos
   - Manejo de estados de envío
   - Estadísticas de entrega

6. **API de Webhooks** (`/api/webhooks/delivery/route.ts`)
   - Confirmaciones de entrega de proveedores
   - Actualización automática de estados
   - Validación de firmas

7. **Documentación Completa**
   - Guía de configuración
   - Variables de entorno
   - Configuración de webhooks
   - Solución de problemas

### 🚀 **Características Destacadas:**

- **Envío Multi-canal**: Email, SMS y Push notifications
- **Configuración Granular**: Por usuario, categoría y prioridad
- **Tracking Completo**: Estado de entrega en tiempo real
- **Horarios de Silencio**: Respeta preferencias de usuario
- **Templates Responsivos**: Emails con diseño profesional
- **Reintentos Automáticos**: Manejo inteligente de fallos
- **Webhooks de Confirmación**: Actualizaciones automáticas de estado
- **Escalabilidad**: Envío en lotes para grandes volúmenes

El sistema está listo para producción y solo requiere configurar las variables de entorno con las credenciales de los servicios externos (SendGrid, Twilio, FCM).
