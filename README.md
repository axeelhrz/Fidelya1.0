# Plataforma de Pedidos de Almuerzo

Una aplicación moderna y profesional para gestionar pedidos de almuerzo, construida con Next.js, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- **Autenticación segura** con Supabase Auth
- **Interfaz moderna** con componentes UI personalizados
- **Gestión de turnos** (Día/Noche)
- **Calendario interactivo** para seleccionar fechas
- **CRUD completo** de pedidos
- **Dashboard con estadísticas** en tiempo real
- **Responsive design** para todos los dispositivos
- **Protección de rutas** con middleware

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Iconos**: Lucide React
- **Deployment**: Vercel (recomendado)

## 📋 Requisitos previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🔧 Instalación

1. **Clonar el repositorio**

git clone <repository-url>
cd rediseno-frontend


2. **Instalar dependencias**

npm install


3. **Configurar variables de entorno**
Crear archivo `.env.local` en la raíz del proyecto:

NEXT_PUBLIC_SUPABASE_URL=https://ralzixlkpygaxiquubdm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbHppeGxrcHlnYXhpcXV1YmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTY3MDIsImV4cCI6MjA2NTI3MjcwMn0.XkK6cD_PE-oQy61p1Bn2D7w4y8T9us2VHDHW3tr5kLc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbHppeGxrcHlnYXhpcXV1YmRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY5NjcwMiwiZXhwIjoyMDY1MjcyNzAyfQ.1bRGprytUNmSSMVxjLHFV4qE_sOK2Hmclbv6kpge2L0


4. **Configurar base de datos en Supabase**
Ejecutar el script SQL en el editor SQL de Supabase:

-- Copiar y ejecutar el contenido de supabase-setup.sql


5. **Ejecutar en desarrollo**

npm run dev


La aplicación estará disponible en `http://localhost:3000`

## 🗄️ Estructura de la base de datos

### Tablas principales:

- **profiles**: Perfiles de usuario
- **shifts**: Turnos disponibles (Día/Noche)
- **orders**: Pedidos de almuerzo

### Características de seguridad:

- **Row Level Security (RLS)** habilitado
- **Políticas de acceso** por usuario
- **Triggers automáticos** para timestamps
- **Función de registro** automático de perfiles

## 🎨 Componentes principales

### Autenticación
- `LoginForm`: Formulario de inicio de sesión moderno
- `AuthProvider`: Context para manejo de estado de autenticación

### Dashboard
- `Header`: Navegación principal con menú de usuario
- `Calendar`: Calendario interactivo para gestión de pedidos
- `ShiftSelector`: Modal para selección de turnos
- `OrderModal`: Modal para crear/editar pedidos

### UI Components
- `Button`: Botón con variantes y estados
- `Input`: Campo de entrada estilizado
- `Card`: Contenedor de contenido con sombras

## 🚀 Funcionalidades

### Para usuarios:
- ✅ Iniciar sesión con email/contraseña
- ✅ Seleccionar turno de trabajo
- ✅ Ver calendario mensual de pedidos
- ✅ Crear pedidos para fechas futuras
- ✅ Editar pedidos existentes
- ✅ Eliminar pedidos
- ✅ Ver estadísticas de pedidos
- ✅ Cerrar sesión

### Estados de pedidos:
- **Pendiente**: Pedido creado, esperando confirmación
- **Confirmado**: Pedido confirmado por administrador
- **Entregado**: Pedido entregado al usuario
- **Cancelado**: Pedido cancelado

## 🎯 Próximas mejoras

- [ ] Panel de administración
- [ ] Notificaciones push
- [ ] Reportes y analytics
- [ ] Integración con pagos
- [ ] App móvil con React Native
- [ ] Sistema de calificaciones
- [ ] Chat en tiempo real

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Equipo

- **Desarrollador Principal**: Tu nombre
- **Diseño UI/UX**: Tu nombre
- **Backend**: Supabase

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@tuempresa.com
- Issues: [GitHub Issues](link-to-issues)

---

**¡Disfruta gestionando tus pedidos de almuerzo! 🍽️**