"use client";

import { useState, useEffect } from "react";
import styles from "./ScatInterface.module.css";
import EvaluacionContent from "./content/EvaluacionContent";
import ContactoContent from "./content/ContactoContent";
import CausasInmediatasContent from "./content/CausasInmediatasContent";
import CausasBasicasContent from "./content/CausasBasicasContent";
import NecesidadesControlContent from "./content/NecesidadesControlContent";
import { useScatData } from "../../contexts/ScatContext";
import {
	InfoIcon,
	SaveIcon,
	GridIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
} from "./icons/Icons";

const scatSections = [
	{
		id: "evaluacion",
		title: "EVALUACIÓN POTENCIAL DE PERDIDA SI NO ES CONTROLADO",
		component: EvaluacionContent,
	},
	{
		id: "contacto",
		title: "Tipo de Contacto o Cuasi Contacto con Energía o Sustancia",
		component: ContactoContent,
	},
	{
		id: "causas-inmediatas",
		title: "(CI) Causas Inmediatas o Directas",
		component: CausasInmediatasContent,
	},
	{
		id: "causas-basicas",
		title: "(CB) Causas Básicas / Subyacentes",
		component: CausasBasicasContent,
	},
	{
		id: "necesidades-control",
		title: "(NAC) Necesidades de Acción de Control (NAC) = Falta de Control",
		component: NecesidadesControlContent,
	},
];

function ScatInterface({ 
	onNavigateToBase, 
	onNavigateToProjects, 
	onNavigateToDescription, 
	onSaveProject,
	formData, 
	editingProject, 
	isEditing = false 
}) {
	const [activeSection, setActiveSection] = useState("evaluacion");
	const { 
		setProjectData, 
		hasData, 
		getCompleteSummary,
		setEvaluacionData,
		setContactoData,
		setCausasInmediatasData,
		setCausasBasicasData,
		setNecesidadesControlData
	} = useScatData();

	// Cargar datos del proyecto cuando se reciban
	useEffect(() => {
		if (formData) {
			console.log('=== CARGANDO DATOS EN SCAT INTERFACE ===');
			console.log('FormData recibido:', formData);
			console.log('Es edición:', isEditing);
			console.log('Proyecto en edición:', editingProject);

			// Cargar datos básicos del proyecto
			setProjectData(formData);

			// Si estamos editando, cargar todos los datos guardados del proyecto
			if (isEditing && editingProject) {
				loadProjectData(editingProject);
			}
		}
	}, [formData, isEditing, editingProject, setProjectData]);

	const loadProjectData = (project) => {
		console.log('=== CARGANDO DATOS COMPLETOS DEL PROYECTO ===');
		console.log('Proyecto completo:', project);

		try {
			// Cargar datos de evaluación si existen
			if (project.scatData?.evaluacion) {
				console.log('Cargando datos de evaluación:', project.scatData.evaluacion);
				setEvaluacionData(project.scatData.evaluacion);
			}

			// Cargar datos de contacto si existen
			if (project.scatData?.contacto) {
				console.log('Cargando datos de contacto:', project.scatData.contacto);
				setContactoData(project.scatData.contacto);
			}

			// Cargar datos de causas inmediatas si existen
			if (project.scatData?.causasInmediatas) {
				console.log('Cargando datos de causas inmediatas:', project.scatData.causasInmediatas);
				if (project.scatData.causasInmediatas.actos) {
					setCausasInmediatasData('actos', project.scatData.causasInmediatas.actos);
				}
				if (project.scatData.causasInmediatas.condiciones) {
					setCausasInmediatasData('condiciones', project.scatData.causasInmediatas.condiciones);
				}
			}

			// Cargar datos de causas básicas si existen
			if (project.scatData?.causasBasicas) {
				console.log('Cargando datos de causas básicas:', project.scatData.causasBasicas);
				if (project.scatData.causasBasicas.personales) {
					setCausasBasicasData('personales', project.scatData.causasBasicas.personales);
				}
				if (project.scatData.causasBasicas.laborales) {
					setCausasBasicasData('laborales', project.scatData.causasBasicas.laborales);
				}
			}

			// Cargar datos de necesidades de control si existen
			if (project.scatData?.necesidadesControl) {
				console.log('Cargando datos de necesidades de control:', project.scatData.necesidadesControl);
				setNecesidadesControlData(project.scatData.necesidadesControl);
			}

			console.log('=== DATOS CARGADOS EXITOSAMENTE ===');
		} catch (error) {
			console.error('Error cargando datos del proyecto:', error);
		}
	};

	const handleSectionClick = (sectionId) => {
		setActiveSection(sectionId);
	};

	const getCurrentSectionIndex = () => {
		return scatSections.findIndex(section => section.id === activeSection);
	};

	const goToPreviousSection = () => {
		const currentIndex = getCurrentSectionIndex();
		if (currentIndex > 0) {
			setActiveSection(scatSections[currentIndex - 1].id);
		}
	};

	const goToNextSection = () => {
		const currentIndex = getCurrentSectionIndex();
		if (currentIndex < scatSections.length - 1) {
			setActiveSection(scatSections[currentIndex + 1].id);
		}
	};

	const canGoPrevious = () => {
		return getCurrentSectionIndex() > 0;
	};

	const canGoNext = () => {
		return getCurrentSectionIndex() < scatSections.length - 1;
	};

	const handleBackToMenu = () => {
		console.log("handleBackToMenu called");
		
		// Si estamos editando, guardar los cambios antes de salir
		if (isEditing && editingProject) {
			handleSaveProgress(true); // true indica que es al salir
		}
		
		if (onNavigateToBase) {
			onNavigateToBase();
		}
	};

	const handleSaveProgress = (isExiting = false) => {
		console.log('=== GUARDANDO PROGRESO ===');
		console.log('Es al salir:', isExiting);
		console.log('Es edición:', isEditing);
		console.log('Proyecto en edición:', editingProject);

		try {
			// Obtener todos los datos actuales del contexto
			const completeSummary = getCompleteSummary();
			console.log('Resumen completo de datos:', completeSummary);

			if (isEditing && editingProject) {
				// Estamos editando un proyecto existente
				const updatedProject = {
					...editingProject,
					formData: completeSummary.project,
					scatData: {
						evaluacion: completeSummary.evaluacion,
						contacto: completeSummary.contacto,
						causasInmediatas: completeSummary.causasInmediatas,
						causasBasicas: completeSummary.causasBasicas,
						necesidadesControl: completeSummary.necesidadesControl
					},
					lastModified: new Date().toISOString(),
					version: (editingProject.version || 1) + 1
				};

				console.log('Proyecto actualizado:', updatedProject);

				// Actualizar en localStorage
				const savedProjects = localStorage.getItem('scatProjects');
				if (savedProjects) {
					const projects = JSON.parse(savedProjects);
					const updatedProjects = projects.map(p => 
						p.id === editingProject.id ? updatedProject : p
					);
					localStorage.setItem('scatProjects', JSON.stringify(updatedProjects));
					console.log('Proyecto guardado en localStorage');
				}

				// Llamar callback si existe
				if (onSaveProject) {
					onSaveProject(updatedProject);
				}

				if (isExiting) {
					alert("Cambios guardados exitosamente");
				} else {
					alert("Progreso guardado exitosamente");
				}
			} else {
				// Nuevo proyecto o modo visualización
				console.log("Progreso guardado automáticamente en contexto");
				if (!isExiting) {
					alert("Progreso guardado exitosamente");
				}
			}
		} catch (error) {
			console.error('Error guardando progreso:', error);
			alert("Error al guardar el progreso");
		}
	};

	const handleShowInfo = () => {
		const currentSection = scatSections.find(section => section.id === activeSection);
		alert(`Información sobre: ${currentSection?.title}`);
	};

	const handleShowGrid = () => {
		console.log("handleShowGrid called");
		console.log("onNavigateToProjects function:", onNavigateToProjects);
		
		// Si estamos editando, guardar antes de navegar
		if (isEditing && editingProject) {
			handleSaveProgress(true);
		}
		
		if (onNavigateToProjects) {
			console.log("Calling onNavigateToProjects");
			onNavigateToProjects();
		} else {
			console.error("onNavigateToProjects is not available");
		}
	};

	const handleCompleteAnalysis = () => {
		if (hasData()) {
			// Si estamos editando, guardar antes de finalizar
			if (isEditing && editingProject) {
				handleSaveProgress(true);
			}
			
			if (onNavigateToDescription) {
				onNavigateToDescription();
			}
		} else {
			alert("Por favor, complete al menos una sección antes de finalizar el análisis.");
		}
	};

	const ActiveComponent =
		scatSections.find((section) => section.id === activeSection)?.component ||
		EvaluacionContent;

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<div className={styles.headerLeft}>
						<button 
							className={styles.backToMenuButton}
							onClick={handleBackToMenu}
							title="Volver al menú principal"
						>
							← Menú Principal
						</button>
						{isEditing && (
							<div className={styles.editingIndicator}>
								<span className={styles.editingBadge}>EDITANDO</span>
								<span className={styles.editingText}>
									{editingProject?.name || 'Proyecto'}
								</span>
							</div>
						)}
					</div>
					<div className={styles.headerCenter}>
						<h1 className={styles.title}>TABLA SCAT</h1>
						<h2 className={styles.subtitle}>
							Técnica de Análisis Sistemático de las Causas
						</h2>
					</div>
					<div className={styles.headerRight}>
						<div className={styles.sectionCounter}>
							{getCurrentSectionIndex() + 1} de {scatSections.length}
						</div>
						<button 
							className={styles.completeButton}
							onClick={handleCompleteAnalysis}
							title="Finalizar análisis y ver resumen"
						>
							{isEditing ? 'Guardar y Finalizar' : 'Finalizar Análisis'}
						</button>
					</div>
				</div>
			</div>

			<div className={styles.navigationContainer}>
				<div className={styles.navigationHeader}>
					<button 
						className={`${styles.navArrow} ${!canGoPrevious() ? styles.disabled : ''}`}
						onClick={goToPreviousSection}
						disabled={!canGoPrevious()}
						title="Sección anterior"
					>
						<ArrowLeftIcon />
					</button>
					<div className={styles.currentSectionTitle}>
						{scatSections.find(section => section.id === activeSection)?.title}
					</div>
					<button 
						className={`${styles.navArrow} ${!canGoNext() ? styles.disabled : ''}`}
						onClick={goToNextSection}
						disabled={!canGoNext()}
						title="Siguiente sección"
					>
						<ArrowRightIcon />
					</button>
				</div>
				
				<div className={styles.navigationButtons}>
					{scatSections.map((section, index) => (
						<button
							key={section.id}
							onClick={() => handleSectionClick(section.id)}
							className={`${styles.navButton} ${
								activeSection === section.id ? styles.activeButton : ""
							}`}
							title={section.title}
						>
							<div className={styles.navButtonNumber}>{index + 1}</div>
							<div className={styles.navButtonText}>{section.title}</div>
						</button>
					))}
				</div>
			</div>

			<div className={styles.contentArea}>
				<ActiveComponent />
			</div>

			<div className={styles.bottomNav}>
				<button 
					className={styles.iconButton}
					onClick={handleShowInfo}
					title="Información"
				>
					<InfoIcon />
				</button>
				<button 
					className={styles.iconButton}
					onClick={() => handleSaveProgress(false)}
					title="Guardar progreso"
				>
					<SaveIcon />
				</button>
				<button 
					className={`${styles.iconButton} ${styles.darkButton}`}
					onClick={handleShowGrid}
					title="Ver proyectos"
				>
					<GridIcon />
				</button>
				<button
					className={`${styles.iconButton} ${styles.darkButton} ${!canGoPrevious() ? styles.disabled : ''}`}
					onClick={goToPreviousSection}
					disabled={!canGoPrevious()}
					title="Sección anterior"
				>
					<ArrowLeftIcon />
				</button>
				<button 
					className={`${styles.iconButton} ${styles.darkButton} ${!canGoNext() ? styles.disabled : ''}`}
					onClick={goToNextSection}
					disabled={!canGoNext()}
					title="Siguiente sección"
				>
					<ArrowRightIcon />
				</button>
			</div>

			{/* Progress Indicator */}
			<div className={styles.progressIndicator}>
				<div className={styles.progressBar}>
					<div 
						className={styles.progressFill}
						style={{ width: `${((getCurrentSectionIndex() + 1) / scatSections.length) * 100}%` }}
					></div>
				</div>
				<div className={styles.progressText}>
					Progreso: {getCurrentSectionIndex() + 1}/{scatSections.length}
					{isEditing && <span className={styles.editingProgress}> (Editando)</span>}
				</div>
			</div>
		</div>
	);
}

export default ScatInterface;