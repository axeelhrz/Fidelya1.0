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

const PlusIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const MenuIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

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

// Sidebar Button Component
interface SidebarButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ 
  children, 
  isActive = false, 
  onClick
}) => (
  <button 
    onClick={onClick}
    className={`
      w-12 h-12 rounded-xl flex items-center justify-center 
      transition-all duration-200
      ${isActive 
        ? 'bg-yellow-500 text-black' 
        : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }
    `}
  >
    {children}
  </button>
);

// Project Card Component
interface ProjectCardProps {
  isHighlighted?: boolean;
  onClick?: () => void;
  projectNumber: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  isHighlighted = false, 
  onClick,
  projectNumber
}) => {
  return (
    <div 
      className={`
        relative p-4 rounded-lg cursor-pointer transition-all duration-200
        ${isHighlighted 
          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black' 
          : 'bg-gray-700 hover:bg-gray-600 text-white'
        }
        h-24 flex flex-col justify-between
      `}
      onClick={onClick}
    >
      {/* Content */}
      <div className="flex-1">
        <div className={`text-xs font-medium mb-1 ${isHighlighted ? 'text-black/70' : 'text-gray-400'}`}>
          PROYECTO
        </div>
        <div className={`text-sm font-semibold ${isHighlighted ? 'text-black' : 'text-white'}`}>
          CREADO
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 mt-3">
        <button 
          className={`
            w-6 h-6 rounded flex items-center justify-center transition-all duration-200
            ${isHighlighted 
              ? 'bg-black/20 hover:bg-black/30 text-black' 
              : 'bg-white/10 hover:bg-white/20 text-white'
            }
          `}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Check clicked');
          }}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </button>
        
        <button 
          className={`
            w-6 h-6 rounded flex items-center justify-center transition-all duration-200
            ${isHighlighted 
              ? 'bg-black/20 hover:bg-black/30 text-black' 
              : 'bg-white/10 hover:bg-white/20 text-white'
            }
          `}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Edit clicked');
          }}
        >
          <EditIcon className="w-3 h-3" />
        </button>
        
        <button 
          className={`
            w-6 h-6 rounded flex items-center justify-center transition-all duration-200
            ${isHighlighted 
              ? 'bg-black/20 hover:bg-black/30 text-black' 
              : 'bg-white/10 hover:bg-white/20 text-white'
            }
          `}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Download clicked');
          }}
        >
          <DownloadIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const handleCreateProject = () => {
    router.push('/nuevo-proyecto');
  };

  const handleProjectClick = (projectNumber: number) => {
    console.log(`Abriendo proyecto ${projectNumber}`);
    router.push('/tabla-scat');
  };

  const sidebarItems = [
    { icon: <HomeIcon />, active: true },
    { icon: <ChartIcon /> },
    { icon: <LayersIcon /> },
    { icon: <CalendarIcon /> }
  ];

  // Create exactly 9 projects as shown in the image
  const projects = Array.from({ length: 9 }, (_, index) => ({
    projectNumber: index + 1,
    isHighlighted: index === 0 // Only first project is highlighted
  }));

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
        {/* Navigation */}
        {sidebarItems.map((item, index) => (
          <SidebarButton 
            key={index}
            isActive={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            {item.icon}
          </SidebarButton>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-teal-600 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Técnica de Análisis Sistemático de las Causas
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Header Icons */}
            <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-white transition-all duration-200">
              <MenuIcon className="w-4 h-4" />
            </button>
            
            <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-white transition-all duration-200">
              <DeleteIcon className="w-4 h-4" />
            </button>
            
            {/* Info button */}
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
              i
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Create Project Button */}
            <div className="flex justify-center">
              <button 
                onClick={handleCreateProject}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 flex items-center gap-2"
              >
                <PlusIcon />
                Create New proyecto
              </button>
            </div>

            {/* Projects Grid - Exactly 3x3 as shown in image */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.projectNumber}
                  isHighlighted={project.isHighlighted}
                  onClick={() => handleProjectClick(project.projectNumber)}
                  projectNumber={project.projectNumber}
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