"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import styles from "./AccidentForm.module.css";
import { useScatData } from "../contexts/ScatContext";
import pdfService from "../services/pdfService";

export default function EditProjectModal({ isOpen, onClose, project, onSave }) {
	const { getCompleteSummary } = useScatData();
	const [formData, setFormData] = useState({
		evento: "",
		involucrado: "",
		area: "",
		fechaHora: "",
		investigador: "",
		otrosDatos: "",
	});

	const [errors, setErrors] = useState({});
	const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

	// Cargar datos del proyecto cuando se abre el modal
	useEffect(() => {
		if (isOpen && project && project.formData) {
			console.log('=== CARGANDO PROYECTO EN EDIT MODAL ===');
			console.log('Proyecto:', project);
			
			setFormData({
				evento: project.formData.evento || "",
				involucrado: project.formData.involucrado || "",
				area: project.formData.area || "",
				fechaHora: project.formData.fechaHora || "",
				investigador: project.formData.investigador || "",
				otrosDatos: project.formData.otrosDatos || "",
			});
		}
	}, [isOpen, project]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Limpiar error cuando el usuario empiece a escribir
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

	const handleSave = (e) => {
		e.preventDefault();

		if (validateForm()) {
			console.log('=== GUARDANDO CAMBIOS DEL PROYECTO ===');
			console.log('Datos del formulario:', formData);
			
			// Crear proyecto actualizado manteniendo todos los datos SCAT existentes
			const updatedProject = {
				...project,
				name: formData.evento,
				description: `Involucrado: ${formData.involucrado} - Área: ${formData.area}`,
				formData: { ...formData },
				lastModified: new Date().toISOString(),
				version: (project.version || 1) + 1
			};

			console.log('Proyecto actualizado:', updatedProject);

			if (onSave) {
				onSave(updatedProject);
			}

			onClose();
		}
	};

	const handleGeneratePDF = async () => {
		if (!project) return;

		try {
			setIsGeneratingPDF(true);
			console.log('=== GENERANDO PDF DEL PROYECTO ===');
			
			// Obtener datos completos del proyecto
			const projectData = {
				project: formData, // Usar datos actuales del formulario
				evaluacion: project.scatData?.evaluacion || {},
				contacto: project.scatData?.contacto || { selectedIncidents: [], image: null, observation: '' },
				causasInmediatas: project.scatData?.causasInmediatas || {
					actos: { selectedItems: [], image: null, observation: '' },
					condiciones: { selectedItems: [], image: null, observation: '' }
				},
				causasBasicas: project.scatData?.causasBasicas || {
					personales: { selectedItems: [], detailedSelections: {}, image: null, observation: '' },
					laborales: { selectedItems: [], detailedSelections: {}, image: null, observation: '' }
				},
				necesidadesControl: project.scatData?.necesidadesControl || {
					selectedItems: [],
					detailedData: {},
					globalImage: null,
					globalObservation: '',
					medidasCorrectivas: ''
				}
			};

			console.log('Datos para PDF:', projectData);

			// Generar nombre del archivo
			const fileName = `SCAT_${formData.evento.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf';
			
			// Generar y descargar PDF
			pdfService.downloadPDF(projectData, fileName);
			
			console.log('PDF generado exitosamente');
		} catch (error) {
			console.error('Error generando PDF:', error);
			alert('Error al generar el PDF. Por favor, intente nuevamente.');
		} finally {
			setIsGeneratingPDF(false);
		}
	};

	const handleCancel = () => {
		// Resetear a los datos originales
		if (project && project.formData) {
			setFormData({
				evento: project.formData.evento || "",
				involucrado: project.formData.involucrado || "",
				area: project.formData.area || "",
				fechaHora: project.formData.fechaHora || "",
				investigador: project.formData.investigador || "",
				otrosDatos: project.formData.otrosDatos || "",
			});
		}
		setErrors({});
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<div className={styles.modalHeader}>
					<h2 className={styles.modalTitle}>Editar Proyecto</h2>
					<div className={styles.modalHeaderActions}>
						<button 
							className={styles.pdfButton}
							onClick={handleGeneratePDF}
							disabled={isGeneratingPDF}
							title="Generar PDF con datos actuales"
						>
							<Download size={16} />
							{isGeneratingPDF ? 'Generando...' : 'PDF'}
						</button>
						<button className={styles.closeButton} onClick={handleCancel}>
							×
						</button>
					</div>
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

					{/* Información del proyecto */}
					<div className={styles.projectInfo}>
						<h3>Información del Proyecto</h3>
						<div className={styles.infoGrid}>
							<div className={styles.infoItem}>
								<span className={styles.infoLabel}>Creado:</span>
								<span className={styles.infoValue}>
									{project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Fecha desconocida'}
								</span>
							</div>
							<div className={styles.infoItem}>
								<span className={styles.infoLabel}>Última modificación:</span>
								<span className={styles.infoValue}>
									{project?.lastModified ? new Date(project.lastModified).toLocaleDateString() : 'Nunca'}
								</span>
							</div>
							<div className={styles.infoItem}>
								<span className={styles.infoLabel}>Versión:</span>
								<span className={styles.infoValue}>
									{project?.version || 1}
								</span>
							</div>
							<div className={styles.infoItem}>
								<span className={styles.infoLabel}>Datos SCAT:</span>
								<span className={styles.infoValue}>
									{project?.scatData ? 'Disponibles' : 'No disponibles'}
								</span>
							</div>
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
							onClick={handleSave}
							className={styles.submitButton}
						>
							Guardar Cambios
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}