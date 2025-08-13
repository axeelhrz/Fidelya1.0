# 🚀 RAQUET POWER - DEMO URLS

## ✅ Estado Actual - LISTO PARA EL CLIENTE

### 🌐 URLs de Acceso

**Frontend (Interfaz de Usuario):**
https://a34e7fb8521c.ngrok-free.app

**Backend API (para desarrolladores):**
https://straight-truly-continuity-glow.trycloudflare.com

**Health Check:**
https://straight-truly-continuity-glow.trycloudflare.com/api/health

---

## ⚙️ Configuración Completada

### ✅ Variables de Entorno del Frontend
- ✅ Archivo `frontendd/.env.local` creado con la URL del backend
- ✅ Frontend configurado para conectarse al backend en producción

### ✅ Configuración CORS del Backend
- ✅ Archivo `backendd/config/cors.php` actualizado
- ✅ Permitido acceso desde el frontend ngrok
- ✅ Configurados patrones para ngrok y otros dominios

### ✅ Configuración de Sesiones
- ✅ Variables `SESSION_SECURE_COOKIE=true` y `SANCTUM_STATEFUL_DOMAINS` agregadas
- ✅ Backend configurado para trabajar con HTTPS

### ✅ Servicios Activos
- ✅ Frontend corriendo en puerto 3001 (accesible vía ngrok)
- ✅ Backend corriendo y respondiendo correctamente
- ✅ Health check confirmado: `{"status":"ok","timestamp":"2025-08-13T15:20:17.654566Z"}`

---

## ⚠️ NOTAS IMPORTANTES

- **URLs temporales:** Válidas mientras los túneles estén activos
- **Seguridad:** No exponer base de datos (solo backend se conecta)
- **Cambios:** Si se reinician los túneles, las URLs cambiarán

---

## 🔄 Comandos para Gestión (Si necesitas reiniciar)

### Reiniciar Túneles:

**Terminal 1 - Frontend:**
```bash
ngrok http 3001
```

**Terminal 2 - Backend:**
```bash
cloudflared tunnel --url http://localhost:8001
```

### Después de reiniciar túneles:
1. Actualizar `frontendd/.env.local` con nueva URL del backend
2. Actualizar `backendd/config/cors.php` con nueva URL del frontend
3. Reiniciar ambos servicios

---

## 🎯 Para el Cliente

**¡Tu proyecto ya está listo para ser probado como si estuviera en producción!**

Puedes acceder a la aplicación en: **https://a34e7fb8521c.ngrok-free.app**

La aplicación incluye:
- ✅ Sistema de autenticación completo
- ✅ Gestión de ligas, clubes y miembros
- ✅ Gestión de deportes y parámetros
- ✅ Interfaz responsive y moderna
- ✅ API REST completamente funcional
- ✅ Configuración de producción

(ending readme)