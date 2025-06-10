'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSCAT, calculateProgress } from '@/contexts/SCATContext';

const ProyectosPage: React.FC = () => {
  const router = useRouter();
  const { state, dispatch } = useSCAT();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'in-progress' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'progress'>('date');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  // Iconos
  const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
    </svg>
  );

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  );

  const FilterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    </svg>
  );

  const SortIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
    </svg>
  );

  const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  );

  const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  );

  const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  );

  const CheckboxIcon = ({ checked }: { checked: boolean }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      {checked ? (
        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      ) : (
        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
      )}
    </svg>
  );

  // Filtrar y ordenar proyectos
  const filteredProjects = useMemo(() => {
    let filtered = state.projects.filter(project => project.status !== 'deleted');

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.area.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      if (filterStatus === 'completed') {
        filtered = filtered.filter(project => {
          const progress = calculateProgress(project);
          return progress.total === 100;
        });
      } else {
        filtered = filtered.filter(project => project.status === filterStatus);
      }
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'progress':
          const progressA = calculateProgress(a);
          const progressB = calculateProgress(b);
          return progressB.total - progressA.total;
        default:
          return 0;
      }
    });

    return filtered;
  }, [state.projects, searchQuery, filterStatus, sortBy]);

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleProjectClick = (project: typeof state.projects[0]) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
    router.push('/dashboard/tabla-scat');
  };

  const handleDeleteProject = (projectId: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: projectId });
    setSelectedProjects(prev => prev.filter(id => id !== projectId));
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
  };

  const handleBulkDelete = () => {
    selectedProjects.forEach(projectId => {
      dispatch({ type: 'DELETE_PROJECT', payload: projectId });
    });
    setSelectedProjects([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00D26A';
      case 'in-progress': return '#FFD600';
      case 'pending': return '#FF6B6B';
      default: return '#B3B3B3';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'in-progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-[#3C3C3C]">
      {/* Header */}
      <motion.div 
        className="bg-[#2E2E2E] border-b border-[#555555] px-8 py-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleBack}
              className="p-2 rounded-lg bg-[#404040] text-white hover:bg-[#4A4A4A] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon />
            </motion.button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">Gestión de Proyectos</h1>
              <p className="text-[#B3B3B3]">
                {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Acciones en lote */}
          <AnimatePresence>
            {selectedProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2"
              >
                <span className="text-white text-sm">
                  {selectedProjects.length} seleccionado{selectedProjects.length !== 1 ? 's' : ''}
                </span>
                <motion.button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-[#FF3B30] text-white rounded-lg hover:bg-[#DC2626] transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <DeleteIcon />
                  Eliminar
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Filtros y búsqueda */}
      <motion.div 
        className="bg-[#404040] border-b border-[#555555] px-8 py-4"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          {/* Buscador */}
          <div className="relative flex-1 min-w-64">
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2E2E2E] border border-[#555555] rounded-lg text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#FFD600] transition-colors"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]">
              <SearchIcon />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center gap-2">
            <FilterIcon />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'in-progress' | 'pending' | 'completed')}
              className="bg-[#2E2E2E] border border-[#555555] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFD600] transition-colors"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="in-progress">En Progreso</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completados</option>
            </select>
          </div>

          {/* Ordenar por */}
          <div className="flex items-center gap-2">
            <SortIcon />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'progress')}
              className="bg-[#2E2E2E] border border-[#555555] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFD600] transition-colors"
            >
              <option value="date">Fecha de modificación</option>
              <option value="name">Nombre</option>
              <option value="progress">Progreso</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Lista de proyectos */}
      <div className="p-8">
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-[#B3B3B3] text-lg mb-4">
              No se encontraron proyectos
            </div>
            <motion.button
              onClick={() => router.push('/dashboard/nuevo-proyecto')}
              className="px-6 py-3 bg-[#FFD600] text-black font-medium rounded-lg hover:bg-[#FFC107] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Crear primer proyecto
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Header de tabla */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#404040] rounded-t-xl px-6 py-4 border border-[#555555]"
            >
              <div className="grid grid-cols-12 gap-4 items-center text-[#B3B3B3] text-sm font-medium">
                <div className="col-span-1">
                  <motion.button
                    onClick={handleSelectAll}
                    className="text-white hover:text-[#FFD600] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <CheckboxIcon checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0} />
                  </motion.button>
                </div>
                <div className="col-span-3">Proyecto</div>
                <div className="col-span-2">Estado</div>
                <div className="col-span-2">Progreso</div>
                <div className="col-span-2">Última modificación</div>
                <div className="col-span-2">Acciones</div>
              </div>
            </motion.div>

            {/* Filas de proyectos */}
            <div className="bg-[#2E2E2E] rounded-b-xl border-x border-b border-[#555555] overflow-hidden">
              <AnimatePresence>
                {filteredProjects.map((project, index) => {
                  const progress = calculateProgress(project);
                  const isSelected = selectedProjects.includes(project.id);
                  
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-[#555555] last:border-b-0 hover:bg-[#404040] transition-colors ${
                        isSelected ? 'bg-[#FFD600]/10' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="col-span-1">
                        <motion.button
                          onClick={() => handleSelectProject(project.id)}
                          className="text-white hover:text-[#FFD600] transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <CheckboxIcon checked={isSelected} />
                        </motion.button>
                      </div>

                      {/* Información del proyecto */}
                      <div className="col-span-3">
                        <h3 className="text-white font-medium mb-1 truncate">{project.name}</h3>
                        <p className="text-[#B3B3B3] text-sm truncate">{project.event}</p>
                      </div>

                      {/* Estado */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getStatusColor(project.status) }}
                          />
                          <span className="text-white text-sm">{getStatusLabel(project.status)}</span>
                        </div>
                      </div>

                      {/* Progreso */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-[#404040] rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-[#FF6B6B] via-[#FFD600] to-[#00D26A]"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress.total}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                            />
                          </div>
                          <span className="text-white text-sm font-medium min-w-[3rem]">
                            {progress.total}%
                          </span>
                        </div>
                      </div>

                      {/* Fecha */}
                      <div className="col-span-2">
                        <span className="text-[#B3B3B3] text-sm">
                          {new Date(project.updatedAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>

                      {/* Acciones */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => handleProjectClick(project)}
                            className="p-2 rounded-lg bg-[#00D26A] text-white hover:bg-[#00B050] transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Abrir proyecto"
                          >
                            <PlayIcon />
                          </motion.button>
                          
                          <motion.button
                            className="p-2 rounded-lg bg-[#4ECDC4] text-white hover:bg-[#45B7D1] transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Editar proyecto"
                          >
                            <EditIcon />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 rounded-lg bg-[#FF3B30] text-white hover:bg-[#DC2626] transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Eliminar proyecto"
                          >
                            <DeleteIcon />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProyectosPage;
