'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Iconos para la navegación
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
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

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
    <path d="M12 15.2l3.2-2.7L12 9.8 8.8 12.5 12 15.2zM9 2l-1.83 2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

// Componente para las etiquetas de cabecera
const HeaderTag: React.FC<{ 
  text: string; 
  bgColor: string; 
  textColor?: string;
  isUnderlined?: boolean;
}> = ({ text, bgColor, textColor = 'black', isUnderlined = false }) => (
  <div 
    className={`
      flex-1 min-w-0 h-16 px-4 py-3 rounded-lg text-center font-bold text-sm 
      transition-all duration-200 hover:scale-105 shadow-lg
      flex items-center justify-center
      ${isUnderlined ? 'underline' : ''}
    `}
    style={{ backgroundColor: bgColor, color: textColor }}
  >
    <span className="leading-tight">{text}</span>
  </div>
);

// Componente para cada item de contacto
const ContactItem: React.FC<{
  number: number;
  title: string;
  subtitle: string;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ number, title, subtitle, isSelected = false, onClick }) => (
  <div 
    className={`
      flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer
      ${isSelected 
        ? 'bg-[#404040] ring-2 ring-[#FFC107] shadow-xl' 
        : 'bg-[#2E2E2E] hover:bg-[#353535] hover:shadow-lg'
      }
    `}
    onClick={onClick}
  >
    <div className="w-8 h-8 bg-[#1F7ED0] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
      {number}
    </div>
    <div className="flex-1">
      <h3 className="text-white font-medium text-sm leading-tight">{title}</h3>
      <p className="text-gray-400 text-xs mt-1 leading-tight">{subtitle}</p>
    </div>
  </div>
);

const ContactoSCAT: React.FC = () => {
  const router = useRouter();
  const [selectedContact, setSelectedContact] = useState(2);

  const handleBack = () => {
    router.push('/tabla-scat');
  };

  const handleNext = () => {
    router.push('/tabla-scat/actos');
  };

  const contactItems = [
    {
      number: 1,
      title: "Golpeado Centro (choque contra algo)",
      subtitle: ""
    },
    {
      number: 2,
      title: "Golpeado por (Impacto por objeto en movimiento)",
      subtitle: ""
    },
    {
      number: 3,
      title: "Caída a distinto nivel",
      subtitle: ""
    },
    {
      number: 4,
      title: "Caída al mismo nivel (Resbalón y caída/tropiezo)",
      subtitle: ""
    },
    {
      number: 5,
      title: "Atrapado en, sobre o entre",
      subtitle: ""
    },
    {
      number: 6,
      title: "Cogido (Enganchado, Colgado)",
      subtitle: ""
    },
    {
      number: 7,
      title: "Absorción, inhalación e ingestión (Exposición, Intoxicación)",
      subtitle: ""
    },
    {
      number: 8,
      title: "Contacto con Electricidad, Calor, con Frío, con Radiación, con Cáusticos y Corrosivos",
      subtitle: ""
    },
    {
      number: 9,
      title: "Sobreesfuerzo por (Impacto por objeto en movimiento)",
      subtitle: ""
    }
  ];

  return (
    <div className="min-h-screen bg-[#3C3C3C]">
      {/* Cabecera */}
      <div className="bg-black px-8 py-4 shadow-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-white font-bold text-2xl tracking-wide">TABLA SCAT</h1>
          <h2 className="text-[#FFC107] font-bold text-lg">
            Técnica de Análisis Sistemático de las Causas
          </h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:scale-110 transition-all duration-200">
              <InfoIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Etiquetas de cabecera */}
      <div className="px-8 py-6 bg-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4">
            <HeaderTag 
              text="EVALUACIÓN POTENCIAL DE PÉRDIDA SI NO ES CONTROLADO" 
              bgColor="#FFC107" 
            />
            <HeaderTag 
              text="Tipo de Contacto o Causal Corriente con Energía o Sustancia" 
              bgColor="#FFC107" 
            />
            <HeaderTag 
              text="(CI) Causas Inmediatas o Directas" 
              bgColor="#4A4A4A" 
              textColor="white"
            />
            <HeaderTag 
              text="(CB) Causas Básicas / Subyacentes" 
              bgColor="#4A4A4A" 
              textColor="white"
            />
            <HeaderTag 
              text="(NAC) Necesidades de Acción de Control (NAC) Falta de Control" 
              bgColor="#4A4A4A" 
              textColor="white"
            />
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Lista de contactos - 2 columnas */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-3">
                {contactItems.map((item, index) => (
                  <ContactItem
                    key={index}
                    number={item.number}
                    title={item.title}
                    subtitle={item.subtitle}
                    isSelected={selectedContact === item.number}
                    onClick={() => setSelectedContact(item.number)}
                  />
                ))}
              </div>
            </div>

            {/* Área derecha - Iconos y comentarios */}
            <div className="lg:col-span-2">
              <div className="bg-[#2E2E2E] rounded-xl p-6 h-full shadow-xl">
                <div className="flex flex-col h-full space-y-6">
                  {/* Iconos superiores */}
                  <div className="flex justify-center gap-4">
                    <div className="w-16 h-16 bg-[#404040] rounded-lg flex items-center justify-center hover:bg-[#4A4A4A] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                      <CameraIcon />
                    </div>
                    <div className="w-16 h-16 bg-[#404040] rounded-lg flex items-center justify-center hover:bg-[#4A4A4A] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                      <SearchIcon />
                    </div>
                    <div className="w-16 h-16 bg-[#404040] rounded-lg flex items-center justify-center hover:bg-[#4A4A4A] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                      <EditIcon />
                    </div>
                  </div>
                  
                  {/* Área de comentarios */}
                  <div className="flex-1">
                    <label className="block text-gray-300 text-sm font-semibold mb-3">
                      Comentarios
                    </label>
                    <textarea 
                      className="w-full h-48 bg-[#404040] border border-gray-600 rounded-xl p-4 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200"
                      placeholder="Agregar comentarios..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación inferior */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-black rounded-2xl p-3 flex items-center gap-3 shadow-2xl">
          <button 
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ArrowLeftIcon />
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95">
            <MenuIcon />
          </button>
          <button 
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactoSCAT;