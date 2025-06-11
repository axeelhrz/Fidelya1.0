"use client";

import { useState } from "react";
import { Trash2, Archive, Info, Edit, Download, Eye, Layers } from "lucide-react";
import TrashModal from "./TrashModal";
import styles from "./ProjectsView.module.css";

function ProjectsView({ onNavigateToBase, onNavigateToScat }) {
	const initialProjects = [
		{
			id: 1,
			name: "PROYECTO 1",
			description: "Primer proyecto de ejemplo",
			createdAt: new Date().toISOString(),
		},
		{
			id: 2,
			name: "PROYECTO 2",
			description: "Análisis sistemático de fallas",
			createdAt: new Date().toISOString(),
		},
		{
			id: 3,
			name: "PROYECTO 3",
			description: "Proyecto de mejora continua",
			createdAt: new Date().toISOString(),
		},
		{
			id: 4,
			name: "PROYECTO 4",
			description: "Evaluación de riesgos operativos",
			createdAt: new Date().toISOString(),
		},
		{
			id: 5,
			name: "PROYECTO 5",
			description: "Optimización de procesos industriales",
			createdAt: new Date().toISOString(),
		},
		{
			id: 6,
			name: "PROYECTO 6",
			description: "Sistema de control de calidad",
			createdAt: new Date().toISOString(),
		},
		{
			id: 7,
			name: "PROYECTO 7",
			description: "Plan de mantenimiento preventivo",
			createdAt: new Date().toISOString(),
		},
		{
			id: 8,
			name: "PROYECTO 8",
			description: "Protocolos de seguridad industrial",
			createdAt: new Date().toISOString(),
		},
		{
			id: 9,
			name: "PROYECTO 9",
			description: "Sistema de gestión ambiental",
			createdAt: new Date().toISOString(),
		},
		{
			id: 10,
			name: "PROYECTO 10",
			description: "Control de inventarios",
			createdAt: new Date().toISOString(),
		},
		{
			id: 11,
			name: "PROYECTO 11",
			description: "Análisis de productividad",
			createdAt: new Date().toISOString(),
		},
		{
			id: 12,
			name: "PROYECTO 12",
			description: "Gestión de recursos humanos",
			createdAt: new Date().toISOString(),
		},
		{
			id: 13,
			name: "PROYECTO 13",
			description: "Control de calidad avanzado",
			createdAt: new Date().toISOString(),
		},
		{
			id: 14,
			name: "PROYECTO 14",
			description: "Automatización de procesos",
			createdAt: new Date().toISOString(),
		},
		{
			id: 15,
			name: "PROYECTO 15",
			description: "Gestión de riesgos financieros",
			createdAt: new Date().toISOString(),
		},
		{
			id: 16,
			name: "PROYECTO 16",
			description: "Optimización energética",
			createdAt: new Date().toISOString(),
		},
	];

	const [projects, setProjects] = useState(initialProjects);
	const [deletedProjects, setDeletedProjects] = useState([]);
	const [selectedProjects, setSelectedProjects] = useState(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
	const projectsPerPage = 16;

	// Calcular proyectos para la página actual
	const indexOfLastProject = currentPage * projectsPerPage;
	const indexOfFirstProject = indexOfLastProject - projectsPerPage;
	const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
	const totalPages = Math.ceil(projects.length / projectsPerPage);

	const handleSelectProject = (projectId) => {
		const newSelected = new Set(selectedProjects);
		if (newSelected.has(projectId)) {
			newSelected.delete(projectId);
		} else {
			newSelected.add(projectId);
		}
		setSelectedProjects(newSelected);
	};

	const handleSelectAll = () => {
		if (selectedProjects.size === currentProjects.length) {
			setSelectedProjects(new Set());
		} else {
			setSelectedProjects(new Set(currentProjects.map(p => p.id)));
		}
	};

	const handleDeleteSelected = () => {
		if (selectedProjects.size > 0) {
			const confirmed = window.confirm(`¿Estás seguro de que quieres eliminar ${selectedProjects.size} proyecto(s)?`);
			if (confirmed) {
				// Mover proyectos seleccionados a papelera
				const projectsToDelete = projects.filter(p => selectedProjects.has(p.id));
				const deletedProjectsWithDate = projectsToDelete.map(project => ({
					...project,
					deletedAt: new Date().toISOString()
				}));
				
				setDeletedProjects(prev => [...deletedProjectsWithDate, ...prev]);
				setProjects(projects.filter(p => !selectedProjects.has(p.id)));
				setSelectedProjects(new Set());
			}
		}
	};

	const handleArchiveSelected = () => {
		if (selectedProjects.size > 0) {
			alert(`${selectedProjects.size} proyecto(s) archivado(s)`);
			setSelectedProjects(new Set());
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

	const handleViewProject = (project) => {
		// Navegar al SCAT con los datos del proyecto
		if (onNavigateToScat) {
			onNavigateToScat(project);
		}
	};

	const handleEditProject = (project) => {
		alert(`Editando proyecto: ${project.name}`);
	};

	const handleDownloadProject = (project) => {
		alert(`Descargando proyecto: ${project.name}`);
	};

	const handleBackToMenu = () => {
		if (onNavigateToBase) {
			onNavigateToBase();
		}
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		setSelectedProjects(new Set());
	};

	return (
		<div className={styles.container}>
			{/* Header */}
			<div className={styles.header}>
				<div className={styles.headerLeft}>
					<button 
						className={styles.backButton}
						onClick={handleBackToMenu}
						title="Volver al menú principal"
					>
						← Menú Principal
					</button>
					<div className={styles.titleSection}>
						<Layers className={styles.titleIcon} size={24} />
						<h1 className={styles.title}>PROYECTOS</h1>
					</div>
				</div>
				<div className={styles.headerRight}>
					<button 
						className={styles.actionButton}
						onClick={handleDeleteSelected}
						disabled={selectedProjects.size === 0}
						title="Eliminar seleccionados"
					>
						<Trash2 size={16} />
					</button>
					<button 
						className={styles.actionButton}
						onClick={handleArchiveSelected}
						disabled={selectedProjects.size === 0}
						title="Archivar seleccionados"
					>
						<Archive size={16} />
					</button>
					<button 
						className={`${styles.actionButton} ${styles.trashButton}`}
						onClick={() => setIsTrashModalOpen(true)}
						title={`Papelera (${deletedProjects.length})`}
					>
						<Trash2 size={16} />
						{deletedProjects.length > 0 && (
							<span className={styles.trashCount}>{deletedProjects.length}</span>
						)}
					</button>
					<button 
						className={styles.actionButton}
						title="Información"
					>
						<Info size={16} />
					</button>
				</div>
			</div>

			{/* Projects Grid - Ocupa toda la pantalla */}
			<div className={styles.projectsContainer}>
				<div className={styles.projectsGrid}>
					{currentProjects.map((project) => (
						<div 
							key={project.id} 
							className={`${styles.projectCard} ${selectedProjects.has(project.id) ? styles.selected : ''}`}
						>
							<div className={styles.projectHeader}>
								<input
									type="checkbox"
									checked={selectedProjects.has(project.id)}
									onChange={() => handleSelectProject(project.id)}
									className={styles.checkbox}
								/>
								<h3 className={styles.projectName}>{project.name}</h3>
							</div>
							<div className={styles.projectActions}>
								<button 
									className={styles.projectActionButton}
									onClick={() => handleViewProject(project)}
									title="Ver proyecto"
								>
									<Eye size={14} />
								</button>
								<button 
									className={styles.projectActionButton}
									onClick={() => handleEditProject(project)}
									title="Editar proyecto"
								>
									<Edit size={14} />
								</button>
								<button 
									className={styles.projectActionButton}
									onClick={() => handleDownloadProject(project)}
									title="Descargar proyecto"
								>
									<Download size={14} />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Bottom Controls */}
			<div className={styles.bottomControls}>
				<div className={styles.selectionControls}>
					<button 
						className={styles.selectAllButton}
						onClick={handleSelectAll}
					>
						{selectedProjects.size === currentProjects.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
					</button>
					{selectedProjects.size > 0 && (
						<span className={styles.selectedCount}>
							{selectedProjects.size} seleccionado(s)
						</span>
					)}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className={styles.pagination}>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<button
								key={page}
								className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
								onClick={() => handlePageChange(page)}
							>
								{page}
							</button>
						))}
					</div>
				)}
			</div>

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

export default ProjectsView;