'use client';

import React from 'react';

// Iconos optimizados y más compactos
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
  </svg>
);

const LayersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84z"/>
    <path d="M17.5 13c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
    <path d="M3 13.5h8v8H3z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
);

const FolderPlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-2l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3v2z"/>
  </svg>
);

const TreeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
);

// Componente de botón de sidebar optimizado
const SidebarButton: React.FC<{ children: React.ReactNode; isActive?: boolean }> = ({ 
  children, 
  isActive = false 
}) => (
  <button className={`
    w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200
    ${isActive 
      ? 'bg-gray-700 shadow-lg' 
      : 'hover:bg-gray-800 hover:scale-105'
    }
  `}>
    {children}
  </button>
);

// Componente de tarjeta de proyecto más compacto
interface ProjectCardProps {
  isHighlighted?: boolean;
  projectNumber?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  isHighlighted = false, 
  projectNumber = 1 
}) => {
  return (
    <div className={`
      w-full h-20 rounded-lg p-3 flex items-center justify-between transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
      ${isHighlighted ? 'bg-[#FFD600] shadow-md' : 'bg-[#2E2E2E] hover:bg-[#353535]'}
    `}>
      <div className="flex flex-col">
        <span className={`
          font-bold text-xs tracking-wider
          ${isHighlighted ? 'text-black' : 'text-white'}
        `}>
          PROYECTO CREADO
        </span>
        <span className={`
          text-xs opacity-70 mt-1
          ${isHighlighted ? 'text-black' : 'text-gray-400'}
        `}>
          #{projectNumber.toString().padStart(3, '0')}
        </span>
      </div>
      <div className="flex gap-1">
        <button className="w-7 h-7 bg-black rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
          <TreeIcon />
        </button>
        <button className="w-7 h-7 bg-black rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
          <EditIcon />
        </button>
        <button className="w-7 h-7 bg-black rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
          <ImageIcon />
        </button>
      </div>
    </div>
  );
};

// Componente principal del dashboard optimizado
const Dashboard: React.FC = () => {
  return (
    <div className="h-screen bg-[#3C3C3C] flex overflow-hidden">
      {/* Sidebar más compacto */}
      <div className="w-20 bg-black flex flex-col items-center py-6 gap-4 shadow-xl">
        <SidebarButton isActive={true}>
          <HomeIcon />
        </SidebarButton>
        <SidebarButton>
          <ChartIcon />
        </SidebarButton>
        <SidebarButton>
          <LayersIcon />
        </SidebarButton>
        <SidebarButton>
          <CalendarIcon />
        </SidebarButton>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header más compacto */}
        <div className="bg-[#2F766F] h-16 flex items-center justify-between px-6 shadow-lg">
          <h1 className="text-[#FFC107] font-bold text-lg tracking-wide">
            Técnica de Análisis Sistemático de las Causas
          </h1>
          <div className="flex gap-2">
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:scale-110 transition-all">
              <DeleteIcon />
            </button>
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:scale-110 transition-all">
              <InfoIcon />
            </button>
          </div>
        </div>

        {/* Área de contenido optimizada */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Botón de crear proyecto más compacto */}
          <div className="mb-6">
            <button className="
              bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black font-bold 
              py-2 px-4 rounded-lg flex items-center gap-2 
              hover:from-[#FFB300] hover:to-[#FFA000] hover:scale-105 
              transition-all duration-200 shadow-md hover:shadow-lg
            ">
              <FolderPlusIcon />
              <span className="text-sm">Create New Proyect</span>
            </button>
          </div>

          {/* Grid de proyectos más compacto y organizado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }, (_, index) => (
              <ProjectCard 
                key={index}
                isHighlighted={index === 0}
                projectNumber={index + 1}
              />
            ))}
          </div>

          {/* Estadísticas rápidas */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#2E2E2E] rounded-lg p-3 text-center">
              <div className="text-[#FFC107] font-bold text-lg">12</div>
              <div className="text-gray-400 text-xs">Total Proyectos</div>
            </div>
            <div className="bg-[#2E2E2E] rounded-lg p-3 text-center">
              <div className="text-[#4CAF50] font-bold text-lg">8</div>
              <div className="text-gray-400 text-xs">Activos</div>
            </div>
            <div className="bg-[#2E2E2E] rounded-lg p-3 text-center">
              <div className="text-[#FF9800] font-bold text-lg">3</div>
              <div className="text-gray-400 text-xs">En Progreso</div>
            </div>
            <div className="bg-[#2E2E2E] rounded-lg p-3 text-center">
              <div className="text-[#F44336] font-bold text-lg">1</div>
              <div className="text-gray-400 text-xs">Pendientes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
