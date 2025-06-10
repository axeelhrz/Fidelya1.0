"use client";

import { useState, useEffect } from "react";
import { Plus, ChevronDown } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ProjectCard from "./ProjectCard";
import AccidentFormModal from "./accident-form-modal";
import styles from "./Baseframe.module.css";

function App({ onNavigateToNext }) {
	// Sample projects for demonstration
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleContinue = (formData) => {
		setIsModalOpen(false);
		onNavigateToNext(formData);
	};
	const initialProjects = [
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

	const [projects, setProjects] = useState(initialProjects);
	//const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Pagination state
	const [displayedProjects, setDisplayedProjects] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const projectsPerPage = 6;

	// Initialize displayed projects
	useEffect(() => {
		loadMoreProjects(true);
	}, [projects]);

	// Load more projects function
	const loadMoreProjects = (reset = false) => {
		const page = reset ? 1 : currentPage + 1;
		const startIndex = 0;
		const endIndex = page * projectsPerPage;

		const newDisplayedProjects = projects.slice(startIndex, endIndex);
		setDisplayedProjects(newDisplayedProjects);
		setCurrentPage(page);
		setHasMore(endIndex < projects.length);
	};

	const handleCreateProject = (newProject) => {
		setProjects((prev) => [newProject, ...prev]);
	};

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	return (
		<div className={styles.container}>
			<Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

			<div className={styles.mainContent}>
				<Header onMenuToggle={toggleSidebar} />

				<main className={styles.main}>
					<div className={styles.content}>
						{/* Create New Project Button */}
						<div className={styles.createButtonContainer}>
							<button
								onClick={() => setIsModalOpen(true)}
								className={styles.createButton}
							>
								<Plus size={20} />
								<span>Create New proyect</span>
							</button>
						</div>

						{/* Projects Grid */}
						<div className={styles.projectsGrid}>
							{displayedProjects.map((project, index) => (
								<ProjectCard
									key={project.id}
									project={project}
									isHighlighted={index === 0}
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
									Haz clic en "Create New proyect" para comenzar
								</p>
							</div>
						)}
					</div>
				</main>
			</div>
			<div className={styles.initialContForm}>
				<div className={styles.accidentForm}>
					<AccidentFormModal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						onCreateProject={handleCreateProject}
						onContinue={handleContinue}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
