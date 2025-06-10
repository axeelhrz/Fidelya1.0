'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// Iconos para el formulario
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const ContactIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const MapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const InspectorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

// Componente de campo de formulario
interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, icon }) => {
  return (
    <div className="bg-[#2E2E2E] rounded-lg h-16 px-4 flex items-center justify-between hover:bg-[#353535] transition-colors cursor-pointer">
      <span className="text-gray-300 font-medium text-sm">{label}</span>
      <div className="w-8 h-8 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
};

const NuevoProyecto: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const handleContinue = () => {
    // Navegar a la tabla SCAT
    router.push('/tabla-scat');
  };

  return (
    <div className="min-h-screen bg-[#0074D9] flex items-center justify-center p-4">
      {/* Contenedor principal del formulario */}
      <div className="bg-[#3C3C3C] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Botón de regreso */}
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="w-10 h-10 bg-[#2E2E2E] rounded-full flex items-center justify-center hover:bg-[#404040] transition-colors"
          >
            <BackIcon />
          </button>
        </div>

        {/* Header del formulario */}
        <div className="mb-8">
          <div className="bg-[#FFD600] rounded-lg py-3 px-4 mb-2">
            <h1 className="text-black font-bold text-lg text-center tracking-wide">
              DATOS
            </h1>
          </div>
          <h2 className="text-white font-bold text-center text-base">
            ACCIDENTE / INCIDENTE
          </h2>
        </div>

        {/* Campos del formulario */}
        <div className="space-y-4 mb-8">
          <FormField 
            label="Evento" 
            icon={<EditIcon />} 
          />
          <FormField 
            label="Involucrado" 
            icon={<ContactIcon />} 
          />
          <FormField 
            label="Área" 
            icon={<MapIcon />} 
          />
          <FormField 
            label="Fecha y Hora" 
            icon={<CalendarIcon />} 
          />
          <FormField 
            label="Investigador" 
            icon={<InspectorIcon />} 
          />
          <FormField 
            label="Otros datos" 
            icon={<MenuIcon />} 
          />
        </div>

        {/* Botón continuar con flechas */}
        <div className="flex items-center justify-center gap-4">
          <button className="w-10 h-10 bg-[#2E2E2E] rounded-full flex items-center justify-center hover:bg-[#404040] transition-colors">
            <ArrowLeftIcon />
          </button>
          
          <button 
            onClick={handleContinue}
            className="bg-[#FFD600] text-black font-bold py-3 px-8 rounded-lg hover:bg-[#FFC107] transition-colors shadow-lg"
          >
            CONTINUAR
          </button>
          
          <button className="w-10 h-10 bg-[#2E2E2E] rounded-full flex items-center justify-center hover:bg-[#404040] transition-colors">
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevoProyecto;
