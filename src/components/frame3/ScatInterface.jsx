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
	const [isInitialized, setIsInitialized] = useState(false);
	const [initializationError, setInitializationError] = useState(null);
	
	const { 
		setProjectData, 
		hasData, 
		resetAllData,
		loadProjectForEditing,
		setEditingState,
		// Agregar datos para debug
		evaluacionData,
		contactoData,
		causasInmediatasData,
		causasBasicasData,
		necesidadesControlData,
		isEditing: scatIsEditing
	} = useScatData();
	
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

	// Debug: Mostrar datos cargados
	useEffect(() => {
		console.log('=== SCAT INTERFACE - DATOS ACTUALES ===');
		console.log('isEditing (prop):', isEditing);
		console.log('editingActive (hook):', editingActive);
		console.log('scatIsEditing (context):', scatIsEditing);
		console.log('isInitialized:', isInitialized);
		console.log('evaluacionData:', evaluacionData);
		console.log('contactoData:', contactoData);
		console.log('causasInmediatasData:', causasInmediatasData);
		console.log('causasBasicasData:', causasBasicasData);
		console.log('necesidadesControlData:', necesidadesControlData);
	}, [isEditing, editingActive, scatIsEditing, isInitialized, evaluacionData, contactoData, causasInmediatasData, causasBasicasData, necesidadesControlData]);

	// Inicialización del componente - CORREGIDA
	useEffect(() => {
		console.log('=== INICIALIZANDO SCAT INTERFACE ===');
		console.log('FormData:', formData);
		console.log('IsEditing:', isEditing);
		console.log('EditingProject:', editingProject);
		console.log('IsInitialized:', isInitialized);
		
		// Evitar reinicialización múltiple
		if (isInitialized) {
			console.log('Ya está inicializado, saltando...');
			return;
		}

		const initializeInterface = async () => {
			try {
				setInitializationError(null);
				
				if (formData) {
					if (isEditing && editingProject) {
						// Modo edición: cargar proyecto completo
						console.log('=== MODO EDICIÓN - CARGANDO PROYECTO ===');
						console.log('Proyecto completo a cargar:', editingProject);
						
						// Limpiar datos anteriores primero
						resetAllData();
						
						// Pequeña pausa para asegurar que el reset se complete
						await new Promise(resolve => setTimeout(resolve, 100));
						
						// Cargar datos del proyecto en el contexto SCAT
						const loadSuccess = await loadProjectForEditing(editingProject);
						if (!loadSuccess) {
							throw new Error('Error cargando datos del proyecto en SCAT context');
						}
						
						// Iniciar modo edición en el hook
						await startProjectEditing(editingProject);
						
						console.log('=== PROYECTO CARGADO EXITOSAMENTE ===');
					} else {
						// Modo nuevo proyecto: cargar datos básicos
						console.log('=== MODO NUEVO PROYECTO ===');
						resetAllData();
						
						// Pequeña pausa
						await new Promise(resolve => setTimeout(resolve, 50));
						
						// Cargar datos básicos del formulario
						setProjectData(formData);
						setEditingState(false, null);
					}
				} else {
					// Sin datos: inicializar limpio
					console.log('=== SIN DATOS - INICIALIZACIÓN LIMPIA ===');
					resetAllData();
					setEditingState(false, null);
				}
				
				// Marcar como inicializado
				setIsInitialized(true);
				console.log('=== INICIALIZACIÓN COMPLETADA ===');
				
			} catch (error) {
				console.error('Error en inicialización:', error);
				setInitializationError(error.message);
				setIsInitialized(true); // Marcar como inicializado aunque haya error
			}
		};

		initializeInterface();
	}, [formData, isEditing, editingProject]); // Dependencias específicas

	// Navegación entre secciones - CORREGIDA
	const handleSectionClick = useCallback(async (sectionId) => {
		console.log('=== NAVEGANDO A SECCIÓN ===', sectionId);
		
		// Verificar que la sección existe
		const sectionExists = scatSections.find(section => section.id === sectionId);
		if (!sectionExists) {
			console.error('Sección no encontrada:', sectionId);
			return;
		}

		try {
			// Auto-guardar si estamos editando
			if (editingActive && hasUnsavedChanges) {
				console.log('Auto-guardando antes de cambiar sección...');
				await saveProgress(true); // Guardar silenciosamente
			}
			
			console.log('Cambiando a sección:', sectionId);
			setActiveSection(sectionId);
		} catch (error) {
			console.error('Error al cambiar de sección:', error);
		}
	}, [editingActive, hasUnsavedChanges, saveProgress]);

	// Función para obtener el índice de la sección actual - CORREGIDA
	const getCurrentSectionIndex = useCallback(() => {
		const index = scatSections.findIndex(section => section.id === activeSection);
		console.log('Índice de sección actual:', index, 'para sección:', activeSection);
		return index;
	}, [activeSection]);

	// Navegación a sección anterior - CORREGIDA
	const goToPreviousSection = useCallback(async () => {
		console.log('=== INTENTANDO IR A SECCIÓN ANTERIOR ===');
		
		const currentIndex = getCurrentSectionIndex();
		console.log('Índice actual:', currentIndex);
		
		if (currentIndex <= 0) {
			console.log('Ya estamos en la primera sección');
			return;
		}

		const previousSection = scatSections[currentIndex - 1];
		console.log('Sección anterior:', previousSection);

		try {
			if (editingActive && hasUnsavedChanges) {
				console.log('Auto-guardando antes de ir a sección anterior...');
				await saveProgress(true);
			}
			
			console.log('Navegando a sección anterior:', previousSection.id);
			setActiveSection(previousSection.id);
		} catch (error) {
			console.error('Error al ir a sección anterior:', error);
		}
	}, [getCurrentSectionIndex, editingActive, hasUnsavedChanges, saveProgress]);

	// Navegación a sección siguiente - CORREGIDA
	const goToNextSection = useCallback(async () => {
		console.log('=== INTENTANDO IR A SECCIÓN SIGUIENTE ===');
		
		const currentIndex = getCurrentSectionIndex();
		console.log('Índice actual:', currentIndex);
		console.log('Total de secciones:', scatSections.length);
		
		if (currentIndex >= scatSections.length - 1) {
			console.log('Ya estamos en la última sección');
			return;
		}

		const nextSection = scatSections[currentIndex + 1];
		console.log('Sección siguiente:', nextSection);

		try {
			if (editingActive && hasUnsavedChanges) {
				console.log('Auto-guardando antes de ir a sección siguiente...');
				await saveProgress(true);
			}
			
			console.log('Navegando a sección siguiente:', nextSection.id);
			setActiveSection(nextSection.id);
		} catch (error) {
			console.error('Error al ir a sección siguiente:', error);
		}
	}, [getCurrentSectionIndex, editingActive, hasUnsavedChanges, saveProgress]);

	// Funciones para verificar si se puede navegar - CORREGIDAS
	const canGoPrevious = useCallback(() => {
		const currentIndex = getCurrentSectionIndex();
		const canGo = currentIndex > 0;
		console.log('¿Puede ir atrás?', canGo, '(índice:', currentIndex, ')');
		return canGo;
	}, [getCurrentSectionIndex]);

	const canGoNext = useCallback(() => {
		const currentIndex = getCurrentSectionIndex();
		const canGo = currentIndex < scatSections.length - 1;
		console.log('¿Puede ir adelante?', canGo, '(índice:', currentIndex, 'de', scatSections.length - 1, ')');
		return canGo;
	}, [getCurrentSectionIndex]);

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
		if (!isInitialized) return { text: 'Inicializando...', class: styles.loading };
		if (isLoading) return { text: 'Cargando...', class: styles.loading };
		if (isSaving) return { text: 'Guardando...', class: styles.saving };
		if (isSaved) return { text: 'Guardado', class: styles.saved };
		if (hasError) return { text: 'Error', class: styles.error };
		if (hasUnsavedChanges) return { text: 'Sin guardar', class: styles.unsaved };
		return { text: 'Actualizado', class: styles.updated };
	};

	const statusIndicator = getStatusIndicator();

	// Variables para el estado de las flechas
	const isPreviousDisabled = !canGoPrevious() || isSaving || isLoading || !isInitialized;
	const isNextDisabled = !canGoNext() || isSaving || isLoading || !isInitialized;

	console.log('=== ESTADO DE NAVEGACIÓN ===');
	console.log('Sección activa:', activeSection);
	console.log('Índice actual:', getCurrentSectionIndex());
	console.log('Puede ir atrás:', canGoPrevious());
	console.log('Puede ir adelante:', canGoNext());
	console.log('Flecha anterior deshabilitada:', isPreviousDisabled);
	console.log('Flecha siguiente deshabilitada:', isNextDisabled);
	console.log('Inicializado:', isInitialized);

	// Mostrar pantalla de carga mientras se inicializa
	if (!isInitialized) {
		return (
			<div className={styles.container}>
				<div className={styles.loadingOverlay}>
					<div className={styles.loadingSpinner}></div>
					<p>Inicializando interfaz...</p>
					{isEditing && <p>Cargando datos del proyecto...</p>}
				</div>
			</div>
		);
	}

	// Mostrar error de inicialización si existe
	if (initializationError) {
		return (
			<div className={styles.container}>
				<div className={styles.errorBanner}>
					<span>Error de inicialización: {initializationError}</span>
					<button onClick={() => window.location.reload()}>Recargar</button>
				</div>
			</div>
		);
	}

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
						className={`${styles.navArrow} ${isPreviousDisabled ? styles.disabled : ''}`}
						onClick={goToPreviousSection}
						disabled={isPreviousDisabled}
						title={isPreviousDisabled ? 'No hay sección anterior' : 'Sección anterior'}
					>
						<ArrowLeftIcon />
					</button>
					<div className={styles.currentSectionTitle}>
						{scatSections.find(section => section.id === activeSection)?.title}
					</div>
					<button 
						className={`${styles.navArrow} ${isNextDisabled ? styles.disabled : ''}`}
						onClick={goToNextSection}
						disabled={isNextDisabled}
						title={isNextDisabled ? 'No hay sección siguiente' : 'Siguiente sección'}
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
							disabled={isSaving || isLoading || !isInitialized}
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
					disabled={isSaving || isLoading || !isInitialized}
				>
					<InfoIcon />
				</button>
				<button 
					className={styles.iconButton}
					onClick={handleSaveProgress}
					title="Guardar progreso"
					disabled={isLoading || !isInitialized}
				>
					{isSaving ? '...' : <SaveIcon />}
				</button>
				<button 
					className={`${styles.iconButton} ${styles.darkButton}`}
					onClick={handleShowGrid}
					title="Ver proyectos"
					disabled={isSaving || isLoading || !isInitialized}
				>
					<GridIcon />
				</button>
				<button
					className={`${styles.iconButton} ${styles.darkButton} ${isPreviousDisabled ? styles.disabled : ''}`}
					onClick={goToPreviousSection}
					disabled={isPreviousDisabled}
					title={isPreviousDisabled ? 'No hay sección anterior' : 'Sección anterior'}
				>
					<ArrowLeftIcon />
				</button>
				<button 
					className={`${styles.iconButton} ${styles.darkButton} ${isNextDisabled ? styles.disabled : ''}`}
					onClick={goToNextSection}
					disabled={isNextDisabled}
					title={isNextDisabled ? 'No hay sección siguiente' : 'Siguiente sección'}
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