# Casino Escolar

Sistema de gestión de pedidos de casino escolar desarrollado con Next.js, Firebase y TypeScript.

## 🚀 Características

### Para Usuarios (Apoderados)
- ✅ Registro y autenticación segura
- ✅ Gestión de múltiples estudiantes
- ✅ Selección de menús semanales
- ✅ Proceso de pago integrado (GetNet)
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
- ✅ Base de datos Firebase Firestore
- ✅ Autenticación y autorización robusta
- ✅ Sistema avanzado de roles y permisos
- ✅ Integración de pagos GetNet
- ✅ UI/UX con Tailwind CSS
- ✅ Animaciones con Framer Motion
- ✅ TypeScript para seguridad de tipos
- ✅ Diseño responsivo

## 🛠️ Tecnologías

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **Radix UI** - Componentes base
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas

### Backend
- **Firebase** - Backend as a Service
- **Firestore** - Base de datos NoSQL
- **Firebase Auth** - Autenticación
- **Cloud Functions** - Funciones serverless

### Integraciones
- **GetNet** - Pasarela de pagos

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Proyecto de Firebase
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


### 4. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication y Firestore
3. Obtén las credenciales de configuración
4. Actualiza las variables de entorno en `.env.local`

### 5. Ejecutar en Desarrollo


npm run dev
# o
yarn dev


La aplicación estará disponible en `http://localhost:3000`

## 📊 Estructura del Proyecto


src/
├── app/                 # App Router de Next.js
├── components/          # Componentes reutilizables
├── context/            # Contextos de React
├── hooks/              # Hooks personalizados
├── lib/                # Utilidades y configuraciones
├── types/              # Definiciones de tipos
└── styles/             # Estilos globales


## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en producción
- `npm run lint` - Ejecutar linter

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Netlify

1. Conecta tu repositorio con Netlify
2. Configura las variables de entorno
3. Usa el comando de build: `npm run build`

## 🔒 Seguridad

### Medidas Implementadas

- ✅ Autenticación con Firebase Auth
- ✅ Reglas de seguridad de Firestore
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

---

**Desarrollado con ❤️ para la comunidad educativa**