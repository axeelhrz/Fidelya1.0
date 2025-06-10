'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Iconos optimizados con tamaños exactos
const HomeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
  </svg>
);

const LayersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84z"/>
    <path d="M17.5 13c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
    <path d="M3 13.5h8v8H3z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
);

const FolderPlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-2l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3v2z"/>
  </svg>
);

const TreeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
);

// Componente de botón de sidebar
const SidebarButton: React.FC<{ 
  children: React.ReactNode; 
  isActive?: boolean;
  onClick?: () => void;
}> = ({ children, isActive = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300
      ${isActive 
        ? 'bg-gray-700 shadow-xl' 
        : 'hover:bg-gray-800 hover:scale-110 active:scale-95'
      }
    `}
  >
    {children}
  </button>
);

// Componente de tarjeta de proyecto
interface ProjectCardProps {
  isHighlighted?: boolean;
  projectNumber?: number;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  isHighlighted = false, 
  onClick
}) => {
  return (
    <div 
      className={`
        w-full h-24 rounded-xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer
        ${isHighlighted 
          ? 'bg-[#FFD600] shadow-xl' 
          : 'bg-[#2E2E2E] hover:bg-[#353535] hover:scale-105 hover:shadow-lg'
        }
      `}
      onClick={onClick}
    >
      <div className="flex flex-col">
        <span className={`
          font-bold text-sm tracking-wider uppercase
          ${isHighlighted ? 'text-black' : 'text-white'}
        `}>
          PROYECTO
        </span>
        <span className={`
          font-bold text-sm tracking-wider uppercase
          ${isHighlighted ? 'text-black' : 'text-white'}
        `}>
          CREADO
        </span>
      </div>
      <div className="flex gap-2">
        <button 
          className="w-8 h-8 bg-black rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
          onClick={(e) => e.stopPropagation()}
        >
          <TreeIcon />
        </button>
        <button 
          className="w-8 h-8 bg-black rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
          onClick={(e) => e.stopPropagation()}
        >
          <EditIcon />
        </button>
        <button 
          className="w-8 h-8 bg-black rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
          onClick={(e) => e.stopPropagation()}
        >
          <ImageIcon />
        </button>
      </div>
    </div>
  );
};

// Componente principal del dashboard
const Dashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const handleCreateProject = () => {
    router.push('/nuevo-proyecto');
  };

  const handleProjectClick = (projectNumber: number) => {
    console.log(`Abriendo proyecto ${projectNumber}`);
    // Aquí puedes agregar lógica para abrir un proyecto específico
  };

  return (
    <div className="h-screen bg-[#3C3C3C] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-24 bg-black flex flex-col items-center py-8 gap-6 shadow-2xl">
        <SidebarButton 
          isActive={activeTab === 0}
          onClick={() => setActiveTab(0)}
        >
          <HomeIcon />
        </SidebarButton>
        <SidebarButton 
          isActive={activeTab === 1}
          onClick={() => setActiveTab(1)}
        >
          <ChartIcon />
        </SidebarButton>
        <SidebarButton 
          isActive={activeTab === 2}
          onClick={() => setActiveTab(2)}
        >
          <LayersIcon />
        </SidebarButton>
        <SidebarButton 
          isActive={activeTab === 3}
          onClick={() => setActiveTab(3)}
        >
          <CalendarIcon />
        </SidebarButton>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#2F766F] h-20 flex items-center justify-between px-12 shadow-xl">
          <h1 className="text-[#FFC107] font-bold text-xl tracking-wide">
            Técnica de Análisis Sistemático de las Causas
          </h1>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:scale-110 transition-all duration-200 shadow-lg">
              <DeleteIcon />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:scale-110 transition-all duration-200 shadow-lg">
              <FolderIcon />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:scale-110 transition-all duration-200 shadow-lg">
              <InfoIcon />
            </button>
          </div>
        </div>

        {/* Área de contenido centrada y con mejor espaciado */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-7xl mx-auto">
            {/* Botón de crear proyecto centrado */}
            <div className="flex justify-center mb-12">
              <button 
                onClick={handleCreateProject}
                className="
                  bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black font-bold 
                  py-3 px-8 rounded-xl flex items-center gap-3 
                  hover:from-[#FFB300] hover:to-[#FFA000] hover:scale-105 
                  transition-all duration-300 shadow-xl hover:shadow-2xl
                  active:scale-95
                "
              >
                <FolderPlusIcon />
                <span className="text-base">Create New Proyect</span>
              </button>
            </div>

            {/* Grid de proyectos centrado con mejor espaciado */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-12">
              {Array.from({ length: 12 }, (_, index) => (
                <ProjectCard 
                  key={index}
                  isHighlighted={index === 0}
                  projectNumber={index + 1}
                  onClick={() => handleProjectClick(index + 1)}
                />
              ))}
            </div>

            {/* Estadísticas centradas */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl">
                <div className="bg-[#2E2E2E] rounded-xl p-6 text-center hover:bg-[#353535] transition-all duration-300 hover:scale-105 shadow-lg min-w-[140px]">
                  <div className="text-[#FFC107] font-bold text-2xl mb-2">12</div>
                  <div className="text-gray-400 text-sm font-medium">Total Proyectos</div>
                </div>
                <div className="bg-[#2E2E2E] rounded-xl p-6 text-center hover:bg-[#353535] transition-all duration-300 hover:scale-105 shadow-lg min-w-[140px]">
                  <div className="text-[#4CAF50] font-bold text-2xl mb-2">8</div>
                  <div className="text-gray-400 text-sm font-medium">Activos</div>
                </div>
                <div className="bg-[#2E2E2E] rounded-xl p-6 text-center hover:bg-[#353535] transition-all duration-300 hover:scale-105 shadow-lg min-w-[140px]">
                  <div className="text-[#FF9800] font-bold text-2xl mb-2">3</div>
                  <div className="text-gray-400 text-sm font-medium">En Progreso</div>
                </div>
                <div className="bg-[#2E2E2E] rounded-xl p-6 text-center hover:bg-[#353535] transition-all duration-300 hover:scale-105 shadow-lg min-w-[140px]">
                  <div className="text-[#F44336] font-bold text-2xl mb-2">1</div>
                  <div className="text-gray-400 text-sm font-medium">Pendientes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;