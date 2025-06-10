'use client';

import React from 'react';

// Icon components
const HomeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
    <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
  </svg>
);

const LayersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
    <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84z"/>
    <path d="M17.5 13c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
    <path d="M3 13.5h8v8H3z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
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

interface ProjectCardProps {
  isHighlighted?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ isHighlighted = false }) => {
  return (
    <div 
      className={`w-[344px] h-[100px] rounded-lg p-4 flex items-center justify-between ${
        isHighlighted ? 'bg-[#FFD600]' : 'bg-[#2E2E2E]'
      }`}
    >
      <span className={`font-bold text-sm tracking-wide ${
        isHighlighted ? 'text-black' : 'text-white'
      }`}>
        PROYECTO CREADO
      </span>
      <div className="flex gap-2">
        <button className="w-8 h-8 bg-black rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
          <TreeIcon />
        </button>
        <button className="w-8 h-8 bg-black rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
          <EditIcon />
        </button>
        <button className="w-8 h-8 bg-black rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
          <ImageIcon />
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#3C3C3C] flex">
      {/* Sidebar */}
      <div className="w-[100px] bg-black flex flex-col items-center py-8 gap-8">
        <button className="hover:bg-gray-800 p-2 rounded transition-colors">
          <HomeIcon />
        </button>
        <button className="hover:bg-gray-800 p-2 rounded transition-colors">
          <ChartIcon />
        </button>
        <button className="hover:bg-gray-800 p-2 rounded transition-colors">
          <LayersIcon />
        </button>
        <button className="hover:bg-gray-800 p-2 rounded transition-colors">
          <CalendarIcon />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-[#2F766F] h-[80px] flex items-center justify-between px-8">
          <h1 className="text-[#FFC107] font-bold text-xl">
            Técnica de Análisis Sistemático de las Causas
          </h1>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <DeleteIcon />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <InfoIcon />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Create New Project Button */}
          <div className="mb-8">
            <button className="bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:from-[#FFB300] hover:to-[#FFA000] transition-all">
              <FolderPlusIcon />
              Create New Proyect
            </button>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* First row */}
            <ProjectCard isHighlighted={true} />
            <ProjectCard />
            <ProjectCard />
            
            {/* Second row */}
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            
            {/* Third row */}
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            
            {/* Fourth row */}
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
