"use client";

import "./description.css";

export default function NextPage({ formData, onGoBack, onStartNew }) {
	const formatFieldValue = (value) => {
		return value && value.trim() !== "" ? value : "No especificado";
	};

	const handlePrint = () => {
		window.print();
	};

	const handleEmail = () => {
		const subject = encodeURIComponent("Reporte de Accidente/Incidente");
		const body = encodeURIComponent(`
Reporte de Accidente/Incidente

Evento: ${formatFieldValue(formData?.evento)}
Involucrado: ${formatFieldValue(formData?.involucrado)}
Área: ${formatFieldValue(formData?.area)}
Fecha y Hora: ${formatFieldValue(formData?.fechaHora)}
Investigador: ${formatFieldValue(formData?.investigador)}
Otros Datos: ${formatFieldValue(formData?.otrosDatos)}

Generado automáticamente por el Sistema de Reportes de Accidentes
    `);
		window.location.href = `mailto:?subject=${subject}&body=${body}`;
	};

	const handleExportPDF = () => {
		alert("Funcionalidad de exportación PDF en desarrollo");
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
						Reporte Completado
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

					<h1 className="next-page-title">¡Formulario Completado!</h1>
					<h2 className="next-page-subtitle">
						Datos del Accidente Registrados
					</h2>

					<p className="next-page-description">
						Los datos del accidente/incidente han sido registrados exitosamente
						en el sistema. A continuación se muestra un resumen de la
						información proporcionada para su revisión.
					</p>

					{/* Form Summary */}
					<div className="form-summary">
						<h3>Resumen de Datos Registrados</h3>

						<div className="form-summary-item">
							<span className="form-summary-label">Evento:</span>
							<span
								className={`form-summary-value ${
									!formData?.evento ? "empty" : ""
								}`}
							>
								{formatFieldValue(formData?.evento)}
							</span>
						</div>

						<div className="form-summary-item">
							<span className="form-summary-label">Involucrado:</span>
							<span
								className={`form-summary-value ${
									!formData?.involucrado ? "empty" : ""
								}`}
							>
								{formatFieldValue(formData?.involucrado)}
							</span>
						</div>

						<div className="form-summary-item">
							<span className="form-summary-label">Área:</span>
							<span
								className={`form-summary-value ${
									!formData?.area ? "empty" : ""
								}`}
							>
								{formatFieldValue(formData?.area)}
							</span>
						</div>

						<div className="form-summary-item">
							<span className="form-summary-label">Fecha y Hora:</span>
							<span
								className={`form-summary-value ${
									!formData?.fechaHora ? "empty" : ""
								}`}
							>
								{formatFieldValue(formData?.fechaHora)}
							</span>
						</div>

						<div className="form-summary-item">
							<span className="form-summary-label">Investigador:</span>
							<span
								className={`form-summary-value ${
									!formData?.investigador ? "empty" : ""
								}`}
							>
								{formatFieldValue(formData?.investigador)}
							</span>
						</div>

						<div className="form-summary-item">
							<span className="form-summary-label">Otros Datos:</span>
							<span
								className={`form-summary-value ${
									!formData?.otrosDatos ? "empty" : ""
								}`}
							>
								{formatFieldValue(formData?.otrosDatos)}
							</span>
						</div>
					</div>

					{/* Primary Action Buttons */}
					<div className="button-group primary-actions">
						<button onClick={onStartNew} className="next-page-primary-button">
							<span className="action-button-with-icon">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
								Nuevo Reporte
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
