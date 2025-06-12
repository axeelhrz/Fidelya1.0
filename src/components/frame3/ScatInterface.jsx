"use client";

import { useState, useEffect, useCallback } from "react";
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

export default function ScatInterface({ 
	onNavigateToBase, 
	onNavigateToProjects, 
	onNavigateToDescription, 
	formData
}) {
	const [activeSection, setActiveSection] = useState("evaluacion");
	const [isInitialized, setIsInitialized] = useState(false);
	const [isViewingMode, setIsViewingMode] = useState(false);
	const [isEditingMode, setIsEditingMode] = useState(false);
	const [editingProjectId, setEditingProjectId] = useState(null);
	const [initializationError, setInitializationError] = useState(null);

	const { 
		setProjectData, 
		hasData, 
		resetAllData,
		loadProjectData,
		getCompleteSummary,
		projectData,
		evaluacionData,
		contactoData,
		causasInmediatasData,
		causasBasicasData,
		necesidadesControlData,
		currentProjectId,
		forceSave
	} = useScatData();

	// Función para guardar datos SCAT SOLO en proyecto existente (NO CREAR NUEVOS)
	const saveScatDataToProject = useCallback(async () => {
		console.log('=== GUARDANDO DATOS SCAT EN PROYECTO EXISTENTE ===');
		
		// CRÍTICO: Solo guardar si hay un proyecto actual, NUNCA crear nuevos
		if (!currentProjectId) {
			console.log('No hay proyecto actual para guardar datos SCAT. No se creará proyecto automáticamente.');
			return false;
		}

		try {
			// Usar la función forceSave del contexto que ya maneja el guardado
			forceSave();
			console.log('=== DATOS SCAT GUARDADOS EN PROYECTO EXISTENTE ===');
			return true;
		} catch (error) {
			console.error('Error guardando datos SCAT:', error);
			return false;
		}
	}, [currentProjectId, forceSave]);

	// Función para guardar proyecto editado
	const saveEditedProject = useCallback(async () => {
		if (!isEditingMode || !editingProjectId) {
			console.log('No está en modo edición o no hay proyecto ID');
			return false;
		}

		try {
			console.log('=== GUARDANDO PROYECTO EDITADO ===');
			console.log('Proyecto ID:', editingProjectId);

			// Obtener resumen completo
			const completeSummary = getCompleteSummary();
			console.log('Resumen completo para guardar:', completeSummary);

			// Obtener proyectos del localStorage
			const savedProjects = localStorage.getItem('scatProjects');
			if (!savedProjects) {
				console.log('No hay proyectos guardados');
				return false;
			}

			const projects = JSON.parse(savedProjects);
			const projectIndex = projects.findIndex(p => p.id === editingProjectId);
			
			if (projectIndex === -1) {
				console.log('Proyecto no encontrado para editar');
				return false;
			}

			// Actualizar proyecto existente
			const updatedProject = {
				...projects[projectIndex],
				formData: completeSummary.project,
				scatData: {
					evaluacion: completeSummary.evaluacion,
					contacto: completeSummary.contacto,
					causasInmediatas: completeSummary.causasInmediatas,
					causasBasicas: completeSummary.causasBasicas,
					necesidadesControl: completeSummary.necesidadesControl
				},
				lastModified: new Date().toISOString(),
				version: (projects[projectIndex].version || 1) + 1
			};

			projects[projectIndex] = updatedProject;
			
			// Guardar en localStorage
			localStorage.setItem('scatProjects', JSON.stringify(projects));
			
			console.log('=== PROYECTO EDITADO GUARDADO EXITOSAMENTE ===');
			return true;
		} catch (error) {
			console.error('Error guardando proyecto editado:', error);
			return false;
		}
	}, [isEditingMode, editingProjectId, getCompleteSummary]);

	// Función para manejar guardado manual
	const handleSaveProgress = useCallback(async () => {
		console.log('=== GUARDADO MANUAL SOLICITADO ===');
		
		if (isEditingMode) {
			// Modo edición: guardar proyecto editado
			const success = await saveEditedProject();
			if (success) {
				alert('Progreso guardado exitosamente');
			} else {
				alert('Error al guardar el progreso');
			}
		} else if (currentProjectId) {
			// Proyecto existente: guardar datos SCAT
			const success = await saveScatDataToProject();
			if (success) {
				alert('Progreso guardado exitosamente');
			} else {
				alert('Error al guardar el progreso');
			}
		} else {
			// Sin proyecto: guardar temporalmente
			console.log('Guardando datos temporalmente (sin proyecto)');
			const currentData = getCompleteSummary();
			localStorage.setItem('scatData', JSON.stringify(currentData));
			alert('Progreso guardado temporalmente');
		}
	}, [isEditingMode, currentProjectId, saveEditedProject, saveScatDataToProject, getCompleteSummary]);

	// Función para completar análisis
	const handleCompleteAnalysis = useCallback(async () => {
		console.log('=== COMPLETANDO ANÁLISIS ===');
		
		if (isViewingMode) {
			// Modo visualización: ir directamente a descripción
			console.log('Modo visualización - navegando a descripción');
			if (onNavigateToDescription) {
				onNavigateToDescription(projectData);
			}
			return;
		}

		// Guardar progreso antes de completar
		if (isEditingMode) {
			await saveEditedProject();
		} else if (currentProjectId) {
			await saveScatDataToProject();
		}

		// Navegar a descripción
		if (onNavigateToDescription) {
			onNavigateToDescription(projectData);
		}
	}, [isViewingMode, isEditingMode, currentProjectId, projectData, onNavigateToDescription, saveEditedProject, saveScatDataToProject]);

	// Debug de estados
	useEffect(() => {
		console.log('=== SCAT INTERFACE - DATOS ACTUALES ===');
		console.log('isViewingMode:', isViewingMode);
		console.log('isEditingMode:', isEditingMode);
		console.log('isInitialized:', isInitialized);
		console.log('editingProjectId:', editingProjectId);
		console.log('currentProjectId:', currentProjectId);
		console.log('projectData:', projectData);
		console.log('evaluacionData:', evaluacionData);
		console.log('contactoData:', contactoData);
		console.log('causasInmediatasData:', causasInmediatasData);
		console.log('causasBasicasData:', causasBasicasData);
		console.log('necesidadesControlData:', necesidadesControlData);
	}, [isViewingMode, isEditingMode, isInitialized, editingProjectId, currentProjectId, projectData, evaluacionData, contactoData, causasInmediatasData, causasBasicasData, necesidadesControlData]);

	// Inicialización del componente
	useEffect(() => {
		console.log('=== INICIALIZANDO SCAT INTERFACE ===');
		console.log('FormData:', formData);

		if (isInitialized) {
			console.log('Ya está inicializado, saltando...');
			return;
		}

		const initializeInterface = async () => {
			try {
				setInitializationError(null);

				if (formData) {
					if (formData.isViewing && formData.projectData) {
						// Modo visualización: cargar proyecto completo en solo lectura
						console.log('=== MODO VISUALIZACIÓN ===');
						console.log('Proyecto a visualizar:', formData.projectData);
						
						resetAllData();
						await new Promise(resolve => setTimeout(resolve, 100));
						
						const loadSuccess = loadProjectData(formData.projectData);
						if (!loadSuccess) {
							throw new Error('Error cargando datos del proyecto');
						}
						
						setIsViewingMode(true);
						setIsEditingMode(false);
						setEditingProjectId(null);
						console.log('=== PROYECTO CARGADO PARA VISUALIZACIÓN ===');
					} else if (formData.isEditing && formData.projectData) {
						// Modo edición: cargar proyecto para editar
						console.log('=== MODO EDICIÓN ===');
						console.log('Proyecto a editar:', formData.projectData);
						
						resetAllData();
						await new Promise(resolve => setTimeout(resolve, 100));
						
						const loadSuccess = loadProjectData(formData.projectData);
						if (!loadSuccess) {
							throw new Error('Error cargando datos del proyecto para edición');
						}
						
						setIsViewingMode(false);
						setIsEditingMode(true);
						setEditingProjectId(formData.projectData.id);
						console.log('=== PROYECTO CARGADO PARA EDICIÓN ===');
					} else {
						// Nuevo proyecto o continuación: establecer datos del formulario
						console.log('=== NUEVO PROYECTO O CONTINUACIÓN ===');
						console.log('Datos del formulario:', formData);
						
						// NO resetear si hay datos existentes (continuación)
						if (!hasData()) {
							resetAllData();
							await new Promise(resolve => setTimeout(resolve, 100));
						}
						
						setProjectData(formData);
						setIsViewingMode(false);
						setIsEditingMode(false);
						setEditingProjectId(null);
						console.log('=== DATOS DEL FORMULARIO ESTABLECIDOS ===');
					}
				} else {
					// Sin datos: inicializar limpio
					console.log('=== SIN DATOS - INICIALIZACIÓN LIMPIA ===');
					resetAllData();
					setIsViewingMode(false);
					setIsEditingMode(false);
					setEditingProjectId(null);
				}

				setIsInitialized(true);
				console.log('=== INICIALIZACIÓN COMPLETADA ===');
			} catch (error) {
				console.error('Error en inicialización:', error);
				setInitializationError(error.message);
				setIsInitialized(true);
			}
		};

		initializeInterface();
	}, [formData, isInitialized, resetAllData, setProjectData, loadProjectData, hasData]);

	// Navegación entre secciones
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

	// Renderizar contenido de la sección activa
	const renderActiveSection = () => {
		const currentSection = scatSections.find(section => section.id === activeSection);
		if (!currentSection) return null;

		const SectionComponent = currentSection.component;
		return <SectionComponent />;
	};

	// Manejar errores de inicialización
	if (initializationError) {
		return (
			<div className={styles.container}>
				<div className={styles.errorBanner}>
					<h3>Error de Inicialización</h3>
					<p>{initializationError}</p>
					<button onClick={() => window.location.reload()}>
						Recargar Página
					</button>
				</div>
			</div>
		);
	}

	// Mostrar loading si no está inicializado
	if (!isInitialized) {
		return (
			<div className={styles.container}>
				<div className={styles.loadingOverlay}>
					<div className={styles.loadingSpinner}></div>
					<p>Inicializando formulario SCAT...</p>
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
							onClick={onNavigateToBase}
							title="Volver al menú principal"
						>
							← Menú
						</button>
						
						{isEditingMode && (
							<div className={styles.editingIndicator}>
								<span className={styles.editingBadge}>Editando</span>
								<span className={styles.editingText}>Proyecto ID: {editingProjectId}</span>
							</div>
						)}
						
						{isViewingMode && (
							<div className={styles.viewingIndicator}>
								<span className={styles.viewingBadge}>Visualizando</span>
								<span className={styles.viewingText}>Modo solo lectura</span>
							</div>
						)}
					</div>

					<div className={styles.headerRight}>
						<div className={styles.sectionCounter}>
							{getCurrentSectionIndex() + 1} de {scatSections.length}
						</div>
						<button 
							className={styles.completeButton}
							onClick={handleCompleteAnalysis}
							title="Finalizar análisis y ver resumen (guarda automáticamente)"
							disabled={isViewingMode && !hasData()}
						>
							{isViewingMode ? 'Ver Resumen' : 'Finalizar Análisis'}
						</button>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<div className={styles.navigationContainer}>
				<div className={styles.navigationHeader}>
					<button 
						className={styles.navArrow}
						onClick={goToPreviousSection}
						disabled={getCurrentSectionIndex() === 0}
						title="Sección anterior"
					>
						<ArrowLeftIcon />
					</button>
					
					<h2 className={styles.currentSectionTitle}>
						{scatSections.find(s => s.id === activeSection)?.title}
					</h2>
					
					<button 
						className={styles.navArrow}
						onClick={goToNextSection}
						disabled={getCurrentSectionIndex() === scatSections.length - 1}
						title="Siguiente sección"
					>
						<ArrowRightIcon />
					</button>
				</div>

				<div className={styles.navigationButtons}>
					{scatSections.map((section, index) => (
						<button
							key={section.id}
							className={`${styles.navButton} ${activeSection === section.id ? styles.active : ''}`}
							onClick={() => setActiveSection(section.id)}
							title={section.title}
						>
							{index + 1}. {section.id.replace('-', ' ').toUpperCase()}
						</button>
					))}
				</div>
			</div>

			{/* Content Area */}
			<div className={styles.contentArea}>
				{renderActiveSection()}
			</div>

			{/* Bottom Navigation */}
			<div className={styles.bottomNav}>
				<button 
					className={styles.iconButton}
					onClick={() => alert('Información sobre SCAT')}
					title="Información"
				>
					<InfoIcon />
				</button>
				
				<button 
					className={styles.iconButton}
					onClick={handleSaveProgress}
					title="Guardar progreso"
					disabled={isViewingMode}
				>
					<SaveIcon />
				</button>
				
				<button 
					className={styles.iconButton}
					onClick={onNavigateToProjects}
					title="Ver proyectos"
				>
					<GridIcon />
				</button>
			</div>
		</div>
	);
}