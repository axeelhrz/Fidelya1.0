# Guía de Desarrollo

## Configuración del Entorno

### Requisitos Previos
- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase
- Claves de API (OpenAI, WhatsApp)

### Instalación

# Clonar el repositorio
git clone <repository-url>
cd centro-psicologico

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus claves


### Estructura del Proyecto

src/
├── app/                 # App Router de Next.js
├── components/          # Componentes React
│   ├── ui/             # Componentes base
│   ├── layout/         # Componentes de layout
│   ├── dashboard/      # Módulo dashboard
│   ├── patients/       # Módulo pacientes
│   ├── sessions/       # Módulo sesiones
│   ├── alerts/         # Módulo alertas
│   ├── metrics/        # Módulo métricas
│   └── settings/       # Módulo configuración
├── context/            # Contextos de React
├── hooks/              # Hooks personalizados
├── lib/                # Utilidades y configuración
├── services/           # Servicios de API
├── types/              # Definiciones de TypeScript
└── constants/          # Constantes del sistema


## Convenciones de Código

### Nomenclatura
- Componentes: PascalCase (`PatientCard.tsx`)
- Hooks: camelCase con prefijo `use` (`usePatients.ts`)
- Tipos: PascalCase (`Patient`, `Session`)
- Constantes: UPPER_SNAKE_CASE (`MAX_PATIENTS`)

### Estructura de Componentes

// Imports
import React from 'react';
import { Component } from '@mui/material';

// Types
interface Props {
  // ...
}

// Component
export function ComponentName({ prop }: Props) {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
  return (
    // JSX
  );
}


### Manejo de Estado
- Context API para estado global
- useState para estado local
- Custom hooks para lógica reutilizable

## Próximas Fases

### Fase 2: Autenticación y Layout
- Implementar formularios de login/registro
- Crear layout principal con navegación
- Configurar protección de rutas

### Fase 3: Módulos Core
- Dashboard con métricas básicas
- CRUD de pacientes
- Sistema de sesiones

### Fase 4: Funcionalidades Avanzadas
- Integración con IA
- Sistema de alertas
- Métricas avanzadas

