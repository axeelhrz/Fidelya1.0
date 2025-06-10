'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// SVG Icons
const HomeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const ChartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
  </svg>
);

const LayersIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84z"/>
    <path d="M17.5 13c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
    <path d="M3 13.5h8v8H3z"/>
  </svg>
);

const CalendarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const SettingsIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

const NotificationIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

// Action Icons
const DeleteIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const EditIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const DownloadIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);

const AnalyticsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
  </svg>
);

// Sidebar Button Component
interface SidebarButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  label: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ 
  children, 
  isActive = false, 
  onClick, 
  label 
}) => (
  <div className="relative group">
    <button 
      onClick={onClick}
      className={`
        relative w-14 h-14 rounded-xl flex items-center justify-center 
        transition-all duration-300 group
        ${isActive 
          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-500/25' 
          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white hover:scale-110'
        }
        focus-ring
      `}
    >
      {children}
      {isActive && (
        <div className="absolute -right-1 -top-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      )}
    </button>
    
    {/* Tooltip */}
    <div className="absolute left-full ml-4 px-3 py-2 bg-black/90 text-white text-sm rounded-lg 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                    whitespace-nowrap backdrop-blur-sm border border-white/10">
      {label}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/90" />
    </div>
  </div>
);

// Project Card Component
interface ProjectCardProps {
  isHighlighted?: boolean;
  onClick?: () => void;
  title?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  onDownload?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  isHighlighted = false, 
  onClick,
  title = "PROYECTO",
  onDelete,
  onEdit,
  onDownload
}) => {
  return (
    <div 
      className={`
        group relative p-4 h-20 rounded-lg cursor-pointer transition-all duration-300
        ${isHighlighted 
          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black shadow-xl shadow-yellow-500/25' 
          : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-white'
        }
        animate-fadeInUp
      `}
      onClick={onClick}
    >
      {/* Content */}
      <div className="flex items-center h-full">
        <div className="flex-1 pr-4">
          <h3 className={`font-bold text-sm ${isHighlighted ? 'text-black' : 'text-white'}`}>
            {title}
          </h3>
          <p className={`text-xs ${isHighlighted ? 'text-black/70' : 'text-white/60'}`}>
            CREADO
          </p>
        </div>
        
        {/* Action Buttons - Positioned more to the right but not at the extreme */}
        <div className="flex gap-1 ml-auto mr-2">
          <button 
            className={`
              w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200
              ${isHighlighted 
                ? 'bg-black/20 hover:bg-black/30 text-black' 
                : 'bg-white/10 hover:bg-white/20 text-white'
              }
              hover:scale-110 focus-ring
            `}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Análisis clicked');
            }}
            title="Análisis"
          >
            <AnalyticsIcon />
          </button>
          
          <button 
            className={`
              w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200
              ${isHighlighted 
                ? 'bg-black/20 hover:bg-black/30 text-black' 
                : 'bg-white/10 hover:bg-white/20 text-white'
              }
              hover:scale-110 focus-ring
            `}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            title="Editar"
          >
            <EditIcon />
          </button>
          
          <button 
            className={`
              w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200
              ${isHighlighted 
                ? 'bg-black/20 hover:bg-black/30 text-black' 
                : 'bg-white/10 hover:bg-white/20 text-white'
              }
              hover:scale-110 focus-ring
            `}
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.();
            }}
            title="Descargar PDF"
          >
            <DownloadIcon />
          </button>
        </div>
      </div>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleCreateProject = () => {
    router.push('/nuevo-proyecto');
  };

  const handleProjectClick = (projectNumber: number) => {
    console.log(`Abriendo proyecto ${projectNumber}`);
    router.push('/tabla-scat');
  };

  const handleDeleteProject = (projectIndex: number) => {
    console.log(`Eliminando proyecto ${projectIndex + 1}`);
    alert(`Eliminando proyecto ${projectIndex + 1}`);
  };

  const handleEditProject = (projectIndex: number) => {
    console.log(`Editando proyecto ${projectIndex + 1}`);
    router.push(`/nuevo-proyecto?edit=${projectIndex + 1}`);
  };

  const handleDownloadPDF = (projectIndex: number) => {
    console.log(`Descargando PDF del proyecto ${projectIndex + 1}`);
    alert(`Descargando PDF del proyecto ${projectIndex + 1}`);
  };

  const sidebarItems = [
    { icon: <HomeIcon />, label: 'Dashboard', active: true },
    { icon: <ChartIcon />, label: 'Análisis' },
    { icon: <LayersIcon />, label: 'Proyectos' },
    { icon: <CalendarIcon />, label: 'Calendario' }
  ];

  const projects = [
    { title: "PROYECTO CREADO", isHighlighted: true },
    { title: "PROYECTO CREADO" },
    { title: "PROYECTO CREADO" },
    { title: "PROYECTO CREADO" },
    { title: "PROYECTO CREADO" },
    { title: "PROYECTO CREADO" },
    { title: "PROYECTO CREADO" },
    { title: "PROYECTO CREADO" },
    { title: "PROYECTO CREADO" }
  ];

  if (!isLoaded) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-20 bg-black/50 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-8 gap-6">
        {/* Logo */}
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-8">
          <span className="text-black font-bold text-xl">S</span>
        </div>
        
        {/* Navigation */}
        {sidebarItems.map((item, index) => (
          <SidebarButton 
            key={index}
            isActive={activeTab === index}
            onClick={() => setActiveTab(index)}
            label={item.label}
          >
            {item.icon}
          </SidebarButton>
        ))}
        
        {/* Settings */}
        <div className="mt-auto">
          <SidebarButton label="Configuración">
            <SettingsIcon />
          </SidebarButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Técnica de Análisis Sistemático de las Causas
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Delete Icon */}
            <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-all duration-200">
              <DeleteIcon className="w-5 h-5" />
            </button>
            
            {/* Notification Icon */}
            <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-all duration-200">
              <NotificationIcon />
            </button>
            
            {/* Profile */}
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">U</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Create Project Button */}
            <div className="flex justify-center">
              <button 
                onClick={handleCreateProject}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-8 py-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <PlusIcon />
                Create New proyecto
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={index}
                  isHighlighted={project.isHighlighted}
                  onClick={() => handleProjectClick(index + 1)}
                  onDelete={() => handleDeleteProject(index)}
                  onEdit={() => handleEditProject(index)}
                  onDownload={() => handleDownloadPDF(index)}
                  title={project.title}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;