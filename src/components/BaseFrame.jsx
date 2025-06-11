"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, ChevronDown, Trash2 } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ProjectCard from "./ProjectCard";
import AccidentFormModal from "./accident-form-modal";
import TrashModal from "./TrashModal";
import styles from "./Baseframe.module.css";

function BaseFrame({ onNavigateToScat, onNavigateToProjects }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
	const [projects, setProjects] = useState([]);
	const [deletedProjects, setDeletedProjects] = useState([]);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	// Pagination state
	const [displayedProjects, setDisplayedProjects] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const projectsPerPage = 6;

	// Función para limpiar proyectos simulados
	const cleanSimulatedProjects = (projectsList) => {
		// Filtrar solo proyectos que NO sean de ejemplo
		return projectsList.filter(project => !project.isExample);
	};

	// Cargar proyectos desde localStorage al inicializar
	useEffect(() => {
		const loadProjects = () => {
			try {
				const savedProjects = localStorage.getItem('scatProjects');
				const savedDeletedProjects = localStorage.getItem('scatDeletedProjects');
				
				console.log('Cargando proyectos desde localStorage...');
				console.log('savedProjects:', savedProjects);
				
				// Solo cargar proyectos reales del usuario
				let loadedProjects = [];
				if (savedProjects) {
					const parsedProjects = JSON.parse(savedProjects);
					// Limpiar proyectos simulados si existen
					loadedProjects = cleanSimulatedProjects(parsedProjects);
					console.log('Proyectos cargados después de limpiar:', loadedProjects);
				}
				
				setProjects(loadedProjects);
				
				let loadedDeletedProjects = [];
				if (savedDeletedProjects) {
					const parsedDeletedProjects = JSON.parse(savedDeletedProjects);
					// Limpiar proyectos simulados de la papelera también
					loadedDeletedProjects = cleanSimulatedProjects(parsedDeletedProjects);
				}
				
				setDeletedProjects(loadedDeletedProjects);
				
			} catch (error) {
				console.error('Error loading saved projects:', error);
				// En caso de error, empezar con arrays vacíos
				setProjects([]);
				setDeletedProjects([]);
			}
			
			setIsInitialized(true);
		};

		loadProjects();
	}, []);

	// Guardar proyectos en localStorage cuando cambien (solo después de la inicialización)
	useEffect(() => {
		if (isInitialized) {
			console.log('Guardando proyectos en localStorage:', projects);
			localStorage.setItem('scatProjects', JSON.stringify(projects));
			console.log('Proyectos guardados en localStorage:', projects.length);
		}
	}, [projects, isInitialized]);

	// Guardar proyectos eliminados en localStorage cuando cambien
	useEffect(() => {
		if (isInitialized) {
			localStorage.setItem('scatDeletedProjects', JSON.stringify(deletedProjects));
		}
	}, [deletedProjects, isInitialized]);

	// Función para manejar la continuación al SCAT
	const handleContinue = (formData) => {
		console.log("handleContinue called with:", formData);
		console.log("onNavigateToScat function:", onNavigateToScat);
		
		setIsModalOpen(false);
		
		// Verificar que la función existe antes de llamarla
		if (typeof onNavigateToScat === 'function') {
			onNavigateToScat(formData);
		} else {
			console.error("onNavigateToScat is not a function:", onNavigateToScat);
			alert("Error: No se puede navegar al SCAT. Función no encontrada.");
		}
	};

	// Load more projects function
	const loadMoreProjects = useCallback((reset = false) => {
		const page = reset ? 1 : currentPage + 1;
		const startIndex = 0;
		const endIndex = page * projectsPerPage;

		const newDisplayedProjects = projects.slice(startIndex, endIndex);
		setDisplayedProjects(newDisplayedProjects);
		setCurrentPage(page);
		setHasMore(endIndex < projects.length);
		
		console.log('Proyectos mostrados actualizados:', newDisplayedProjects.length);
	}, [projects, currentPage, projectsPerPage]);

	// Initialize displayed projects
	useEffect(() => {
		if (isInitialized) {
			loadMoreProjects(true);
		}
	}, [projects, loadMoreProjects, isInitialized]);

	const handleCreateProject = (newProject) => {
		console.log('=== CREANDO NUEVO PROYECTO ===');
		console.log('Proyecto recibido:', newProject);
		console.log('Proyectos actuales antes de agregar:', projects.length);
		
		setProjects((prev) => {
			const updatedProjects = [newProject, ...prev];
			console.log('Proyectos después de agregar:', updatedProjects.length);
			console.log('Lista actualizada:', updatedProjects);
			return updatedProjects;
		});
		
		console.log('=== FIN CREACIÓN PROYECTO ===');
	};

	const handleDeleteProject = (projectId) => {
		const projectToDelete = projects.find(p => p.id === projectId);
		if (projectToDelete) {
			// Agregar fecha de eliminación
			const deletedProject = {
				...projectToDelete,
				deletedAt: new Date().toISOString()
			};
			
			// Mover a papelera
			setDeletedProjects(prev => [deletedProject, ...prev]);
			
			// Remover de proyectos activos
			setProjects(prev => prev.filter(p => p.id !== projectId));
			
			console.log('Proyecto movido a papelera:', projectToDelete.name);
		}
	};

	const handleRestoreProject = (project) => {
		// Remover fecha de eliminación
		const { deletedAt: _deletedAt, ...restoredProject } = project;
		
		// Restaurar a proyectos activos
		setProjects(prev => [restoredProject, ...prev]);
		
		// Remover de papelera
		setDeletedProjects(prev => prev.filter(p => p.id !== project.id));
		
		console.log('Proyecto restaurado:', project.name);
	};

	const handlePermanentDelete = (projectId) => {
		const confirmed = window.confirm('¿Estás seguro de que quieres eliminar permanentemente este proyecto? Esta acción no se puede deshacer.');
		if (confirmed) {
			setDeletedProjects(prev => prev.filter(p => p.id !== projectId));
			console.log('Proyecto eliminado permanentemente');
		}
	};

	const handleEmptyTrash = () => {
		const confirmed = window.confirm('¿Estás seguro de que quieres vaciar la papelera? Esta acción no se puede deshacer.');
		if (confirmed) {
			setDeletedProjects([]);
			console.log('Papelera vaciada');
		}
	};

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Debug: Log props on component mount
	useEffect(() => {
		console.log("BaseFrame mounted with props:", { onNavigateToScat, onNavigateToProjects });
	}, [onNavigateToScat, onNavigateToProjects]);

	// Mostrar loading mientras se inicializa
	if (!isInitialized) {
		return (
			<div className={styles.container}>
				<div className={styles.loading}>
					<p>Cargando proyectos...</p>
				</div>
			</div>
		);
	}

	console.log('Renderizando BaseFrame con:', {
		totalProjects: projects.length,
		displayedProjects: displayedProjects.length,
		deletedProjects: deletedProjects.length
	});

	return (
		<div className={styles.container}>
			<Sidebar 
				isOpen={isSidebarOpen} 
				onToggle={toggleSidebar}
				onNavigateToProjects={onNavigateToProjects}
			/>

			<div className={styles.mainContent}>
				<Header onMenuToggle={toggleSidebar} />

				<main className={styles.main}>
					<div className={styles.content}>
						{/* Action Buttons Container */}
						<div className={styles.actionButtonsContainer}>
							{/* Create New Project Button */}
							<button
								onClick={() => setIsModalOpen(true)}
								className={styles.createButton}
							>
								<Plus size={20} />
								<span>Create New Project</span>
							</button>

							{/* Trash Button - Solo mostrar si hay proyectos eliminados */}
							{deletedProjects.length > 0 && (
								<button
									onClick={() => setIsTrashModalOpen(true)}
									className={styles.trashButton}
									title={`Papelera (${deletedProjects.length})`}
								>
									<Trash2 size={20} />
									<span>Papelera</span>
									<span className={styles.trashCount}>{deletedProjects.length}</span>
								</button>
							)}
						</div>

						{/* Projects Grid */}
						{projects.length > 0 ? (
							<>
								<div className={styles.projectsGrid}>
									{displayedProjects.map((project, index) => (
										<ProjectCard
											key={project.id}
											project={project}
											isHighlighted={index === 0}
											onDelete={() => handleDeleteProject(project.id)}
										/>
									))}
								</div>

								{/* Load More Button */}
								{hasMore && (
									<div className={styles.loadMoreContainer}>
										<button
											onClick={() => loadMoreProjects()}
											className={styles.loadMoreButton}
										>
											<span>Cargar más proyectos</span>
											<ChevronDown size={18} />
										</button>
									</div>
								)}
							</>
						) : (
							/* Empty state - Mostrar cuando no hay proyectos */
							<div className={styles.emptyState}>
								<div className={styles.emptyIcon}>
									<Plus size={64} />
								</div>
								<p className={styles.emptyTitle}>No tienes proyectos creados</p>
								<p className={styles.emptyDescription}>
									Comienza creando tu primer proyecto de análisis SCAT
								</p>
								<button
									onClick={() => setIsModalOpen(true)}
									className={styles.emptyStateButton}
								>
									<Plus size={20} />
									<span>Crear mi primer proyecto</span>
								</button>
							</div>
						)}

						{/* Accident Form Modal */}
						<AccidentFormModal
							isOpen={isModalOpen}
							onClose={() => setIsModalOpen(false)}
							onCreateProject={handleCreateProject}
							onContinue={handleContinue}
						/>

						{/* Trash Modal */}
						<TrashModal
							isOpen={isTrashModalOpen}
							onClose={() => setIsTrashModalOpen(false)}
							deletedProjects={deletedProjects}
							onRestoreProject={handleRestoreProject}
							onPermanentDelete={handlePermanentDelete}
							onEmptyTrash={handleEmptyTrash}
						/>
					</div>
				</main>
			</div>
		</div>
	);
}

export default BaseFrame;