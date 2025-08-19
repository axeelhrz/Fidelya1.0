# 🚀 Raquet Power - Sistema de Autenticación

Este documento describe cómo configurar y usar el sistema de autenticación completo de Raquet Power.

## 📋 Características Implementadas

✅ **Sistema de Registro por Roles**
- Liga: Administra múltiples clubes y competencias
- Club: Gestiona miembros y actividades deportivas  
- Miembro: Participa en actividades y competencias

✅ **Autenticación Completa**
- Inicio de sesión seguro
- Registro con validación por roles
- Navegación automática según el rol del usuario

✅ **Base de Datos Estructurada**
- Migraciones completas para todas las tablas
- Relaciones polimórficas entre usuarios y entidades
- Seeders con datos de ejemplo

✅ **Dashboards Específicos por Rol**
- Panel de Liga: Gestión de clubes y miembros
- Panel de Club: Gestión de miembros del club
- Panel de Miembro: Vista personal del usuario
- Panel de Super Admin: Acceso completo al sistema

## 🛠️ Configuración del Backend

### 1. Configurar la Base de Datos

```bash
# Navegar al directorio del backend
cd backendd

# Ejecutar el script de configuración automática
./setup-database.sh
```

O manualmente:

```bash
# Ejecutar migraciones
php artisan migrate:fresh

# Ejecutar seeders
php artisan db:seed
```

### 2. Iniciar el Servidor Backend

```bash
# En el directorio backendd/
php artisan serve --port=8001
```

El backend estará disponible en: `http://localhost:8001`

## 🎨 Configuración del Frontend

### 1. Instalar Dependencias

```bash
# Navegar al directorio del frontend
cd frontendd

# Instalar dependencias
npm install
```

### 2. Configurar Variables de Entorno

Crear archivo `.env.local` en `frontendd/`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
```

### 3. Iniciar el Servidor Frontend

```bash
# En el directorio frontendd/
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

## 👥 Cuentas de Prueba

### Super Administrador
- **Email:** `admin@raquetpower.com`
- **Contraseña:** `admin123456`
- **Acceso:** Panel completo del sistema

### Administradores de Liga
- **Liga Nacional:** `liga.nacional@raquetpower.com` / `liga123456`
- **Liga Pichincha:** `liga.pichincha@raquetpower.com` / `liga123456`
- **Liga Guayas:** `liga.guayas@raquetpower.com` / `liga123456`
- **Liga Azuay:** `liga.azuay@raquetpower.com` / `liga123456`

### Administradores de Club
- **Club Campeones:** `club.campeones@raquetpower.com` / `club123456`
- **Club Raqueta de Oro:** `club.raquetadeoro@raquetpower.com` / `club123456`
- **Club Tenis Mesa Quito:** `club.tenismesaquito@raquetpower.com` / `club123456`
- **Club Machala:** `club.machala@raquetpower.com` / `club123456`
- **Club Ping Pong Elite:** `club.pingpongelite@raquetpower.com` / `club123456`

## 🔄 Flujo de Autenticación

### 1. Registro de Nuevos Usuarios

1. **Selección de Rol:** El usuario elige entre Liga, Club o Miembro
2. **Formulario Específico:** Campos dinámicos según el rol seleccionado
3. **Validación:** Validación tanto en frontend como backend
4. **Creación de Entidades:** Se crean automáticamente las entidades relacionadas
5. **Redirección:** Navegación automática al dashboard correspondiente

### 2. Inicio de Sesión

1. **Credenciales:** Email y contraseña
2. **Validación:** Verificación en el backend
3. **Contexto de Usuario:** Información cargada en el contexto de React
4. **Redirección por Rol:** Navegación automática según el rol del usuario

### 3. Navegación por Roles

- **Super Admin:** `/dashboard` (acceso completo)
- **Liga:** `/dashboard/liga` (gestión de clubes)
- **Club:** `/dashboard/club` (gestión de miembros)
- **Miembro:** `/dashboard/miembro` (vista personal)

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

- **users:** Información base de todos los usuarios
- **leagues:** Entidades de ligas deportivas
- **clubs:** Entidades de clubes deportivos
- **members:** Entidades de miembros

### Relaciones

- Un usuario puede ser administrador de una liga, club o ser un miembro
- Las ligas tienen múltiples clubes
- Los clubes tienen múltiples miembros
- Relaciones polimórficas entre usuarios y sus entidades correspondientes

## 🔧 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `GET /api/auth/me` - Información del usuario autenticado

### Datos para Registro
- `GET /api/auth/leagues` - Ligas disponibles para registro de clubes
- `GET /api/auth/clubs` - Clubes disponibles para registro de miembros

### Recursos Protegidos
- `GET /api/leagues` - Gestión de ligas
- `GET /api/clubs` - Gestión de clubes
- `GET /api/members` - Gestión de miembros

## 🎯 Funcionalidades por Rol

### Super Administrador
- Acceso completo a todos los dashboards
- Gestión de todas las ligas, clubes y miembros
- Vista general del sistema

### Administrador de Liga
- Gestión de clubes afiliados
- Supervisión de miembros de todos los clubes
- Estadísticas de la liga

### Administrador de Club
- Gestión de miembros del club
- Estadísticas del club
- Organización de actividades

### Miembro
- Vista de perfil personal
- Información del club y liga
- Estadísticas personales

## 🚨 Solución de Problemas

### Error de CORS
Si encuentras errores de CORS, verifica que:
- El backend esté ejecutándose en el puerto correcto (8001)
- La variable `NEXT_PUBLIC_BACKEND_URL` esté configurada correctamente

### Error de Base de Datos
Si hay problemas con la base de datos:
```bash
# Reiniciar completamente la base de datos
cd backendd
php artisan migrate:fresh --seed
```

### Error de Dependencias
Si hay problemas con las dependencias del frontend:
```bash
cd frontendd
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notas Adicionales

- El sistema usa cookies para mantener la sesión
- Las contraseñas están hasheadas con bcrypt
- Los tokens CSRF se manejan automáticamente
- El sistema es responsive y funciona en dispositivos móviles

## 🎉 ¡Listo para Usar!

El sistema de autenticación está completamente funcional. Puedes:

1. Registrar nuevos usuarios con diferentes roles
2. Iniciar sesión con las cuentas de prueba
3. Navegar entre los diferentes dashboards
4. Probar todas las funcionalidades por rol

¡Disfruta usando Raquet Power! 🏓