'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Modern SVG Icons with enhanced styling
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

const FolderIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
  </svg>
);

const EditIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const AnalyticsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
  </svg>
);

const ImageIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
);

// Enhanced Sidebar Button Component
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

// Enhanced Project Card Component
interface ProjectCardProps {
  isHighlighted?: boolean;
  projectNumber?: number;
  onClick?: () => void;
  title?: string;
  status?: 'active' | 'completed' | 'pending';
  lastModified?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  isHighlighted = false, 
  onClick,
  title = "Proyecto",
  status = 'active',
  lastModified = "Hace 2 días"
}) => {
  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  };

  const statusLabels = {
    active: 'Activo',
    completed: 'Completado',
    pending: 'Pendiente'
  };

  return (
    <div 
      className={`
        group relative card card-interactive p-6 h-32
        ${isHighlighted 
          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black shadow-xl shadow-yellow-500/25' 
          : 'bg-zinc-900/50 hover:bg-zinc-800/50'
        }
        animate-fadeInUp
      `}
      onClick={onClick}
    >
      {/* Status Badge */}
      <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
        {statusLabels[status]}
      </div>
      
      {/* Content */}
      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className={`font-bold text-lg mb-1 ${isHighlighted ? 'text-black' : 'text-white'}`}>
            {title}
          </h3>
          <p className={`text-sm ${isHighlighted ? 'text-black/70' : 'text-white/60'}`}>
            {lastModified}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button 
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
              ${isHighlighted 
                ? 'bg-black/20 hover:bg-black/30 text-black' 
                : 'bg-white/10 hover:bg-white/20 text-white'
              }
              hover:scale-110 focus-ring
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <AnalyticsIcon />
          </button>
          <button 
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
              ${isHighlighted 
                ? 'bg-black/20 hover:bg-black/30 text-black' 
                : 'bg-white/10 hover:bg-white/20 text-white'
              }
              hover:scale-110 focus-ring
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <EditIcon />
          </button>
          <button 
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
              ${isHighlighted 
                ? 'bg-black/20 hover:bg-black/30 text-black' 
                : 'bg-white/10 hover:bg-white/20 text-white'
              }
              hover:scale-110 focus-ring
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <ImageIcon />
          </button>
        </div>
      </div>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </div>
  );
};

// Enhanced Stats Card Component
interface StatsCardProps {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  trend?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color, icon, trend }) => (
  <div className="card p-6 bg-zinc-900/50 hover:bg-zinc-800/50 animate-fadeInUp group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      {trend && (
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-white/60">{title}</div>
  </div>
);

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
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

  const sidebarItems = [
    { icon: <HomeIcon />, label: 'Dashboard', active: true },
    { icon: <ChartIcon />, label: 'Análisis' },
    { icon: <LayersIcon />, label: 'Proyectos' },
    { icon: <CalendarIcon />, label: 'Calendario' }
  ];

  const projects = [
    { title: "Análisis Seguridad Industrial", status: 'active' as const, lastModified: "Hace 2 horas" },
    { title: "Evaluación Riesgos Laborales", status: 'completed' as const, lastModified: "Hace 1 día" },
    { title: "Inspección Equipos", status: 'pending' as const, lastModified: "Hace 3 días" },
    { title: "Capacitación Personal", status: 'active' as const, lastModified: "Hace 5 días" },
    { title: "Auditoría Procesos", status: 'completed' as const, lastModified: "Hace 1 semana" },
    { title: "Mejora Continua", status: 'pending' as const, lastModified: "Hace 2 semanas" }
  ];

  const stats = [
    { title: "Total Proyectos", value: 24, color: "bg-blue-500/20 text-blue-400", icon: <FolderIcon />, trend: 12 },
    { title: "Activos", value: 18, color: "bg-green-500/20 text-green-400", icon: <AnalyticsIcon />, trend: 8 },
    { title: "Completados", value: 15, color: "bg-purple-500/20 text-purple-400", icon: <ChartIcon />, trend: 5 },
    { title: "En Revisión", value: 6, color: "bg-orange-500/20 text-orange-400", icon: <EditIcon />, trend: -2 }
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
      {/* Enhanced Sidebar */}
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
        {/* Enhanced Header */}
        <div className="bg-black/30 backdrop-blur-xl border-b border-white/10 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Dashboard SCAT
              </h1>
              <p className="text-white/60">
                Técnica de Análisis Sistemático de las Causas
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 pr-4 py-2 w-64 bg-white/5 border-white/10 focus:border-yellow-400"
                />
              </div>
              
              {/* Notifications */}
              <button className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 focus-ring">
                <NotificationIcon />
              </button>
              
              {/* Profile */}
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                <span className="text-black font-semibold text-sm">JD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>
            
            {/* Create Project Button */}
            <div className="flex justify-center">
              <button 
                onClick={handleCreateProject}
                className="btn btn-primary px-8 py-4 text-lg hover-lift animate-fadeInUp"
                style={{ animationDelay: '200ms' }}
              >
                <PlusIcon />
                Crear Nuevo Proyecto
              </button>
            </div>

            {/* Projects Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Proyectos Recientes</h2>
                <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
                  Ver todos
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <ProjectCard 
                    key={index}
                    isHighlighted={index === 0}
                    onClick={() => handleProjectClick(index + 1)}
                    {...project}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;