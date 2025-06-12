"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./ScatInterface.module.css";
import EvaluacionContent from "./content/EvaluacionContent";
import ContactoContent from "./content/ContactoContent";
import CausasInmediatasContent from "./content/CausasInmediatasContent";
import CausasBasicasContent from "./content/CausasBasicasContent";
import NecesidadesControlContent from "./content/NecesidadesControlContent";
import { useScatData } from "../../contexts/ScatContext";
import { useProjectEditing } from "../../hooks/useProjectEditing";
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
	formData, 
	editingProject, 
	isEditing = false
}) {
	const [activeSection, setActiveSection] = useState("evaluacion");
	const { setProjectData, hasData, resetAllData } = useScatData();
	
	const {
		isEditing: editingActive,
		projectData: currentProjectData,
		status,
		hasUnsavedChanges,
		startProjectEditing,
		finishProjectEditing,
		saveProgress,
		canExit,
		isLoading,
		isSaving,
		isSaved,
		hasError,
		error,
		EDITING_STATES
	} = useProjectEditing();

	// Inicialización del componente
	useEffect(() => {
		console.log('=== INICIALIZANDO SCAT INTERFACE ===');
		console.log('FormData:', formData);
		console.log('IsEditing:', isEditing);
		console.log('EditingProject:', editingProject);
		
		const initializeInterface = async () => {
			if (formData) {
				if (isEditing && editingProject) {
					// Modo edición: iniciar edición del proyecto
					console.log('Iniciando modo edición...');
					const success = await startProjectEditing(editingProject);
					if (!success) {
						console.error('Error iniciando edición');
						alert('Error al cargar el proyecto para edición');
					}
				} else {
					// Modo nuevo proyecto: cargar datos básicos
					console.log('Modo nuevo proyecto...');
					resetAllData();
					setProjectData(formData);
				}
			}
		};

		initializeInterface();
	}, [formData, isEditing, editingProject, startProjectEditing, resetAllData, setProjectData]);

	// Navegación entre secciones
	const handleSectionClick = useCallback(async (sectionId) => {
		// Auto-guardar si estamos editando
		if (editingActive && hasUnsavedChanges) {
			await saveProgress(true); // Guardar silenciosamente
		}
		setActiveSection(sectionId);
	}, [editingActive, hasUnsavedChanges, saveProgress]);

	const getCurrentSectionIndex = () => {
		return scatSections.findIndex(section => section.id === activeSection);
	};

	const goToPreviousSection = useCallback(async () => {
		const currentIndex = getCurrentSectionIndex();
		if (currentIndex > 0) {
			if (editingActive && hasUnsavedChanges) {
				await saveProgress(true);
			}
			setActiveSection(scatSections[currentIndex - 1].id);
		}
	}, [editingActive, hasUnsavedChanges, saveProgress]);

	const goToNextSection = useCallback(async () => {
		const currentIndex = getCurrentSectionIndex();
		if (currentIndex < scatSections.length - 1) {
			if (editingActive && hasUnsavedChanges) {
				await saveProgress(true);
			}
			setActiveSection(scatSections[currentIndex + 1].id);
		}
	}, [editingActive, hasUnsavedChanges, saveProgress]);

	const canGoPrevious = () => getCurrentSectionIndex() > 0;
	const canGoNext = () => getCurrentSectionIndex() < scatSections.length - 1;

	// Navegación principal
	const handleBackToMenu = useCallback(async () => {
		console.log('=== NAVEGANDO AL MENÚ PRINCIPAL ===');
		
		if (editingActive) {
			if (!canExit()) {
				return; // Usuario canceló
			}
			
			console.log('Finalizando edición...');
			const success = await finishProjectEditing(hasUnsavedChanges);
			if (!success) {
				alert('Error al guardar los cambios. ¿Desea salir sin guardar?');
				if (!window.confirm('¿Salir sin guardar?')) {
					return;
				}
				await finishProjectEditing(false); // Salir sin guardar
			}
		} else {
			resetAllData();
		}
		
		if (onNavigateToBase) {
			onNavigateToBase();
		}
	}, [editingActive, canExit, finishProjectEditing, hasUnsavedChanges, resetAllData, onNavigateToBase]);

	const handleShowGrid = useCallback(async () => {
		console.log('=== NAVEGANDO A PROYECTOS ===');
		
		if (editingActive) {
			if (!canExit()) {
				return;
			}
			
			const success = await finishProjectEditing(hasUnsavedChanges);
			if (!success) {
				alert('Error al guardar los cambios. ¿Desea continuar sin guardar?');
				if (!window.confirm('¿Continuar sin guardar?')) {
					return;
				}
				await finishProjectEditing(false);
			}
		} else {
			resetAllData();
		}
		
		if (onNavigateToProjects) {
			onNavigateToProjects();
		}
	}, [editingActive, canExit, finishProjectEditing, hasUnsavedChanges, resetAllData, onNavigateToProjects]);

	const handleCompleteAnalysis = useCallback(async () => {
		console.log('=== COMPLETANDO ANÁLISIS ===');
		
		if (!hasData()) {
			alert("Por favor, complete al menos una sección antes de finalizar el análisis.");
			return;
		}
		
		if (editingActive) {
			console.log('Finalizando edición antes de completar...');
			const success = await finishProjectEditing(true); // Siempre guardar al finalizar
			if (!success) {
				alert('Error al guardar los cambios finales.');
				return;
			}
		}
		
		if (onNavigateToDescription) {
			onNavigateToDescription();
		}
	}, [hasData, editingActive, finishProjectEditing, onNavigateToDescription]);

	// Funciones de utilidad
	const handleSaveProgress = useCallback(async () => {
		if (editingActive) {
			const success = await saveProgress(false);
			if (success) {
				alert('Progreso guardado exitosamente');
			} else {
				alert('Error al guardar el progreso');
			}
		} else {
			alert('Progreso guardado localmente');
		}
	}, [editingActive, saveProgress]);

	const handleShowInfo = () => {
		const currentSection = scatSections.find(section => section.id === activeSection);
		alert(`Información sobre: ${currentSection?.title}`);
	};

	// Obtener el componente activo
	const ActiveComponent = scatSections.find((section) => section.id === activeSection)?.component || EvaluacionContent;

	// Obtener el estado visual
	const getStatusIndicator = () => {
		if (isLoading) return { text: 'Cargando...', class: styles.loading };
		if (isSaving) return { text: 'Guardando...', class: styles.saving };
		if (isSaved) return { text: 'Guardado', class: styles.saved };
		if (hasError) return { text: 'Error', class: styles.error };
		if (hasUnsavedChanges) return { text: 'Sin guardar', class: styles.unsaved };
		return { text: 'Actualizado', class: styles.updated };
	};

	const statusIndicator = getStatusIndicator();

	return (
		<div className={styles.container}>
			{/* Header */}
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<div className={styles.headerLeft}>
						<button 
							className={styles.backToMenuButton}
							onClick={handleBackToMenu}
							title="Volver al menú principal"
							disabled={isSaving || isLoading}
						>
							{isSaving ? 'Guardando...' : '← Menú Principal'}
						</button>
						{editingActive && (
							<div className={styles.editingIndicator}>
								<span className={styles.editingBadge}>EDITANDO</span>
								<span className={styles.editingText}>
									{currentProjectData?.name || editingProject?.name || 'Proyecto'}
								</span>
								<span className={`${styles.statusIndicator} ${statusIndicator.class}`}>
									{statusIndicator.text}
								</span>
							</div>
						)}
					</div>
					<div className={styles.headerCenter}>
						{/* Espacio para título si es necesario */}
					</div>
					<div className={styles.headerRight}>
						<div className={styles.sectionCounter}>
							{getCurrentSectionIndex() + 1} de {scatSections.length}
						</div>
						<button 
							className={styles.completeButton}
							onClick={handleCompleteAnalysis}
							title="Finalizar análisis y ver resumen"
							disabled={isSaving || isLoading}
						>
							{isSaving ? 'Guardando...' : (editingActive ? 'Guardar y Finalizar' : 'Finalizar Análisis')}
						</button>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<div className={styles.navigationContainer}>
				<div className={styles.navigationHeader}>
					<button 
						className={`${styles.navArrow} ${!canGoPrevious() ? styles.disabled : ''}`}
						onClick={goToPreviousSection}
						disabled={!canGoPrevious() || isSaving || isLoading}
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
						disabled={!canGoNext() || isSaving || isLoading}
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
							disabled={isSaving || isLoading}
						>
							<div className={styles.navButtonNumber}>{index + 1}</div>
							<div className={styles.navButtonText}>{section.title}</div>
						</button>
					))}
				</div>
			</div>

			{/* Content Area */}
			<div className={styles.contentArea}>
				{isLoading ? (
					<div className={styles.loadingOverlay}>
						<div className={styles.loadingSpinner}></div>
						<p>Cargando proyecto...</p>
					</div>
				) : (
					<ActiveComponent />
				)}
			</div>

			{/* Bottom Navigation */}
			<div className={styles.bottomNav}>
				<button 
					className={styles.iconButton}
					onClick={handleShowInfo}
					title="Información"
					disabled={isSaving || isLoading}
				>
					<InfoIcon />
				</button>
				<button 
					className={styles.iconButton}
					onClick={handleSaveProgress}
					title="Guardar progreso"
					disabled={isLoading}
				>
					{isSaving ? '...' : <SaveIcon />}
				</button>
				<button 
					className={`${styles.iconButton} ${styles.darkButton}`}
					onClick={handleShowGrid}
					title="Ver proyectos"
					disabled={isSaving || isLoading}
				>
					<GridIcon />
				</button>
				<button
					className={`${styles.iconButton} ${styles.darkButton} ${!canGoPrevious() ? styles.disabled : ''}`}
					onClick={goToPreviousSection}
					disabled={!canGoPrevious() || isSaving || isLoading}
					title="Sección anterior"
				>
					<ArrowLeftIcon />
				</button>
				<button 
					className={`${styles.iconButton} ${styles.darkButton} ${!canGoNext() ? styles.disabled : ''}`}
					onClick={goToNextSection}
					disabled={!canGoNext() || isSaving || isLoading}
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
					{editingActive && (
						<span className={styles.editingProgress}>
							{' '}(Editando - {statusIndicator.text})
						</span>
					)}
				</div>
			</div>

			{/* Error Display */}
			{hasError && error && (
				<div className={styles.errorBanner}>
					<span>Error: {error}</span>
					<button onClick={() => window.location.reload()}>Recargar</button>
				</div>
			)}
		</div>
	);
}

export default ScatInterface;