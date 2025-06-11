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
		setEditingState,
		resetAllData,
		loadProjectForEditing
	} = useScatData();

	// Cargar datos del proyecto cuando se reciban
	useEffect(() => {
		console.log('=== EFECTO DE CARGA DE DATOS EN SCAT INTERFACE ===');
		console.log('FormData:', formData);
		console.log('IsEditing:', isEditing);
		console.log('EditingProject:', editingProject);
		
		if (formData) {
			if (isEditing && editingProject) {
				// Modo edición: cargar datos completos del proyecto
				console.log('Cargando proyecto para edición...');
				loadProjectForEditing(editingProject);
			} else {
				// Modo nuevo proyecto: solo cargar datos básicos
				console.log('Cargando datos para nuevo proyecto...');
				setProjectData(formData);
				setEditingState(false, null);
			}
		}
	}, [formData, isEditing, editingProject, setProjectData, setEditingState, loadProjectForEditing]);

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
		console.log('=== VOLVIENDO AL MENÚ PRINCIPAL ===');
		
		// Si estamos editando, guardar los cambios silenciosamente antes de salir
		if (isEditing && editingProject) {
			console.log('Guardando cambios antes de salir...');
			handleSaveProgress(true, true); // true para isExiting, true para silent
		}
		
		// Limpiar COMPLETAMENTE el contexto
		console.log('Reseteando contexto completamente...');
		resetAllData();
		
		if (onNavigateToBase) {
			onNavigateToBase();
		}
	};

	const handleSaveProgress = (isExiting = false, silent = false) => {
		try {
			console.log('=== GUARDANDO PROGRESO ===');
			console.log('IsExiting:', isExiting);
			console.log('Silent:', silent);
			
			// Obtener todos los datos actuales del contexto
			const completeSummary = getCompleteSummary();

			if (isEditing && editingProject) {
				console.log('Guardando proyecto en modo edición...');
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

				// Actualizar en localStorage
				const savedProjects = localStorage.getItem('scatProjects');
				if (savedProjects) {
					const projects = JSON.parse(savedProjects);
					const updatedProjects = projects.map(p => 
						p.id === editingProject.id ? updatedProject : p
					);
					localStorage.setItem('scatProjects', JSON.stringify(updatedProjects));
					console.log('Proyecto actualizado en localStorage');
				}

				// Llamar callback si existe
				if (onSaveProject) {
					onSaveProject(updatedProject);
				}

				if (!silent) {
					alert(isExiting ? "Cambios guardados exitosamente" : "Progreso guardado exitosamente");
				}
			} else {
				// Nuevo proyecto o modo visualización
				console.log('Guardando en modo nuevo proyecto...');
				if (!isExiting && !silent) {
					alert("Progreso guardado exitosamente");
				}
			}
		} catch (error) {
			console.error('Error guardando progreso:', error);
			if (!silent) {
				alert("Error al guardar el progreso");
			}
		}
	};

	const handleShowInfo = () => {
		const currentSection = scatSections.find(section => section.id === activeSection);
		alert(`Información sobre: ${currentSection?.title}`);
	};

	const handleShowGrid = () => {
		console.log('=== NAVEGANDO A GRID DE PROYECTOS ===');
		
		// Si estamos editando, guardar antes de navegar
		if (isEditing && editingProject) {
			console.log('Guardando antes de navegar a grid...');
			handleSaveProgress(true, true); // Guardar silenciosamente
		}
		
		// Limpiar COMPLETAMENTE el contexto
		console.log('Reseteando contexto completamente...');
		resetAllData();
		
		if (onNavigateToProjects) {
			onNavigateToProjects();
		}
	};

	const handleCompleteAnalysis = () => {
		console.log('=== COMPLETANDO ANÁLISIS ===');
		
		if (hasData()) {
			// Si estamos editando, guardar antes de finalizar
			if (isEditing && editingProject) {
				console.log('Guardando antes de finalizar...');
				handleSaveProgress(true, true); // Guardar silenciosamente
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