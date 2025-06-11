"use client";

import { useState, useRef, useMemo } from "react";
import styles from "./CausasInmediatasContent.module.css";
import { useScatData } from "../../../contexts/ScatContext";

function CausasInmediatasContent() {
	const { causasInmediatasData, setCausasInmediatasData } = useScatData();
	const [activeSection, setActiveSection] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isSelectedCollapsed, setIsSelectedCollapsed] = useState(false);
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
		setSearchTerm("");
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

	const toggleSelectedCollapse = () => {
		setIsSelectedCollapsed(!isSelectedCollapsed);
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
		return activeSection === 'actos' ? 'ACTOS SUBESTÁNDAR' : 'CONDICIONES SUBESTÁNDAR';
	};

	const getSectionSubtitle = () => {
		return activeSection === 'actos' 
			? 'Violación de un procedimiento aceptado como seguro'
			: 'Condición o circunstancia física peligrosa';
	};

	const getCurrentSectionData = () => {
		return causasInmediatasData[activeSection] || { selectedItems: [], image: null, observation: '' };
	};

	// Filtrar items basado en búsqueda
	const filteredItems = useMemo(() => {
		const items = getCurrentItems();
		if (!searchTerm.trim()) return items;
		
		return items.filter(item => 
			item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.id.toString().includes(searchTerm)
		);
	}, [searchTerm, activeSection]);

	const handleRemoveSelectedItem = (itemId) => {
		handleItemToggle(itemId);
	};

	if (!activeSection) {
		return (
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={styles.headerContent}>
						<h1 className={styles.title}>Causas Inmediatas</h1>
						<p className={styles.subtitle}>
							Identifique las causas directas del incidente
						</p>
					</div>
				</div>

				<div className={styles.sectionGrid}>
					<div
						className={`${styles.sectionCard} ${
							causasInmediatasData.actos.selectedItems.length > 0 ? styles.hasData : ''
						}`}
						onClick={() => handleSectionSelect('actos')}
					>
						<div className={styles.cardIcon}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
								<circle cx="8.5" cy="7" r="4"/>
								<path d="M20 8v6M23 11h-6"/>
							</svg>
						</div>
						<div className={styles.cardContent}>
							<h3 className={styles.cardTitle}>Actos Subestándar</h3>
							<p className={styles.cardDescription}>
								Violaciones de procedimientos seguros
							</p>
							<div className={styles.cardMeta}>
								<span className={styles.itemCount}>15 elementos</span>
								{causasInmediatasData.actos.selectedItems.length > 0 && (
									<span className={styles.selectedCount}>
										{causasInmediatasData.actos.selectedItems.length} seleccionados
									</span>
								)}
							</div>
						</div>
					</div>

					<div
						className={`${styles.sectionCard} ${
							causasInmediatasData.condiciones.selectedItems.length > 0 ? styles.hasData : ''
						}`}
						onClick={() => handleSectionSelect('condiciones')}
					>
						<div className={styles.cardIcon}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M12 2L2 7l10 5 10-5-10-5z"/>
								<path d="M2 17l10 5 10-5"/>
								<path d="M2 12l10 5 10-5"/>
							</svg>
						</div>
						<div className={styles.cardContent}>
							<h3 className={styles.cardTitle}>Condiciones Subestándar</h3>
							<p className={styles.cardDescription}>
								Circunstancias físicas peligrosas
							</p>
							<div className={styles.cardMeta}>
								<span className={styles.itemCount}>13 elementos</span>
								{causasInmediatasData.condiciones.selectedItems.length > 0 && (
									<span className={styles.selectedCount}>
										{causasInmediatasData.condiciones.selectedItems.length} seleccionados
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const currentSectionData = getCurrentSectionData();

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<button 
					className={styles.backButton}
					onClick={() => setActiveSection(null)}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M19 12H5M12 19l-7-7 7-7"/>
					</svg>
					Volver
				</button>
				<div className={styles.headerContent}>
					<h1 className={styles.title}>{getSectionTitle()}</h1>
					<p className={styles.subtitle}>{getSectionSubtitle()}</p>
				</div>
			</div>

			<div className={styles.content}>
				<div className={styles.mainPanel}>
					<div className={styles.toolbar}>
						<div className={styles.searchContainer}>
							<svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<circle cx="11" cy="11" r="8"/>
								<path d="M21 21l-4.35-4.35"/>
							</svg>
							<input
								type="text"
								placeholder="Buscar elementos..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={styles.searchInput}
							/>
						</div>
						<div className={styles.toolbarActions}>
							{currentSectionData.selectedItems.length > 0 && (
								<button
									className={styles.toggleButton}
									onClick={toggleSelectedCollapse}
								>
									{isSelectedCollapsed ? 'Mostrar' : 'Ocultar'} selecciones
								</button>
							)}
							<button
								className={styles.clearButton}
								onClick={clearAllSelections}
								disabled={currentSectionData.selectedItems.length === 0}
							>
								Limpiar todo
							</button>
						</div>
					</div>

					<div className={styles.itemsGrid}>
						{filteredItems.map((item) => (
							<div
								key={item.id}
								className={`${styles.itemCard} ${
									currentSectionData.selectedItems.includes(item.id) ? styles.selected : ""
								}`}
								onClick={() => handleItemToggle(item.id)}
							>
								<div className={styles.itemNumber}>{item.id}</div>
								<div className={styles.itemText}>{item.text}</div>
								{currentSectionData.selectedItems.includes(item.id) && (
									<div className={styles.checkmark}>
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
											<polyline points="20,6 9,17 4,12"/>
										</svg>
									</div>
								)}
							</div>
						))}
					</div>

					{currentSectionData.selectedItems.length > 0 && !isSelectedCollapsed && (
						<div className={styles.selectedSummary}>
							<div className={styles.summaryHeader}>
								<h4>Elementos seleccionados</h4>
								<span className={styles.badge}>
									{currentSectionData.selectedItems.length}
								</span>
							</div>
							<div className={styles.selectedTags}>
								{currentSectionData.selectedItems.map((id) => {
									const item = getCurrentItems().find((item) => item.id === id);
									return (
										<span 
											key={id} 
											className={styles.tag}
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveSelectedItem(id);
											}}
										>
											{id}. {item?.text || 'Elemento no encontrado'}
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<line x1="18" y1="6" x2="6" y2="18"/>
												<line x1="6" y1="6" x2="18" y2="18"/>
											</svg>
										</span>
									);
								})}
							</div>
						</div>
					)}
				</div>

				<div className={styles.sidePanel}>
					<div className={styles.imageUpload}>
						<h4>Imagen de referencia</h4>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleImageUpload}
							accept="image/*"
							className={styles.fileInput}
						/>

						{currentSectionData.image ? (
							<div className={styles.imagePreview}>
								<img
									src={currentSectionData.image}
									alt="Preview"
									className={styles.image}
								/>
								<button className={styles.removeButton} onClick={removeImage}>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<line x1="18" y1="6" x2="6" y2="18"/>
										<line x1="6" y1="6" x2="18" y2="18"/>
									</svg>
								</button>
							</div>
						) : (
							<div className={styles.uploadArea} onClick={triggerFileInput}>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
									<circle cx="12" cy="13" r="4"/>
								</svg>
								<p>Agregar imagen</p>
							</div>
						)}
					</div>

					<div className={styles.observations}>
						<h4>Observaciones</h4>
						<textarea
							className={styles.textarea}
							value={currentSectionData.observation || ''}
							onChange={handleObservationChange}
							placeholder="Escriba sus observaciones aquí..."
							rows={6}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CausasInmediatasContent;