# Casino Escolar - Sistema de Gestión de Pedidos

Sistema completo para la gestión de pedidos de almuerzos y colaciones en establecimientos educacionales, desarrollado con Next.js, Supabase y TypeScript.

## 🚀 Características Principales

### Para Usuarios (Apoderados)
- ✅ Registro y autenticación segura
- ✅ Gestión de múltiples estudiantes
- ✅ Selección de menús semanales
- ✅ Proceso de pago integrado con GetNet
- ✅ Historial de pedidos
- ✅ Notificaciones en tiempo real

### Para Administradores
- ✅ Dashboard completo con estadísticas
- ✅ Gestión de usuarios y roles
- ✅ Administración de menús
- ✅ Reportes y exportación de datos
- ✅ Sistema de permisos granular
- ✅ Configuración del sistema

### Características Técnicas
- ✅ Arquitectura moderna con Next.js 15
- ✅ Base de datos PostgreSQL con Supabase
- ✅ Autenticación y autorización robusta
- ✅ Sistema de roles y permisos avanzado
- ✅ Integración de pagos con GetNet
- ✅ UI/UX moderna con Tailwind CSS
- ✅ Animaciones fluidas con Framer Motion
- ✅ TypeScript para mayor seguridad
- ✅ Responsive design

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Framer Motion** - Animaciones
- **Radix UI** - Componentes accesibles
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de datos
- **Row Level Security (RLS)** - Seguridad a nivel de fila
- **Edge Functions** - Funciones serverless

### Integraciones
- **GetNet** - Pasarela de pagos
- **Resend** - Envío de emails (opcional)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Cuenta de GetNet (para pagos)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio


git clone https://github.com/tu-usuario/casino-escolar.git
cd casino-escolar


### 2. Instalar Dependencias


npm install
# o
yarn install


### 3. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env.local` y completa las variables:


cp .env.example .env.local


Edita `.env.local` con tus credenciales:


# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_de_supabase

# GetNet
GETNET_LOGIN=tu_login_de_getnet
GETNET_SECRET=tu_secreto_de_getnet
GETNET_BASE_URL=https://sandbox.getnet.cl

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000


### 4. Configurar Base de Datos

#### Opción A: Usando Supabase CLI (Recomendado)


# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto
supabase init

# Vincular con tu proyecto
supabase link --project-ref tu-project-ref

# Aplicar migraciones
supabase db push


#### Opción B: Ejecutar SQL Manualmente

1. Ve a tu dashboard de Supabase
2. Abre el SQL Editor
3. Ejecuta los archivos de migración en orden:
   - `supabase/migrations/20250101000000_unified_schema.sql`
   - `supabase/migrations/20250101000001_auth_functions.sql`
   - `supabase/migrations/20250101000002_rls_policies.sql`
   - `supabase/migrations/20250101000003_initial_data.sql`

### 5. Ejecutar en Desarrollo


npm run dev
# o
yarn dev


La aplicación estará disponible en `http://localhost:3000`

## 📊 Estructura de la Base de Datos

### Tablas Principales

#### `users`
- Información básica de usuarios
- Roles y permisos
- Estado de activación

#### `students`
- Datos de estudiantes
- Relación con apoderados
- Información académica

#### `menu_items`
- Elementos del menú diario
- Precios diferenciados
- Disponibilidad y límites

#### `orders`
- Pedidos realizados
- Estados de pago y entrega
- Relación con estudiantes y menús

#### `payment_transactions`
- Transacciones de pago
- Integración con GetNet
- Estados y respuestas del gateway

### Sistema de Roles y Permisos

#### Roles Disponibles
- **user**: Usuario estándar (apoderados)
- **viewer**: Solo lectura
- **moderator**: Gestión básica
- **admin**: Administrador completo
- **super_admin**: Acceso total

#### Módulos de Permisos
- **pedidos**: Gestión de pedidos
- **usuarios**: Administración de usuarios
- **menu**: Gestión de menús
- **estadisticas**: Reportes y análisis
- **configuracion**: Configuración del sistema

## 🎯 Uso del Sistema

### Para Apoderados

1. **Registro**: Crear cuenta con datos personales y estudiantes
2. **Login**: Iniciar sesión con email y contraseña
3. **Selección**: Elegir menús para cada estudiante por semana
4. **Pago**: Procesar pago a través de GetNet
5. **Seguimiento**: Ver estado de pedidos en el dashboard

### Para Administradores

1. **Dashboard**: Vista general de estadísticas
2. **Usuarios**: Gestionar apoderados y estudiantes
3. **Menús**: Administrar opciones de comida
4. **Pedidos**: Supervisar y gestionar pedidos
5. **Reportes**: Generar informes y estadísticas

## 🔧 Configuración Avanzada

### Personalización de Roles

Los roles se pueden personalizar editando la tabla `permissions` y `role_permissions`:


-- Agregar nuevo permiso
INSERT INTO permissions (name, description, module, action) 
VALUES ('reportes.advanced', 'Reportes avanzados', 'reportes', 'read');

-- Asignar permiso a rol
INSERT INTO role_permissions (role_name, permission_id)
SELECT 'admin', id FROM permissions WHERE name = 'reportes.advanced';


### Configuración de Precios

Los precios se pueden configurar en la tabla `system_config`:


UPDATE system_config 
SET value = '{"almuerzo_estudiante": 4000, "almuerzo_funcionario": 5000, "colacion": 2500}'
WHERE key = 'default_prices';


### Integración de Pagos

Para configurar GetNet:

1. Obtén credenciales de GetNet
2. Configura las variables de entorno
3. Ajusta la URL base según el ambiente (sandbox/producción)

## 🚀 Despliegue

### Vercel (Recomendado)


# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel

# Configurar variables de entorno en Vercel dashboard


### Netlify


# Instalar Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Desplegar
netlify deploy --prod --dir=.next


### Docker


FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]


## 🧪 Testing


# Ejecutar tests
npm run test

# Tests con coverage
npm run test:coverage

# Tests e2e
npm run test:e2e


## 📈 Monitoreo y Logs

### Configuración de Logs


// lib/logger.ts
import { createLogger } from 'winston';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  // ... configuración
});


### Métricas

- Pedidos por día/semana/mes
- Ingresos totales
- Usuarios activos
- Tasa de conversión de pagos

## 🔒 Seguridad

### Medidas Implementadas

- ✅ Autenticación JWT con Supabase
- ✅ Row Level Security (RLS)
- ✅ Validación de entrada con Zod
- ✅ Headers de seguridad
- ✅ Sanitización de datos
- ✅ Rate limiting (en producción)

### Buenas Prácticas

- Nunca exponer claves privadas
- Usar HTTPS en producción
- Validar datos en cliente y servidor
- Implementar logs de auditoría
- Realizar backups regulares

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico:
- Email: soporte@casino-escolar.cl
- Issues: [GitHub Issues](https://github.com/tu-usuario/casino-escolar/issues)
- Documentación: [Wiki](https://github.com/tu-usuario/casino-escolar/wiki)

## 🎉 Agradecimientos

- Equipo de desarrollo
- Comunidad de Next.js
- Supabase team
- Contribuidores del proyecto

---

**Desarrollado con ❤️ para la comunidad educativa**