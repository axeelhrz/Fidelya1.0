'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSCAT, calculateProgress, Project } from '@/contexts/SCATContext';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { state, dispatch } = useSCAT();
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');

  // Iconos
  const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );

  const ChartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
    </svg>
  );

  const LayersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>
  );

  const DeleteIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  );

  const FolderPlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-2l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3v2z"/>
    </svg>
  );

  const GridIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/>
    </svg>
  );

  const ListIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
    </svg>
  );

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
    </svg>
  );

  // Componente de botón de sidebar
  const SidebarButton: React.FC<{
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    hasIndicator?: boolean;
  }> = ({ children, isActive = false, onClick, hasIndicator = false }) => (
    <motion.button
      onClick={onClick}
      className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
        isActive 
          ? 'bg-[#FFD600] text-black shadow-lg' 
          : 'bg-[#404040] text-white hover:bg-[#4A4A4A]'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      {hasIndicator && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3B30] rounded-full border-2 border-[#2E2E2E]" />
      )}
    </motion.button>
  );

  // Componente de tarjeta de proyecto
  const ProjectCard: React.FC<{
    project?: Project;
    isHighlighted?: boolean;
    projectNumber?: number;
    onClick?: () => void;
  }> = ({ project, isHighlighted = false, projectNumber = 1, onClick }) => {
    const progress = project ? calculateProgress(project) : { total: 0 };
    
    return (
      <motion.div
        onClick={onClick}
        className={`relative w-full h-32 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
          isHighlighted 
            ? 'bg-[#FFD600] text-black shadow-xl' 
            : 'bg-[#404040] text-white hover:bg-[#4A4A4A]'
        }`}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: projectNumber * 0.05 }}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="font-bold text-lg mb-1">
              {project ? project.name : `Proyecto ${projectNumber.toString().padStart(2, '0')}`}
            </h3>
            <p className={`text-sm ${isHighlighted ? 'text-black/70' : 'text-gray-300'}`}>
              {project ? project.event : 'Nuevo proyecto'}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`text-xs font-medium ${isHighlighted ? 'text-black/70' : 'text-gray-400'}`}>
              {project ? `${progress.total}% completado` : 'Sin iniciar'}
            </div>
            {project && (
              <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                <span className="text-xs font-bold">{progress.total}%</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Indicador de progreso */}
        {project && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-xl overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF6B6B] via-[#FFD600] to-[#00D26A]"
              initial={{ width: 0 }}
              animate={{ width: `${progress.total}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        )}
      </motion.div>
    );
  };

  // Estadísticas
  const getStatistics = () => {
    const activeProjects = state.projects.filter(p => p.status === 'active').length;
    const inProgressProjects = state.projects.filter(p => p.status === 'in-progress').length;
    const pendingProjects = state.projects.filter(p => p.status === 'pending').length;
    const totalProjects = state.projects.filter(p => p.status !== 'deleted').length;
    
    return {
      totalProjects,
      activeProjects,
      inProgressProjects,
      pendingProjects
    };
  };

  const stats = getStatistics();

  const handleProjectClick = (project: Project) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
    router.push('/dashboard/tabla-scat');
  };

  const handleViewProjects = () => {
    // Navigate to projects view
  };

  const handleViewTrash = () => {
    // Navigate to trash view
  };

  const handleCreateProject = () => {
    router.push('/dashboard/create-project');
  };

  return (
    <div className="min-h-screen bg-[#2E2E2E] flex">
      {/* Sidebar */}
      <motion.div 
        className="w-20 bg-[#2E2E2E] border-r border-[#555555] flex flex-col items-center py-6 gap-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SidebarButton isActive>
          <HomeIcon />
        </SidebarButton>
        
        <SidebarButton onClick={handleViewProjects}>
          <LayersIcon />
        </SidebarButton>
        
        <SidebarButton>
          <ChartIcon />
        </SidebarButton>
        
        <SidebarButton>
          <CalendarIcon />
        </SidebarButton>
        
        <div className="flex-1" />
        
        <SidebarButton 
          onClick={handleViewTrash} 
          hasIndicator={state.projects.filter(p => p.status === 'deleted').length > 0}
        >
          <DeleteIcon />
        </SidebarButton>
        
        <SidebarButton>
          <SettingsIcon />
        </SidebarButton>
      </motion.div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div 
          className="bg-[#2E2E2E] border-b border-[#555555] px-8 py-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold mb-2">
                Técnica de Análisis Sistemático de las Causas
              </h1>
              <p className="text-[#B3B3B3] text-lg">
                Dashboard de gestión de proyectos SCAT
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Buscador */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  className="w-64 pl-10 pr-4 py-2 bg-[#404040] border border-[#555555] rounded-lg text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#FFD600] transition-colors"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]">
                  <SearchIcon />
                </div>
              </div>
              
              {/* Selector de vista */}
              <div className="flex bg-[#404040] rounded-lg p-1">
                <button
                  onClick={() => setSelectedView('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    selectedView === 'grid' 
                      ? 'bg-[#FFD600] text-black' 
                      : 'text-[#B3B3B3] hover:text-white'
                  }`}
                >
                  <GridIcon />
                </button>
                <button
                  onClick={() => setSelectedView('list')}
                  className={`p-2 rounded-md transition-colors ${
                    selectedView === 'list' 
                      ? 'bg-[#FFD600] text-black' 
                      : 'text-[#B3B3B3] hover:text-white'
                  }`}
                >
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contenido */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Botón crear proyecto */}
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.button
              onClick={handleCreateProject}
              className="w-full max-w-md mx-auto flex items-center justify-center gap-3 bg-[#FFD600] text-black font-bold py-4 px-6 rounded-xl hover:bg-[#FFC107] transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FolderPlusIcon />
              <span className="text-lg">Create New Project</span>
            </motion.button>
          </motion.div>

          {/* Grid de proyectos */}
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h2 className="text-white text-xl font-bold mb-6">Proyectos Recientes</h2>
            
            <div className={`grid gap-6 ${
              selectedView === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {/* Proyectos existentes */}
              {state.projects
                .filter(p => p.status !== 'deleted')
                .slice(0, 8)
                .map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isHighlighted={index === 0}
                    projectNumber={index + 1}
                    onClick={() => handleProjectClick(project)}
                  />
                ))}
              
              {/* Proyectos placeholder si hay menos de 8 */}
              {Array.from({ length: Math.max(0, 8 - state.projects.filter(p => p.status !== 'deleted').length) })
                .map((_, index) => (
                  <ProjectCard
                    key={`placeholder-${index}`}
                    projectNumber={state.projects.filter(p => p.status !== 'deleted').length + index + 1}
                    onClick={handleCreateProject}
                  />
                ))}
            </div>
          </motion.div>

          {/* Estadísticas */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="bg-[#404040] rounded-xl p-6 border border-[#555555]">
              <h3 className="text-[#B3B3B3] text-sm font-medium mb-2">Total Projects</h3>
              <p className="text-white text-3xl font-bold">{stats.totalProjects}</p>
            </div>
            
            <div className="bg-[#404040] rounded-xl p-6 border border-[#555555]">
              <h3 className="text-[#B3B3B3] text-sm font-medium mb-2">Activos</h3>
              <p className="text-[#00D26A] text-3xl font-bold">{stats.activeProjects}</p>
            </div>
            
            <div className="bg-[#404040] rounded-xl p-6 border border-[#555555]">
              <h3 className="text-[#B3B3B3] text-sm font-medium mb-2">En Progreso</h3>
              <p className="text-[#FFD600] text-3xl font-bold">{stats.inProgressProjects}</p>
            </div>
            
            <div className="bg-[#404040] rounded-xl p-6 border border-[#555555]">
              <h3 className="text-[#B3B3B3] text-sm font-medium mb-2">Pendientes</h3>
              <p className="text-[#FF6B6B] text-3xl font-bold">{stats.pendingProjects}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;