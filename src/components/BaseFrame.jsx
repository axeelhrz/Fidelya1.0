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

	// Pagination state
	const [displayedProjects, setDisplayedProjects] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const projectsPerPage = 6;

	// Cargar proyectos desde localStorage al inicializar
	useEffect(() => {
		const savedProjects = localStorage.getItem('scatProjects');
		const savedDeletedProjects = localStorage.getItem('scatDeletedProjects');
		
		if (savedProjects) {
			try {
				const parsedProjects = JSON.parse(savedProjects);
				setProjects(parsedProjects);
			} catch (error) {
				console.error('Error loading saved projects:', error);
				// Si hay error, usar proyectos iniciales
				setProjects(getInitialProjects());
			}
		} else {
			// Si no hay proyectos guardados, usar proyectos iniciales
			setProjects(getInitialProjects());
		}

		if (savedDeletedProjects) {
			try {
				const parsedDeletedProjects = JSON.parse(savedDeletedProjects);
				setDeletedProjects(parsedDeletedProjects);
			} catch (error) {
				console.error('Error loading deleted projects:', error);
			}
		}
	}, []);

	// Guardar proyectos en localStorage cuando cambien
	useEffect(() => {
		if (projects.length > 0) {
			localStorage.setItem('scatProjects', JSON.stringify(projects));
		}
	}, [projects]);

	// Guardar proyectos eliminados en localStorage cuando cambien
	useEffect(() => {
		localStorage.setItem('scatDeletedProjects', JSON.stringify(deletedProjects));
	}, [deletedProjects]);

	// Función para obtener proyectos iniciales
	const getInitialProjects = () => {
		return [
			{
				id: 1,
				name: "Proyecto Inicial",
				description: "Primer proyecto de ejemplo",
				createdAt: new Date().toISOString(),
			},
			{
				id: 2,
				name: "Análisis de Fallas",
				description: "Análisis sistemático de fallas",
				createdAt: new Date().toISOString(),
			},
			{
				id: 3,
				name: "Mejora Continua",
				description: "Proyecto de mejora continua",
				createdAt: new Date().toISOString(),
			},
			{
				id: 4,
				name: "Evaluación de Riesgos",
				description: "Evaluación de riesgos operativos",
				createdAt: new Date().toISOString(),
			},
			{
				id: 5,
				name: "Optimización de Procesos",
				description: "Optimización de procesos industriales",
				createdAt: new Date().toISOString(),
			},
			{
				id: 6,
				name: "Control de Calidad",
				description: "Sistema de control de calidad",
				createdAt: new Date().toISOString(),
			},
			{
				id: 7,
				name: "Mantenimiento Preventivo",
				description: "Plan de mantenimiento preventivo",
				createdAt: new Date().toISOString(),
			},
			{
				id: 8,
				name: "Seguridad Industrial",
				description: "Protocolos de seguridad industrial",
				createdAt: new Date().toISOString(),
			},
			{
				id: 9,
				name: "Gestión Ambiental",
				description: "Sistema de gestión ambiental",
				createdAt: new Date().toISOString(),
			},
		];
	};

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

	// Load more projects function - moved before useEffect
	const loadMoreProjects = useCallback((reset = false) => {
		const page = reset ? 1 : currentPage + 1;
		const startIndex = 0;
		const endIndex = page * projectsPerPage;

		const newDisplayedProjects = projects.slice(startIndex, endIndex);
		setDisplayedProjects(newDisplayedProjects);
		setCurrentPage(page);
		setHasMore(endIndex < projects.length);
	}, [projects, currentPage, projectsPerPage]);

	// Initialize displayed projects - moved after loadMoreProjects definition
	useEffect(() => {
		loadMoreProjects(true);
	}, [projects, loadMoreProjects]);

	const handleCreateProject = (newProject) => {
		setProjects((prev) => [newProject, ...prev]);
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
		}
	};

	const handleRestoreProject = (project) => {
		// Remover fecha de eliminación
		const { deletedAt: _deletedAt, ...restoredProject } = project;
		
		// Restaurar a proyectos activos
		setProjects(prev => [restoredProject, ...prev]);
		
		// Remover de papelera
		setDeletedProjects(prev => prev.filter(p => p.id !== project.id));
	};

	const handlePermanentDelete = (projectId) => {
		const confirmed = window.confirm('¿Estás seguro de que quieres eliminar permanentemente este proyecto? Esta acción no se puede deshacer.');
		if (confirmed) {
			setDeletedProjects(prev => prev.filter(p => p.id !== projectId));
		}
	};

	const handleEmptyTrash = () => {
		setDeletedProjects([]);
	};

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	// Debug: Log props on component mount
	useEffect(() => {
		console.log("BaseFrame mounted with props:", { onNavigateToScat, onNavigateToProjects });
	}, [onNavigateToScat, onNavigateToProjects]);

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

							{/* Trash Button */}
							<button
								onClick={() => setIsTrashModalOpen(true)}
								className={styles.trashButton}
								title={`Papelera (${deletedProjects.length})`}
							>
								<Trash2 size={20} />
								<span>Papelera</span>
								{deletedProjects.length > 0 && (
									<span className={styles.trashCount}>{deletedProjects.length}</span>
								)}
							</button>
						</div>

						{/* Projects Grid */}
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

						{/* Empty state */}
						{projects.length === 0 && (
							<div className={styles.emptyState}>
								<p className={styles.emptyTitle}>No hay proyectos creados</p>
								<p className={styles.emptyDescription}>
									Haz clic en "Create New Project" para comenzar
								</p>
							</div>
						)}
					</div>
				</main>
			</div>

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
	);
}

export default BaseFrame;
