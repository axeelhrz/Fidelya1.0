"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./AccidentForm.module.css";
import { useScatData } from "../contexts/ScatContext";

export default function AccidentFormModal({ isOpen, onClose, onCreateProject, onContinue }) {
	const { setProjectData, getCompleteSummary, resetAllData, setCurrentProject } = useScatData();
	const [formData, setFormData] = useState({
		evento: "",
		involucrado: "",
		area: "",
		fechaHora: "",
		investigador: "",
		otrosDatos: "",
	});

	const [errors, setErrors] = useState({});
	const hasInitialized = useRef(false);
	const isCreatingProject = useRef(false);

	// Limpiar formulario cuando se abre el modal
	useEffect(() => {
		if (isOpen && !hasInitialized.current) {
			console.log('=== MODAL ABIERTO - INICIALIZANDO FORMULARIO LIMPIO ===');
			resetForm();
			hasInitialized.current = true;
			isCreatingProject.current = false;
		} else if (!isOpen) {
			hasInitialized.current = false;
			isCreatingProject.current = false;
		}
	}, [isOpen]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.evento.trim()) {
			newErrors.evento = "El evento es requerido";
		}

		if (!formData.involucrado.trim()) {
			newErrors.involucrado = "El involucrado es requerido";
		}

		if (!formData.area.trim()) {
			newErrors.area = "El área es requerida";
		}

		if (!formData.fechaHora.trim()) {
			newErrors.fechaHora = "La fecha y hora son requeridas";
		}

		if (!formData.investigador.trim()) {
			newErrors.investigador = "El investigador es requerido";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// FUNCIÓN SIMPLIFICADA PARA CREAR PROYECTO CON TODOS LOS DATOS
	const createSingleProject = (dataToSave) => {
		if (isCreatingProject.current) {
			console.log('Ya se está creando un proyecto, saltando...');
			return null;
		}

		isCreatingProject.current = true;

		console.log('=== CREANDO PROYECTO CON TODOS LOS DATOS ===');
		console.log('Datos del formulario:', dataToSave);

		// Obtener datos SCAT actuales del contexto
		const currentSummary = getCompleteSummary();
		console.log('Resumen completo actual:', currentSummary);

		// Crear un nuevo proyecto con ID único y TODOS los datos
		const newProject = {
			id: Date.now(),
			name: dataToSave.evento,
			description: dataToSave.otrosDatos || `Involucrado: ${dataToSave.involucrado} - Área: ${dataToSave.area}`,
			createdAt: new Date().toISOString(),
			
			// CRÍTICO: Guardar TODOS los datos del formulario
			formData: {
				evento: dataToSave.evento,
				involucrado: dataToSave.involucrado,
				area: dataToSave.area,
				fechaHora: dataToSave.fechaHora,
				investigador: dataToSave.investigador,
				otrosDatos: dataToSave.otrosDatos
			},
			
			// CRÍTICO: Guardar TODOS los datos SCAT (incluso si están vacíos)
			scatData: {
				evaluacion: currentSummary.evaluacion || {
					severity: null,
					probability: null,
					frequency: null
				},
				contacto: currentSummary.contacto || {
					selectedIncidents: [],
					image: null,
					observation: ''
				},
				causasInmediatas: currentSummary.causasInmediatas || {
					actos: {
						selectedItems: [],
						image: null,
						observation: ''
					},
					condiciones: {
						selectedItems: [],
						image: null,
						observation: ''
					}
				},
				causasBasicas: currentSummary.causasBasicas || {
					personales: {
						selectedItems: [],
						detailedSelections: {},
						image: null,
						observation: ''
					},
					laborales: {
						selectedItems: [],
						detailedSelections: {},
						image: null,
						observation: ''
					}
				},
				necesidadesControl: currentSummary.necesidadesControl || {
					selectedItems: [],
					detailedData: {},
					globalImage: null,
					globalObservation: '',
					medidasCorrectivas: ''
				}
			},
			
			// Metadatos
			status: 'active',
			lastModified: new Date().toISOString(),
			version: 1,
			isReal: true,
			isExample: false,
			isSimulated: false
		};

		console.log('=== PROYECTO CREADO CON ESTRUCTURA COMPLETA ===');
		console.log('Proyecto completo:', newProject);

		// Guardar proyecto en localStorage
		try {
			const existingProjects = localStorage.getItem('scatProjects');
			const projects = existingProjects ? JSON.parse(existingProjects) : [];
			
			// Verificar que no existe ya un proyecto con el mismo ID
			const existingProject = projects.find(p => p.id === newProject.id);
			if (existingProject) {
				console.log('Proyecto ya existe, no se creará duplicado');
				return existingProject;
			}
			
			const updatedProjects = [newProject, ...projects];
			localStorage.setItem('scatProjects', JSON.stringify(updatedProjects));
			
			console.log('=== PROYECTO GUARDADO EN LOCALSTORAGE ===');
			console.log('Proyectos actualizados:', updatedProjects);
		} catch (error) {
			console.error('Error guardando proyecto en localStorage:', error);
			isCreatingProject.current = false;
			return null;
		}

		// Establecer proyecto actual en el contexto
		setCurrentProject(newProject.id);

		// Llamar al callback para actualizar la UI del dashboard
		if (onCreateProject) {
			onCreateProject(newProject);
		}

		return newProject;
	};

	const handleSaveOnly = (e) => {
		e.preventDefault();

		if (validateForm()) {
			console.log('=== GUARDAR SOLO ===');
			
			const createdProject = createSingleProject(formData);
			
			if (createdProject) {
				resetForm();
				onClose();
				alert('Proyecto creado exitosamente y guardado en el dashboard.');
			} else {
				alert('Error al crear el proyecto. Por favor, intente nuevamente.');
			}
		}
	};

	const handleSaveAndContinue = (e) => {
		e.preventDefault();

		if (validateForm()) {
			console.log('=== GUARDAR Y CONTINUAR ===');
			
			const dataToSave = { ...formData };
			const newProject = createSingleProject(dataToSave);
			
			if (newProject) {
				console.log('Proyecto creado para continuar:', newProject);
				
				// Establecer datos del proyecto en el contexto
				setProjectData(dataToSave);
				
				setTimeout(() => {
					resetForm();
					
					if (onContinue) {
						console.log('Navegando al SCAT con datos:', dataToSave);
						onContinue(dataToSave);
					}
				}, 100);
			} else {
				alert('Error al crear el proyecto. Por favor, intente nuevamente.');
			}
		}
	};

	const resetForm = () => {
		setFormData({
			evento: "",
			involucrado: "",
			area: "",
			fechaHora: "",
			investigador: "",
			otrosDatos: "",
		});
		setErrors({});
		isCreatingProject.current = false;
	};

	const handleCancel = () => {
		resetForm();
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<div className={styles.modalHeader}>
					<h2 className={styles.modalTitle}>Nuevo Reporte de Accidente/Incidente</h2>
					<button className={styles.closeButton} onClick={handleCancel}>
						×
					</button>
				</div>

				<form className={styles.form}>
					<div className={styles.formGrid}>
						<div className={styles.formGroup}>
							<label htmlFor="evento" className={styles.label}>
								Evento *
							</label>
							<input
								type="text"
								id="evento"
								name="evento"
								value={formData.evento}
								onChange={handleInputChange}
								className={`${styles.input} ${errors.evento ? styles.inputError : ""}`}
								placeholder="Descripción del evento"
							/>
							{errors.evento && (
								<span className={styles.errorMessage}>{errors.evento}</span>
							)}
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="involucrado" className={styles.label}>
								Involucrado *
							</label>
							<input
								type="text"
								id="involucrado"
								name="involucrado"
								value={formData.involucrado}
								onChange={handleInputChange}
								className={`${styles.input} ${errors.involucrado ? styles.inputError : ""}`}
								placeholder="Persona involucrada"
							/>
							{errors.involucrado && (
								<span className={styles.errorMessage}>{errors.involucrado}</span>
							)}
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="area" className={styles.label}>
								Área *
							</label>
							<input
								type="text"
								id="area"
								name="area"
								value={formData.area}
								onChange={handleInputChange}
								className={`${styles.input} ${errors.area ? styles.inputError : ""}`}
								placeholder="Área donde ocurrió"
							/>
							{errors.area && (
								<span className={styles.errorMessage}>{errors.area}</span>
							)}
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="fechaHora" className={styles.label}>
								Fecha y Hora *
							</label>
							<input
								type="datetime-local"
								id="fechaHora"
								name="fechaHora"
								value={formData.fechaHora}
								onChange={handleInputChange}
								className={`${styles.input} ${errors.fechaHora ? styles.inputError : ""}`}
							/>
							{errors.fechaHora && (
								<span className={styles.errorMessage}>{errors.fechaHora}</span>
							)}
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="investigador" className={styles.label}>
								Investigador *
							</label>
							<input
								type="text"
								id="investigador"
								name="investigador"
								value={formData.investigador}
								onChange={handleInputChange}
								className={`${styles.input} ${errors.investigador ? styles.inputError : ""}`}
								placeholder="Nombre del investigador"
							/>
							{errors.investigador && (
								<span className={styles.errorMessage}>{errors.investigador}</span>
							)}
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="otrosDatos" className={styles.label}>
								Otros Datos
							</label>
							<textarea
								id="otrosDatos"
								name="otrosDatos"
								value={formData.otrosDatos}
								onChange={handleInputChange}
								className={styles.textarea}
								placeholder="Información adicional relevante"
								rows={3}
							/>
						</div>
					</div>

					<div className={styles.formActions}>
						<button
							type="button"
							onClick={handleCancel}
							className={styles.cancelButton}
						>
							Cancelar
						</button>
						<button 
							type="button"
							onClick={handleSaveOnly}
							className={styles.saveButton}
							disabled={isCreatingProject.current}
						>
							{isCreatingProject.current ? 'Guardando...' : 'Guardar Proyecto'}
						</button>
						<button 
							type="button"
							onClick={handleSaveAndContinue}
							className={styles.submitButton}
							disabled={isCreatingProject.current}
						>
							{isCreatingProject.current ? 'Guardando...' : 'Guardar y Continuar'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
