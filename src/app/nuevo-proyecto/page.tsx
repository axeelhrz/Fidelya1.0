'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Iconos para el formulario
const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const ContactIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const InspectorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

const BackIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

// Componente de campo de formulario mejorado
interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const FormField: React.FC<FormFieldProps> = ({ label, icon, isActive = false, onClick }) => {
  return (
    <div 
      className={`
        rounded-xl h-18 px-5 flex items-center justify-between transition-all duration-300 cursor-pointer
        ${isActive 
          ? 'bg-[#353535] ring-2 ring-[#FFC107] shadow-lg scale-105' 
          : 'bg-[#2E2E2E] hover:bg-[#353535] hover:scale-102 hover:shadow-md'
        }
      `}
      onClick={onClick}
    >
      <span className="text-gray-300 font-semibold text-base">{label}</span>
      <div className="w-10 h-10 flex items-center justify-center bg-[#404040] rounded-lg">
        {icon}
      </div>
    </div>
  );
};

const NuevoProyecto: React.FC = () => {
  const router = useRouter();
  const [activeField, setActiveField] = useState<number | null>(null);

  const handleBack = () => {
    router.push('/');
  };

  const handleContinue = () => {
    router.push('/tabla-scat');
  };

  const formFields = [
    { label: "Evento", icon: <EditIcon /> },
    { label: "Involucrado", icon: <ContactIcon /> },
    { label: "Área", icon: <MapIcon /> },
    { label: "Fecha y Hora", icon: <CalendarIcon /> },
    { label: "Investigador", icon: <InspectorIcon /> },
    { label: "Otros datos", icon: <MenuIcon /> }
  ];

  return (
    <div className="min-h-screen bg-[#0074D9] flex items-center justify-center p-6">
      {/* Contenedor principal del formulario */}
      <div className="bg-[#3C3C3C] rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        {/* Botón de regreso */}
        <div className="mb-8">
          <button 
            onClick={handleBack}
            className="w-12 h-12 bg-[#2E2E2E] rounded-full flex items-center justify-center hover:bg-[#404040] transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
          >
            <BackIcon />
          </button>
        </div>

        {/* Header del formulario */}
        <div className="mb-10">
          <div className="bg-[#FFD600] rounded-xl py-4 px-6 mb-3 shadow-lg">
            <h1 className="text-black font-bold text-xl text-center tracking-wide">
              DATOS
            </h1>
          </div>
          <h2 className="text-white font-bold text-center text-lg">
            ACCIDENTE / INCIDENTE
          </h2>
        </div>

        {/* Campos del formulario */}
        <div className="space-y-5 mb-10">
          {formFields.map((field, index) => (
            <FormField
              key={index}
              label={field.label}
              icon={field.icon}
              isActive={activeField === index}
              onClick={() => setActiveField(activeField === index ? null : index)}
            />
          ))}
        </div>

        {/* Botón continuar con flechas */}
        <div className="flex items-center justify-center gap-6">
          <button className="w-12 h-12 bg-[#2E2E2E] rounded-full flex items-center justify-center hover:bg-[#404040] transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg">
            <ArrowLeftIcon />
          </button>
          
          <button 
            onClick={handleContinue}
            className="bg-[#FFD600] text-black font-bold py-4 px-10 rounded-xl hover:bg-[#FFC107] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
          >
            CONTINUAR
          </button>
          
          <button className="w-12 h-12 bg-[#2E2E2E] rounded-full flex items-center justify-center hover:bg-[#404040] transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg">
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevoProyecto;
