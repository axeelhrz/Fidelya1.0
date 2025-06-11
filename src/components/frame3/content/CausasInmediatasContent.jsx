"use client";

import { useState, useRef } from "react";
import styles from "./CausasInmediatasContent.module.css";
import { useScatData } from "../../../contexts/ScatDataContext";

function CausasInmediatasContent() {
	const { causasInmediatasData, setCausasInmediatasData } = useScatData();
	const [activeSection, setActiveSection] = useState(null);
	const [selectedItems, setSelectedItems] = useState([]);
	const [imagePreview, setImagePreview] = useState(null);
	const [observation, setObservation] = useState("");
	const fileInputRef = useRef(null);

	const actosSubestandar = [
		{ id: 1, text: "Operar equipos sin autorización" },
		{ id: 2, text: "Omitir el uso de equipos de seguridad personal" },
		{ id: 3, text: "Omitir el uso de dispositivos de seguridad" },
		{ id: 4, text: "Operar a velocidad inadecuada" },
		{ id: 5, text: "Poner fuera de servicio los dispositivos de seguridad" },
		{ id: 6, text: "Usar equipos defectuosos" },
		{ id: 7, text: "No usar o usar inadecuadamente el equipo de protección personal" },
		{ id: 8, text: "Cargar incorrectamente" },
		{ id: 9, text: "Colocar, mezclar, combinar, etc., de manera insegura" },
		{ id: 10, text: "Levantar objetos en forma incorrecta" },
		{ id: 11, text: "Adoptar una posición insegura para hacer el trabajo" },
		{ id: 12, text: "Trabajar en equipos en movimiento o peligrosos" },
		{ id: 13, text: "Distraerse, bromear, jugar, etc." },
		{ id: 14, text: "Omitir el uso de equipos de protección personal disponibles" },
		{ id: 15, text: "Usar equipos inseguros o usarlos inseguramente" }
	];

	const condicionesSubestandar = [
		{ id: 16, text: "Guardas inadecuadas" },
		{ id: 17, text: "Equipos de protección inadecuados o insuficientes" },
		{ id: 18, text: "Herramientas, equipos o materiales defectuosos" },
		{ id: 19, text: "Espacio limitado para desenvolverse" },
		{ id: 20, text: "Sistemas de advertencia inadecuados" },
		{ id: 21, text: "Peligros de incendio y explosión" },
		{ id: 22, text: "Orden y limpieza deficientes en el lugar de trabajo" },
		{ id: 23, text: "Condiciones ambientales peligrosas" },
		{ id: 24, text: "Iluminación deficiente" },
		{ id: 25, text: "Ventilación deficiente" },
		{ id: 26, text: "Ropa o vestimenta insegura" },
		{ id: 27, text: "Congestión o acción restringida" },
		{ id: 28, text: "Ubicación peligrosa de equipos y materiales" }
	];

	const handleSectionSelect = (section) => {
		setActiveSection(section);
		setSelectedItems([]);
		setImagePreview(null);
		setObservation("");
	};

	const handleItemToggle = (itemId) => {
		const currentSection = activeSection;
		const currentData = causasInmediatasData[currentSection];
		const newSelectedItems = currentData.selectedItems.includes(itemId)
			? currentData.selectedItems.filter((id) => id !== itemId)
			: [...currentData.selectedItems, itemId];

		setCausasInmediatasData(currentSection, {
			...currentData,
			selectedItems: newSelectedItems
		});
	};

	const clearAllSelections = () => {
		const currentSection = activeSection;
		const currentData = causasInmediatasData[currentSection];
		
		setCausasInmediatasData(currentSection, {
			...currentData,
			selectedItems: []
		});
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const currentSection = activeSection;
				const currentData = causasInmediatasData[currentSection];
				
				setCausasInmediatasData(currentSection, {
					...currentData,
					image: e.target.result
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	const removeImage = () => {
		const currentSection = activeSection;
		const currentData = causasInmediatasData[currentSection];
		
		setCausasInmediatasData(currentSection, {
			...currentData,
			image: null
		});
		fileInputRef.current.value = "";
	};

	const handleObservationChange = (e) => {
		const currentSection = activeSection;
		const currentData = causasInmediatasData[currentSection];
		
		setCausasInmediatasData(currentSection, {
			...currentData,
			observation: e.target.value
		});
	};

	const getCurrentItems = () => {
		return activeSection === 'actos' ? actosSubestandar : condicionesSubestandar;
	};

	const getSectionTitle = () => {
		return activeSection === 'actos' ? 'ACTOS SUBESTÁNDAR / INSEGUROS' : 'CONDICIONES SUBESTÁNDAR / INSEGURAS';
	};

	const getSectionSubtitle = () => {
		return activeSection === 'actos' 
			? 'VIOLACIÓN DE UN PROCEDIMIENTO ACEPTADO COMO SEGURO'
			: 'CONDICIÓN O CIRCUNSTANCIA FÍSICA PELIGROSA';
	};

	const getCurrentSectionData = () => {
		return causasInmediatasData[activeSection] || { selectedItems: [], image: null, observation: '' };
	};

	if (!activeSection) {
		return (
			<div className={styles.contentCard}>
				<div className={styles.contentHeader}>
					<h2 className={styles.contentTitle}>CAUSAS INMEDIATAS O DIRECTAS</h2>
					<p className={styles.contentSubtitle}>
						Técnica de Análisis Sistemático de las Causas
					</p>
				</div>

				<div className={styles.contentBody}>
					<p className={styles.description}>
						Seleccione el tipo de causa inmediata que desea analizar:
					</p>

					<div className={styles.sectionSelector}>
						<button
							className={`${styles.sectionCard} ${
								causasInmediatasData.actos.selectedItems.length > 0 ? styles.hasData : ''
							}`}
							onClick={() => handleSectionSelect('actos')}
						>
							<div className={styles.sectionNumber}>1</div>
							<div className={styles.sectionContent}>
								<h3 className={styles.sectionTitle}>ACTOS SUBESTÁNDAR / INSEGUROS</h3>
								<p className={styles.sectionDescription}>
									Violación de un procedimiento aceptado como seguro
								</p>
								<p className={styles.sectionRange}>Opciones 1-15</p>
								{causasInmediatasData.actos.selectedItems.length > 0 && (
									<p className={styles.dataIndicator}>
										{causasInmediatasData.actos.selectedItems.length} elemento(s) seleccionado(s)
									</p>
								)}
							</div>
						</button>

						<button
							className={`${styles.sectionCard} ${
								causasInmediatasData.condiciones.selectedItems.length > 0 ? styles.hasData : ''
							}`}
							onClick={() => handleSectionSelect('condiciones')}
						>
							<div className={styles.sectionNumber}>2</div>
							<div className={styles.sectionContent}>
								<h3 className={styles.sectionTitle}>CONDICIONES SUBESTÁNDAR / INSEGURAS</h3>
								<p className={styles.sectionDescription}>
									Condición o circunstancia física peligrosa
								</p>
								<p className={styles.sectionRange}>Opciones 16-28</p>
								{causasInmediatasData.condiciones.selectedItems.length > 0 && (
									<p className={styles.dataIndicator}>
										{causasInmediatasData.condiciones.selectedItems.length} elemento(s) seleccionado(s)
									</p>
								)}
							</div>
						</button>
					</div>
				</div>
			</div>
		);
	}

	const currentSectionData = getCurrentSectionData();

	return (
		<div className={styles.contentCard}>
			<div className={styles.contentHeader}>
				<button 
					className={styles.backButton}
					onClick={() => setActiveSection(null)}
				>
					← Volver
				</button>
				<h2 className={styles.contentTitle}>{getSectionTitle()}</h2>
				<p className={styles.contentSubtitle}>{getSectionSubtitle()}</p>
			</div>

			<div className={styles.detailView}>
				<div className={styles.header}>
					<h3>Seleccionar Elementos</h3>
					<button
						className={styles.clearButton}
						onClick={clearAllSelections}
						disabled={currentSectionData.selectedItems.length === 0}
					>
						Limpiar Selección
					</button>
				</div>

				<div className={styles.contentWrapper}>
					<div className={styles.itemsGridContainer}>
						<div className={styles.itemsGrid}>
							{getCurrentItems().map((item) => (
								<button
									key={item.id}
									className={`${styles.itemCard} ${
										currentSectionData.selectedItems.includes(item.id) ? styles.selected : ""
									}`}
									onClick={() => handleItemToggle(item.id)}
								>
									<div className={styles.itemNumber}>{item.id}</div>
									<div className={styles.itemContent}>
										<div className={styles.itemText}>{item.text}</div>
									</div>
								</button>
							))}
						</div>

						{currentSectionData.selectedItems.length > 0 && (
							<div className={styles.selectedSummary}>
								<h4>Elementos Seleccionados ({currentSectionData.selectedItems.length}):</h4>
								<div className={styles.selectedList}>
									{currentSectionData.selectedItems.map((id) => {
										const item = getCurrentItems().find((item) => item.id === id);
										return (
											<span key={id} className={styles.selectedTag}>
												{id}. {item.text}
											</span>
										);
									})}
								</div>
							</div>
						)}
					</div>

					<div className={styles.rightPanel}>
						<div className={styles.imageSection}>
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleImageUpload}
								accept="image/*"
								className={styles.fileInput}
							/>

							{currentSectionData.image ? (
								<div className={styles.imagePreviewContainer}>
									<img
										src={currentSectionData.image || "/placeholder.svg"}
										alt="Preview"
										className={styles.imagePreview}
									/>
									<button className={styles.removeImageBtn} onClick={removeImage}>
										×
									</button>
								</div>
							) : (
								<div
									className={styles.uploadPlaceholder}
									onClick={triggerFileInput}
								>
									<div className={styles.cameraIcon}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
											<circle cx="12" cy="13" r="4"></circle>
										</svg>
										<div className={styles.magnifyingGlass}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<circle cx="11" cy="11" r="8"></circle>
												<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
											</svg>
										</div>
									</div>
									<p>Haga clic para agregar imagen</p>
								</div>
							)}
						</div>

						<div className={styles.observationSection}>
							<div className={styles.observationHeader}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className={styles.editIcon}
								>
									<path d="M12 20h9"></path>
									<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
								</svg>
								<span>Observación</span>
							</div>
							<textarea
								className={styles.observationTextarea}
								value={currentSectionData.observation || ''}
								onChange={handleObservationChange}
								placeholder="Escriba sus observaciones aquí..."
								rows={6}
							></textarea>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CausasInmediatasContent;