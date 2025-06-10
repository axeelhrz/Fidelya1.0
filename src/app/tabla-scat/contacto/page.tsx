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

const CameraIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
    <path d="M12 15.2l3.2-2.7L12 9.8 8.8 12.5 12 15.2zM9 2l-1.83 2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

const ClipIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
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
    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 ${isUnderlined ? 'underline' : ''}`}
    style={{ backgroundColor: bgColor, color: textColor }}
  >
    {text}
  </div>
);

// Componente para cada item de contacto
const ContactItem: React.FC<{
  number: number;
  title: string;
  subtitle: string;
  hasClip?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ number, title, subtitle, hasClip = false, isSelected = false, onClick }) => (
  <div 
    className={`
      flex items-center gap-4 p-5 rounded-xl transition-all duration-300 cursor-pointer
      ${isSelected 
        ? 'bg-[#404040] ring-2 ring-[#FFC107] shadow-xl scale-105' 
        : 'bg-[#2E2E2E] hover:bg-[#353535] hover:scale-102 hover:shadow-lg'
      }
    `}
    onClick={onClick}
  >
    <div className="w-10 h-10 bg-[#1F7ED0] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
      {number}
    </div>
    <div className="flex-1">
      <h3 className="text-white font-semibold text-base">{title}</h3>
      <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
    </div>
    {hasClip && (
      <div className="w-8 h-8 flex items-center justify-center bg-[#404040] rounded-lg">
        <ClipIcon />
      </div>
    )}
  </div>
);

const ContactoSCAT: React.FC = () => {
  const router = useRouter();
  const [selectedContact, setSelectedContact] = useState(2);
  const [comments, setComments] = useState('');

  const handleBack = () => {
    router.push('/tabla-scat');
  };

  const handleNext = () => {
    // Navegar a la primera pantalla de causas inmediatas
    router.push('/tabla-scat/actos');
  };

  const contactItems = [
    {
      number: 1,
      title: "Golpeado contra (choque contra algo)",
      subtitle: "La persona se mueve hacia el objeto",
      hasClip: false
    },
    {
      number: 2,
      title: "Golpeado por (objeto en movimiento)",
      subtitle: "El objeto se mueve hacia la persona",
      hasClip: true
    },
    {
      number: 3,
      title: "Caída a distinto nivel",
      subtitle: "Caída desde altura o desnivel",
      hasClip: false
    },
    {
      number: 4,
      title: "Caída al mismo nivel",
      subtitle: "Tropiezo, resbalón en superficie plana",
      hasClip: false
    },
    {
      number: 5,
      title: "Atrapado en, sobre o entre",
      subtitle: "Compresión o aplastamiento",
      hasClip: true
    },
    {
      number: 6,
      title: "Sobreesfuerzo",
      subtitle: "Esfuerzo físico excesivo",
      hasClip: false
    },
    {
      number: 7,
      title: "Contacto con temperatura extrema",
      subtitle: "Calor o frío excesivo",
      hasClip: false
    },
    {
      number: 8,
      title: "Contacto con electricidad",
      subtitle: "Descarga eléctrica",
      hasClip: true
    },
    {
      number: 9,
      title: "Contacto con sustancia dañina",
      subtitle: "Químicos, radiación, etc.",
      hasClip: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#3C3C3C]">
      {/* Cabecera */}
      <div className="bg-black px-12 py-6 shadow-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-white font-bold text-3xl tracking-wide">TABLA SCAT</h1>
          <h2 className="text-[#FFC107] font-bold text-xl">
            Técnica de Análisis Sistemático de las Causas
          </h2>
        </div>
      </div>

      {/* Etiquetas de cabecera */}
      <div className="px-12 py-6 bg-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            <HeaderTag 
              text="EVALUACIÓN POTENCIAL DE PÉRDIDA SI NO ES CONTROLADO" 
              bgColor="#FFC107" 
            />
            <HeaderTag 
              text="Tipo de Contacto o Causal con Energía o Sustancia" 
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
              text="(NAC) Necesidades de Acción de Control" 
              bgColor="#1F7ED0" 
              textColor="white"
              isUnderlined={true}
            />
          </div>
        </div>
      </div>

      {/* Contenido principal centrado */}
      <div className="flex items-center justify-center min-h-[60vh] px-12 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Lista de contactos */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {contactItems.map((item, index) => (
                  <ContactItem
                    key={index}
                    number={item.number}
                    title={item.title}
                    subtitle={item.subtitle}
                    hasClip={item.hasClip}
                    isSelected={selectedContact === item.number}
                    onClick={() => setSelectedContact(item.number)}
                  />
                ))}
              </div>
            </div>

            {/* Área derecha - Cámara y comentarios */}
            <div className="lg:col-span-1">
              <div className="bg-[#2E2E2E] rounded-xl p-8 h-full shadow-xl">
                <div className="flex flex-col h-full space-y-8">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 bg-[#404040] rounded-xl flex items-center justify-center hover:bg-[#4A4A4A] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                      <CameraIcon />
                    </div>
                    <p className="text-gray-400 text-sm mt-4 text-center">
                      Toca para agregar imagen
                    </p>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-gray-300 text-sm font-semibold mb-4">
                      Comentarios / Adjuntos
                    </label>
                    <textarea 
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full h-40 bg-[#404040] border border-gray-600 rounded-xl p-4 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent transition-all duration-200"
                      placeholder="Agregar comentarios o descripción adicional del incidente..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón flotante inferior mejorado */}
      <div className="fixed bottom-8 right-8">
        <div className="bg-black rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
          <button 
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ArrowLeftIcon />
          </button>
          <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95">
            <MenuIcon />
          </button>
          <button 
            onClick={handleNext}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactoSCAT;