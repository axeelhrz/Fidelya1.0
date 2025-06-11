"use client";

import { useState, useRef, useMemo } from "react";
import styles from "./NecesidadesControlContent.module.css";
import { useScatData } from "../../../contexts/ScatContext";

function NecesidadesControlContent() {
	const { necesidadesControlData, setNecesidadesControlData, causasBasicasData } = useScatData();
	const [activeModal, setActiveModal] = useState(null);
	const [modalData, setModalData] = useState({
		selectedOptions: [],
		optionsPEC: {},
		image: null,
		comments: ""
	});
	const fileInputRef = useRef(null);

	// Mapeo de Causas Básicas a NAC
	const causasBasicasToNAC = {
		// Factores Personales (1-7)
		1: [4, 5, 6], // Capacidad Física -> NAC 4, 5, 6
		2: [4, 5, 6], // Capacidad Mental -> NAC 4, 5, 6
		3: [4, 5, 6], // Tensión Física -> NAC 4, 5, 6
		4: [4, 5, 6], // Tensión Mental -> NAC 4, 5, 6
		5: [4, 5, 6], // Falta de Conocimiento -> NAC 4, 5, 6
		6: [4, 5, 6], // Falta de Habilidad -> NAC 4, 5, 6
		7: [4, 5, 6], // Motivación Incorrecta -> NAC 4, 5, 6
		
		// Factores Laborales (8-15)
		8: [1, 2, 3], // Liderazgo y/o Supervisión Deficiente -> NAC 1, 2, 3
		9: [1, 2, 3], // Ingeniería Inadecuada -> NAC 1, 2, 3
		10: [1, 2, 3], // Adquisiciones Deficientes -> NAC 1, 2, 3
		11: [1, 2, 3], // Mantenimiento Deficiente -> NAC 1, 2, 3
		12: [1, 2, 3], // Herramientas y Equipos Inadecuados -> NAC 1, 2, 3
		13: [1, 2, 3], // Estándares de Trabajo Inadecuados -> NAC 1, 2, 3
		14: [1, 2, 3], // Uso y Desgaste -> NAC 1, 2, 3
		15: [1, 2, 3], // Abuso o Mal Uso -> NAC 1, 2, 3
	};

	const allCategories = [
		{
			id: 'potencial',
			title: 'EVALUACIÓN POTENCIAL DE PÉRDIDA SIN CONTROLES',
			subtitle: 'Técnica de Análisis Sistemático de las Causas',
			color: '#dc2626',
			items: [
				{ 
					id: 1, 
					text: 'Programa inadecuado de mantenimiento preventivo',
					options: [
						"Falta de programa de mantenimiento",
						"Frecuencia inadecuada de mantenimiento",
						"Procedimientos de mantenimiento deficientes",
						"Personal no calificado para mantenimiento",
						"Falta de repuestos y herramientas"
					]
				},
				{ 
					id: 2, 
					text: 'Normas inadecuadas de trabajo',
					options: [
						"Procedimientos de trabajo inexistentes",
						"Procedimientos desactualizados",
						"Procedimientos no comunicados",
						"Falta de entrenamiento en procedimientos",
						"Procedimientos no aplicados"
					]
				},
				{ 
					id: 3, 
					text: 'Diseño o mantenimiento inadecuado de las instalaciones',
					options: [
						"Diseño deficiente de instalaciones",
						"Mantenimiento inadecuado de estructuras",
						"Falta de señalización",
						"Iluminación inadecuada",
						"Ventilación deficiente"
					]
				},
			]
		},
		{
			id: 'contacto',
			title: 'Tipo de Contacto o Qué Contactó con Energía o Sustancia',
			subtitle: '',
			color: '#eab308',
			items: [
				{ 
					id: 4, 
					text: 'Compras inadecuadas',
					options: [
						"Especificaciones de compra deficientes",
						"Evaluación inadecuada de proveedores",
						"Control de calidad deficiente",
						"Recepción inadecuada de materiales",
						"Almacenamiento inadecuado"
					]
				},
				{ 
					id: 5, 
					text: 'Mantenimiento inadecuado',
					options: [
						"Mantenimiento correctivo deficiente",
						"Falta de personal de mantenimiento",
						"Herramientas de mantenimiento inadecuadas",
						"Repuestos de baja calidad",
						"Documentación de mantenimiento deficiente"
					]
				},
				{ 
					id: 6, 
					text: 'Uso y desgaste',
					options: [
						"Planificación inadecuada del uso",
						"Prolongación excesiva de la vida útil",
						"Inspección y control inadecuados",
						"Sobrecarga o sobreutilización",
						"Mantenimiento preventivo deficiente"
					]
				},
			]
		}
	];

	// Función para obtener las categorías filtradas según las selecciones de Causas Básicas
	const getFilteredCategories = useMemo(() => {
		// Obtener todas las causas básicas seleccionadas
		const selectedCausasBasicas = [
			...causasBasicasData.personales.selectedItems,
			...causasBasicasData.laborales.selectedItems
		];

		if (selectedCausasBasicas.length === 0) {
			// Si no hay causas básicas seleccionadas, mostrar todas las categorías
			return allCategories;
		}

		// Obtener los NAC permitidos basados en las causas básicas seleccionadas
		const allowedNACIds = new Set();
		selectedCausasBasicas.forEach(causaId => {
			const nacIds = causasBasicasToNAC[causaId];
			if (nacIds) {
				nacIds.forEach(nacId => allowedNACIds.add(nacId));
			}
		});

		// Filtrar las categorías para mostrar solo los items permitidos
		return allCategories.map(category => ({
			...category,
			items: category.items.filter(item => allowedNACIds.has(item.id))
		})).filter(category => category.items.length > 0); // Solo mostrar categorías que tengan items

	}, [causasBasicasData.personales.selectedItems, causasBasicasData.laborales.selectedItems]);

	const handleItemClick = (item) => {
		setActiveModal(item);
		
		// Cargar datos existentes si los hay
		const existingData = necesidadesControlData.detailedData[item.id];
		if (existingData) {
			setModalData(existingData);
		} else {
			setModalData({
				selectedOptions: [],
				optionsPEC: {},
				image: null,
				comments: ""
			});
		}
	};

	const handleOptionToggle = (optionIndex) => {
		setModalData(prev => ({
			...prev,
			selectedOptions: prev.selectedOptions.includes(optionIndex)
				? prev.selectedOptions.filter(i => i !== optionIndex)
				: [...prev.selectedOptions, optionIndex]
		}));
	};

	// Nueva función para manejar la selección de P E C por opción
	const handleOptionPECToggle = (optionIndex, pec) => {
		setModalData(prev => {
			const currentPECs = prev.optionsPEC[optionIndex] || [];
			const newPECs = currentPECs.includes(pec)
				? currentPECs.filter(p => p !== pec)
				: [...currentPECs, pec];
			
			return {
				...prev,
				optionsPEC: {
					...prev.optionsPEC,
					[optionIndex]: newPECs
				}
			};
		});
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setModalData(prev => ({
					...prev,
					image: e.target.result
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	const removeImage = () => {
		setModalData(prev => ({
			...prev,
			image: null
		}));
		fileInputRef.current.value = "";
	};

	const handleCommentsChange = (e) => {
		setModalData(prev => ({
			...prev,
			comments: e.target.value
		}));
	};

	const handleModalConfirm = () => {
		const hasData = modalData.selectedOptions.length > 0 || 
						modalData.image || 
						modalData.comments.trim() !== "" ||
						Object.keys(modalData.optionsPEC).length > 0;

		if (hasData) {
			// Agregar el item a selectedItems si no está
			const newSelectedItems = necesidadesControlData.selectedItems.includes(activeModal.id)
				? necesidadesControlData.selectedItems
				: [...necesidadesControlData.selectedItems, activeModal.id];
			
			// Guardar los datos detallados
			const newDetailedData = {
				...necesidadesControlData.detailedData,
				[activeModal.id]: modalData
			};

			setNecesidadesControlData({
				...necesidadesControlData,
				selectedItems: newSelectedItems,
				detailedData: newDetailedData
			});
		} else {
			// Si no hay datos, remover el item
			const newSelectedItems = necesidadesControlData.selectedItems.filter(id => id !== activeModal.id);
			const newDetailedData = { ...necesidadesControlData.detailedData };
			delete newDetailedData[activeModal.id];

			setNecesidadesControlData({
				...necesidadesControlData,
				selectedItems: newSelectedItems,
				detailedData: newDetailedData
			});
		}
		
		setActiveModal(null);
		setModalData({
			selectedOptions: [],
			optionsPEC: {},
			image: null,
			comments: ""
		});
	};

	const handleModalCancel = () => {
		setActiveModal(null);
		setModalData({
			selectedOptions: [],
			optionsPEC: {},
			image: null,
			comments: ""
		});
	};

	const clearAllSelections = () => {
		setNecesidadesControlData({
			selectedItems: [],
			detailedData: {},
			globalImage: null,
			globalObservation: ''
		});
	};

	const handleGlobalObservationChange = (e) => {
		setNecesidadesControlData({
			...necesidadesControlData,
			globalObservation: e.target.value
		});
	};

	const getSelectedCount = () => {
		return necesidadesControlData.selectedItems.length;
	};

	// Obtener las causas básicas seleccionadas para mostrar información
	const getSelectedCausasBasicas = () => {
		return [
			...causasBasicasData.personales.selectedItems,
			...causasBasicasData.laborales.selectedItems
		];
	};

	const selectedCausasBasicas = getSelectedCausasBasicas();
	const filteredCategories = getFilteredCategories;

	return (
		<div className={styles.scatContainer}>
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<h1 className={styles.mainTitle}>TABLA SCAT</h1>
					<h2 className={styles.subtitle}>Técnica de Análisis Sistemático de las Causas</h2>
				</div>
				<div className={styles.headerActions}>
					<button 
						className={styles.clearButton}
						onClick={clearAllSelections}
						disabled={necesidadesControlData.selectedItems.length === 0}
					>
						Limpiar Todo ({getSelectedCount()})
					</button>
				</div>
			</div>

			{/* Información sobre el filtrado */}
			{selectedCausasBasicas.length > 0 && (
				<div className={styles.filterInfo}>
					<h3>Opciones filtradas según Causas Básicas seleccionadas:</h3>
					<p>Causas Básicas: {selectedCausasBasicas.join(', ')}</p>
					<p>Se muestran solo las NAC relacionadas con estas causas básicas.</p>
				</div>
			)}

			{filteredCategories.length === 0 ? (
				<div className={styles.noOptionsMessage}>
					<h3>No hay opciones disponibles</h3>
					<p>Primero debe seleccionar causas básicas en la sección anterior (Botón 4) para ver las opciones de control correspondientes.</p>
				</div>
			) : (
				<div className={styles.categoriesGrid}>
					{filteredCategories.map((category) => (
						<div key={category.id} className={styles.categoryCard}>
							<div 
								className={styles.categoryHeader}
								style={{ backgroundColor: category.color }}
							>
								<h3 className={styles.categoryTitle}>{category.title}</h3>
								{category.subtitle && (
									<p className={styles.categorySubtitle}>{category.subtitle}</p>
								)}
							</div>
							
							<div className={styles.categoryBody}>
								{category.items.map((item) => {
									const isSelected = necesidadesControlData.selectedItems.includes(item.id);
									const hasDetailedData = necesidadesControlData.detailedData[item.id];
									
									return (
										<button
											key={item.id}
											className={`${styles.itemButton} ${
												isSelected ? styles.selected : ""
											}`}
											onClick={() => handleItemClick(item)}
										>
											<div className={styles.itemNumber}>{item.id}</div>
											<div className={styles.itemText}>{item.text}</div>
											<div className={styles.itemIcon}>
												{isSelected ? "✓" : "→"}
											</div>
											{hasDetailedData && (
												<div className={styles.dataIndicator}>
													{hasDetailedData.selectedOptions?.length > 0 && 
														<span className={styles.optionsCount}>
															{hasDetailedData.selectedOptions.length} opciones
														</span>
													}
													{hasDetailedData.optionsPEC && Object.keys(hasDetailedData.optionsPEC).length > 0 && 
														<span className={styles.pecIndicator}>
															PEC: {Object.values(hasDetailedData.optionsPEC).flat().length}
														</span>
													}
												</div>
											)}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Global Observation Section */}
			<div className={styles.globalObservationSection}>
				<h3 className={styles.globalObservationTitle}>Observaciones Generales</h3>
				<textarea
					className={styles.globalObservationTextarea}
					value={necesidadesControlData.globalObservation || ''}
					onChange={handleGlobalObservationChange}
					placeholder="Escriba observaciones generales sobre las necesidades de control identificadas..."
					rows={4}
				></textarea>
			</div>

			<div className={styles.footer}>
				<div className={styles.footerContent}>
					<div className={styles.legend}>
						<div className={styles.legendItem}>
							<div className={styles.legendColor} style={{ backgroundColor: '#dc2626' }}></div>
							<span>P - Potencial</span>
						</div>
						<div className={styles.legendItem}>
							<div className={styles.legendColor} style={{ backgroundColor: '#eab308' }}></div>
							<span>E - Eventos</span>
						</div>
						<div className={styles.legendItem}>
							<div className={styles.legendColor} style={{ backgroundColor: '#10b981' }}></div>
							<span>C - Control</span>
						</div>
					</div>
				</div>
			</div>

			{/* Modal */}
			{activeModal && (
				<div className={styles.modalOverlay}>
					<div className={styles.modalContent}>
						<div className={styles.modalHeader}>
							<h3 className={styles.modalTitle}>
								{activeModal.id}. {activeModal.text}
							</h3>
							<button 
								className={styles.modalCloseBtn}
								onClick={handleModalCancel}
							>
								×
							</button>
						</div>
						
						<div className={styles.modalBody}>
							{/* Options Selection with P-E-C buttons */}
							<div className={styles.optionsSection}>
								<h4 className={styles.optionsTitle}>Seleccione las opciones que aplican:</h4>
								<div className={styles.modalOptions}>
									{activeModal.options.map((option, index) => (
										<div key={index} className={styles.optionContainer}>
											<button
												className={`${styles.modalOption} ${
													modalData.selectedOptions.includes(index) ? styles.modalOptionSelected : ""
												}`}
												onClick={() => handleOptionToggle(index)}
											>
												<div className={styles.modalOptionIcon}>
													{modalData.selectedOptions.includes(index) ? "✓" : "○"}
												</div>
												<span className={styles.modalOptionText}>{option}</span>
											</button>
											
											{/* Botones P E C al costado de cada opción */}
											<div className={styles.optionPECButtons}>
												<button
													className={`${styles.optionPECButton} ${styles.optionPECP} ${
														modalData.optionsPEC[index]?.includes('P') ? styles.optionPECSelected : ""
													}`}
													onClick={() => handleOptionPECToggle(index, 'P')}
													title="Potencial"
												>
													P
												</button>
												<button
													className={`${styles.optionPECButton} ${styles.optionPECE} ${
														modalData.optionsPEC[index]?.includes('E') ? styles.optionPECSelected : ""
													}`}
													onClick={() => handleOptionPECToggle(index, 'E')}
													title="Eventos"
												>
													E
												</button>
												<button
													className={`${styles.optionPECButton} ${styles.optionPECC} ${
														modalData.optionsPEC[index]?.includes('C') ? styles.optionPECSelected : ""
													}`}
													onClick={() => handleOptionPECToggle(index, 'C')}
													title="Control"
												>
													C
												</button>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Image Upload */}
							<div className={styles.imageSection}>
								<h4 className={styles.imageTitle}>Imagen (opcional)</h4>
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleImageUpload}
									accept="image/*"
									className={styles.fileInput}
								/>

								{modalData.image ? (
									<div className={styles.imagePreviewContainer}>
										<img
											src={modalData.image}
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
										</div>
										<p>Haga clic para agregar imagen</p>
									</div>
								)}
							</div>

							{/* Comments */}
							<div className={styles.commentsSection}>
								<h4 className={styles.commentsTitle}>Comentarios</h4>
								<textarea
									className={styles.commentsTextarea}
									value={modalData.comments}
									onChange={handleCommentsChange}
									placeholder="Escriba sus comentarios aquí..."
									rows={4}
								></textarea>
							</div>
						</div>
						
						<div className={styles.modalFooter}>
							<button 
								className={styles.modalCancelBtn}
								onClick={handleModalCancel}
							>
								Cancelar
							</button>
							<button 
								className={styles.modalConfirmBtn}
								onClick={handleModalConfirm}
							>
								Confirmar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default NecesidadesControlContent;