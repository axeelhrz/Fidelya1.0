"use client";

import "./description.css";
import { useScatData } from "../contexts/ScatDataContext";
import pdfService from "../services/pdfService";

export default function NextPage({ formData, onGoBack, onStartNew }) {
	const { getCompleteSummary, resetAllData } = useScatData();

	const formatFieldValue = (value) => {
		return value && value.trim() !== "" ? value : "No especificado";
	};

	const handlePrint = () => {
		window.print();
	};

	const handleEmail = () => {
		const scatData = getCompleteSummary();
		const subject = encodeURIComponent("Reporte SCAT - Análisis Sistemático de Causas");
		
		let bodyContent = `
Reporte SCAT - Análisis Sistemático de Causas

=== INFORMACIÓN DEL PROYECTO ===
Evento: ${formatFieldValue(scatData.project?.evento)}
Involucrado: ${formatFieldValue(scatData.project?.involucrado)}
Área: ${formatFieldValue(scatData.project?.area)}
Fecha y Hora: ${formatFieldValue(scatData.project?.fechaHora)}
Investigador: ${formatFieldValue(scatData.project?.investigador)}
Otros Datos: ${formatFieldValue(scatData.project?.otrosDatos)}

=== EVALUACIÓN POTENCIAL DE PÉRDIDA ===`;

		if (scatData.evaluacion?.severity) {
			const severityMap = { A: 'Mayor', B: 'Grave', C: 'Menor' };
			bodyContent += `\nSeveridad: ${scatData.evaluacion.severity} - ${severityMap[scatData.evaluacion.severity]}`;
		}
		if (scatData.evaluacion?.probability) {
			const probabilityMap = { A: 'Alta', B: 'Moderada', C: 'Rara' };
			bodyContent += `\nProbabilidad: ${scatData.evaluacion.probability} - ${probabilityMap[scatData.evaluacion.probability]}`;
		}
		if (scatData.evaluacion?.frequency) {
			const frequencyMap = { A: 'Grande', B: 'Moderada', C: 'Baja' };
			bodyContent += `\nFrecuencia: ${scatData.evaluacion.frequency} - ${frequencyMap[scatData.evaluacion.frequency]}`;
		}

		if (scatData.contacto?.selectedIncidents?.length > 0) {
			bodyContent += `\n\n=== TIPOS DE CONTACTO ===\nIncidentes seleccionados: ${scatData.contacto.selectedIncidents.join(', ')}`;
		}

		if (scatData.causasInmediatas?.actos?.selectedItems?.length > 0) {
			bodyContent += `\n\n=== CAUSAS INMEDIATAS - ACTOS ===\nElementos seleccionados: ${scatData.causasInmediatas.actos.selectedItems.join(', ')}`;
		}

		if (scatData.causasInmediatas?.condiciones?.selectedItems?.length > 0) {
			bodyContent += `\n\n=== CAUSAS INMEDIATAS - CONDICIONES ===\nElementos seleccionados: ${scatData.causasInmediatas.condiciones.selectedItems.join(', ')}`;
		}

		bodyContent += `\n\nGenerado automáticamente por el Sistema SCAT`;

		const body = encodeURIComponent(bodyContent);
		window.location.href = `mailto:?subject=${subject}&body=${body}`;
	};

	const handleExportPDF = () => {
		try {
			const scatData = getCompleteSummary();
			
			// Generar nombre de archivo con fecha
			const now = new Date();
			const dateStr = now.toISOString().split('T')[0];
			const filename = `reporte-scat-${dateStr}.pdf`;
			
			pdfService.downloadPDF(scatData, filename);
		} catch (error) {
			console.error('Error generating PDF:', error);
			alert('Error al generar el PDF. Por favor, inténtelo de nuevo.');
		}
	};

	const handleStartNewReport = () => {
		resetAllData();
		onStartNew();
	};

	// Obtener resumen completo de datos
	const scatData = getCompleteSummary();

	// Función para obtener texto de evaluación
	const getEvaluationText = () => {
		const { evaluacion } = scatData;
		if (!evaluacion?.severity && !evaluacion?.probability && !evaluacion?.frequency) {
			return "No especificado";
		}

		const severityMap = { A: 'Mayor', B: 'Grave', C: 'Menor' };
		const probabilityMap = { A: 'Alta', B: 'Moderada', C: 'Rara' };
		const frequencyMap = { A: 'Grande', B: 'Moderada', C: 'Baja' };

		let text = [];
		if (evaluacion.severity) text.push(`Severidad: ${severityMap[evaluacion.severity]}`);
		if (evaluacion.probability) text.push(`Probabilidad: ${probabilityMap[evaluacion.probability]}`);
		if (evaluacion.frequency) text.push(`Frecuencia: ${frequencyMap[evaluacion.frequency]}`);

		return text.join(', ');
	};

	// Función para obtener texto de contacto
	const getContactText = () => {
		const { contacto } = scatData;
		if (!contacto?.selectedIncidents?.length) {
			return "No especificado";
		}
		return `${contacto.selectedIncidents.length} tipo(s) de contacto seleccionado(s)`;
	};

	// Función para obtener texto de causas inmediatas
	const getCausasInmediatasText = () => {
		const { causasInmediatas } = scatData;
		const actosCount = causasInmediatas?.actos?.selectedItems?.length || 0;
		const condicionesCount = causasInmediatas?.condiciones?.selectedItems?.length || 0;
		
		if (actosCount === 0 && condicionesCount === 0) {
			return "No especificado";
		}

		let text = [];
		if (actosCount > 0) text.push(`${actosCount} acto(s) subestándar`);
		if (condicionesCount > 0) text.push(`${condicionesCount} condición(es) subestándar`);

		return text.join(', ');
	};

	// Función para obtener texto de causas básicas
	const getCausasBasicasText = () => {
		const { causasBasicas } = scatData;
		const personalesCount = causasBasicas?.personales?.selectedItems?.length || 0;
		const laboralesCount = causasBasicas?.laborales?.selectedItems?.length || 0;
		
		if (personalesCount === 0 && laboralesCount === 0) {
			return "No especificado";
		}

		let text = [];
		if (personalesCount > 0) text.push(`${personalesCount} factor(es) personal(es)`);
		if (laboralesCount > 0) text.push(`${laboralesCount} factor(es) laboral(es)`);

		return text.join(', ');
	};

	// Función para obtener texto de necesidades de control
	const getNecesidadesControlText = () => {
		const { necesidadesControl } = scatData;
		const count = necesidadesControl?.selectedItems?.length || 0;
		
		if (count === 0) {
			return "No especificado";
		}

		return `${count} necesidad(es) de control identificada(s)`;
	};

	return (
		<div className="next-page-container-wrapper">
			<div className="next-page-content">
				<div className="next-page-container">
					{/* Status Badge */}
					<div className="status-badge">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
						Análisis SCAT Completado
					</div>

					{/* Success Icon */}
					<div className="success-icon">
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>

					<h1 className="next-page-title">¡Análisis SCAT Completado!</h1>
					<h2 className="next-page-subtitle">
						Resumen del Análisis Sistemático de Causas
					</h2>

					<p className="next-page-description">
						El análisis SCAT ha sido completado exitosamente. A continuación se muestra 
						un resumen de toda la información recopilada durante el proceso de análisis.
					</p>

					{/* Form Summary */}
					<div className="form-summary">
						<h3>Resumen Completo del Análisis SCAT</h3>

						{/* Información del Proyecto */}
						<div className="form-summary-section">
							<h4>Información del Proyecto</h4>
							<div className="form-summary-item">
								<span className="form-summary-label">Evento:</span>
								<span className="form-summary-value">
									{formatFieldValue(scatData.project?.evento)}
								</span>
							</div>
							<div className="form-summary-item">
								<span className="form-summary-label">Involucrado:</span>
								<span className="form-summary-value">
									{formatFieldValue(scatData.project?.involucrado)}
								</span>
							</div>
							<div className="form-summary-item">
								<span className="form-summary-label">Área:</span>
								<span className="form-summary-value">
									{formatFieldValue(scatData.project?.area)}
								</span>
							</div>
							<div className="form-summary-item">
								<span className="form-summary-label">Fecha y Hora:</span>
								<span className="form-summary-value">
									{formatFieldValue(scatData.project?.fechaHora)}
								</span>
							</div>
							<div className="form-summary-item">
								<span className="form-summary-label">Investigador:</span>
								<span className="form-summary-value">
									{formatFieldValue(scatData.project?.investigador)}
								</span>
							</div>
						</div>

						{/* Evaluación Potencial de Pérdida */}
						<div className="form-summary-section">
							<h4>Evaluación Potencial de Pérdida</h4>
							<div className="form-summary-item">
								<span className="form-summary-label">Evaluación:</span>
								<span className="form-summary-value">
									{getEvaluationText()}
								</span>
							</div>
						</div>

						{/* Tipo de Contacto */}
						<div className="form-summary-section">
							<h4>Tipo de Contacto</h4>
							<div className="form-summary-item">
								<span className="form-summary-label">Contactos:</span>
								<span className="form-summary-value">
									{getContactText()}
								</span>
							</div>
						</div>

						{/* Causas Inmediatas */}
						<div className="form-summary-section">
							<h4>Causas Inmediatas</h4>
							<div className="form-summary-item">
								<span className="form-summary-label">Causas:</span>
								<span className="form-summary-value">
									{getCausasInmediatasText()}
								</span>
							</div>
						</div>

						{/* Causas Básicas */}
						<div className="form-summary-section">
							<h4>Causas Básicas</h4>
							<div className="form-summary-item">
								<span className="form-summary-label">Factores:</span>
								<span className="form-summary-value">
									{getCausasBasicasText()}
								</span>
							</div>
						</div>

						{/* Necesidades de Control */}
						<div className="form-summary-section">
							<h4>Necesidades de Acción de Control</h4>
							<div className="form-summary-item">
								<span className="form-summary-label">Controles:</span>
								<span className="form-summary-value">
									{getNecesidadesControlText()}
								</span>
							</div>
						</div>
					</div>

					{/* Primary Action Buttons */}
					<div className="button-group primary-actions">
						<button onClick={handleStartNewReport} className="next-page-primary-button">
							<span className="action-button-with-icon">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
								Nuevo Análisis
							</span>
						</button>
						<button onClick={onGoBack} className="next-page-secondary-button">
							<span className="action-button-with-icon">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M10 19l-7-7m0 0l7-7m-7 7h18"
									/>
								</svg>
								Volver al Inicio
							</span>
						</button>
					</div>

					{/* Secondary Action Buttons */}
					<div className="button-group secondary-actions">
						<button
							onClick={handlePrint}
							className="next-page-secondary-button"
						>
							<span className="action-button-with-icon">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
									/>
								</svg>
								Imprimir Reporte
							</span>
						</button>
						<button
							onClick={handleEmail}
							className="next-page-secondary-button"
						>
							<span className="action-button-with-icon">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								Enviar por Email
							</span>
						</button>
						<button
							onClick={handleExportPDF}
							className="next-page-secondary-button"
						>
							<span className="action-button-with-icon">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								Exportar PDF
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}