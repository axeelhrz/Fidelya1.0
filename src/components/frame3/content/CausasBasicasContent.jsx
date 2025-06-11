"use client";

import { useState, useRef, useMemo } from "react";
import styles from "./CausasBasicasContent.module.css";
import { useScatData } from "../../../contexts/ScatContext";

function CausasBasicasContent() {
	const { causasBasicasData, setCausasBasicasData } = useScatData();
	const [activeSection, setActiveSection] = useState(null);
	const [activeModal, setActiveModal] = useState(null);
	const [modalSelectedItems, setModalSelectedItems] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isSelectedCollapsed, setIsSelectedCollapsed] = useState(false);
	const fileInputRef = useRef(null);

	const factoresPersonales = [
		{ 
			id: 1, 
			text: "Capacidad Física / Fisiológica Inadecuada",
			options: [
				"Altura, peso, talla, fuerza, alcance, etc. inadecuados",
				"Capacidad de movimiento corporal limitada",
				"Capacidad limitada para mantenerse en determinadas posiciones corporales",
				"Limitaciones sensoriales (vista, oído, tacto, gusto, olfato, equilibrio)",
				"Incapacidad respiratoria o circulatoria",
				"Otras deficiencias físicas permanentes",
				"Deficiencias temporales"
			]
		},
		{ 
			id: 2, 
			text: "Capacidad Mental / Psicológica Inadecuada",
			options: [
				"Temores y fobias",
				"Problemas emocionales",
				"Enfermedad mental",
				"Nivel de inteligencia",
				"Incapacidad de comprensión",
				"Falta de juicio",
				"Deficiencias de coordinación",
				"Tiempo de reacción lento",
				"Aptitud mecánica deficiente",
				"Baja aptitud de aprendizaje"
			]
		},
		{ 
			id: 3, 
			text: "Tensión Física o Fisiológica",
			options: [
				"Lesión o enfermedad",
				"Fatiga debido a la carga o duración de las tareas",
				"Fatiga debido a la falta de descanso",
				"Fatiga debido a sobrecarga sensorial",
				"Exposición a riesgos contra la salud",
				"Exposición a temperaturas extremas",
				"Insuficiencia de oxígeno",
				"Variaciones en la presión atmosférica",
				"Vibración",
				"Movimiento restringido",
				"Insuficiencia de azúcar en la sangre"
			]
		},
		{ 
			id: 4, 
			text: "Tensión Mental o Psicológica",
			options: [
				"Sobrecarga emocional",
				"Fatiga debido a la carga o las exigencias mentales de la tarea",
				"Preocupaciones debido a problemas",
				"Frustración",
				"Enfermedad mental",
				"Sobrecarga sensorial"
			]
		},
		{ 
			id: 5, 
			text: "Falta de Conocimiento",
			options: [
				"Falta de experiencia",
				"Orientación deficiente",
				"Entrenamiento inicial inadecuado",
				"Reentrenamiento insuficiente",
				"Órdenes mal interpretadas"
			]
		},
		{ 
			id: 6, 
			text: "Falta de Habilidad",
			options: [
				"Instrucción inicial inadecuada",
				"Práctica insuficiente",
				"Operación esporádica",
				"Falta de preparación"
			]
		},
		{ 
			id: 7, 
			text: "Motivación Incorrecta",
			options: [
				"El desempeño subestándar es más gratificante",
				"El desempeño estándar causa desagrado",
				"Falta de incentivos",
				"Demasiadas frustraciones",
				"Falta de desafío",
				"No existe intención de ahorro de tiempo y esfuerzo",
				"Presión indebida de los compañeros",
				"Ejemplo deficiente por parte de la supervisión",
				"Retroalimentación deficiente con respecto al desempeño",
				"Falta de refuerzo positivo para el comportamiento correcto",
				"Incentivos de producción inadecuados"
			]
		}
	];

	const factoresLaborales = [
		{ 
			id: 8, 
			text: "Liderazgo y/o Supervisión Deficiente",
			options: [
				"Relaciones jerárquicas poco claras o conflictivas",
				"Asignación de responsabilidades poco clara o conflictiva",
				"Delegación inadecuada o insuficiente",
				"Definición inadecuada de políticas, procedimientos, prácticas o líneas de acción",
				"Formulación inadecuada de objetivos, metas o normas",
				"Programación o planificación inadecuada del trabajo",
				"Instrucción, orientación y/o entrenamiento inadecuados",
				"Provisión inadecuada de referencia, instrucción y orientación",
				"Identificación y evaluación inadecuadas de exposiciones a pérdidas",
				"Falta de conocimiento en el trabajo de supervisión/administración"
			]
		},
		{ 
			id: 9, 
			text: "Ingeniería Inadecuada",
			options: [
				"Evaluación inadecuada de exposiciones a pérdidas",
				"Preocupación inadecuada por los factores humanos/ergonómicos",
				"Normas, especificaciones o criterios de diseño inadecuados",
				"Control e inspección inadecuados de las construcciones",
				"Evaluación inadecuada para el uso operacional",
				"Evaluación inadecuada de la condición para el uso operacional",
				"Análisis inadecuado de tareas"
			]
		},
		{ 
			id: 10, 
			text: "Adquisiciones Deficientes",
			options: [
				"Especificaciones deficientes en cuanto a los requerimientos",
				"Investigación inadecuada acerca de materiales y equipos",
				"Especificaciones deficientes para los vendedores",
				"Modalidad o ruta de embarque inadecuada",
				"Inspecciones de recepción y aceptación inadecuadas",
				"Comunicación inadecuada de las informaciones sobre aspectos de seguridad y salud",
				"Manejo inadecuado de los materiales"
			]
		},
		{ 
			id: 11, 
			text: "Mantenimiento Deficiente",
			options: [
				"Aspectos preventivos inadecuados para evaluación de necesidades",
				"Aspectos preventivos inadecuados para lubricación y servicio",
				"Aspectos preventivos inadecuados para ajuste/ensamblaje",
				"Aspectos preventivos inadecuados para limpieza o pulimento",
				"Aspectos correctivos inadecuados para comunicación de necesidades",
				"Aspectos correctivos inadecuados para programación del trabajo",
				"Aspectos correctivos inadecuados para revisión de las piezas",
				"Aspectos correctivos inadecuados para procedimientos de reparación"
			]
		},
		{ 
			id: 12, 
			text: "Herramientas y Equipos Inadecuados",
			options: [
				"Evaluación inadecuada de necesidades y riesgos",
				"Preocupación inadecuada por los factores humanos/ergonómicos",
				"Normas o especificaciones inadecuadas",
				"Disponibilidad inadecuada",
				"Ajustes/reparación/mantenimiento deficientes",
				"Sistema inadecuado de reparación y recuperación",
				"Remoción y reemplazo inadecuados"
			]
		},
		{ 
			id: 13, 
			text: "Estándares de Trabajo Inadecuados",
			options: [
				"Desarrollo inadecuado de normas para inventarios y evaluación de exposiciones y necesidades",
				"Desarrollo inadecuado de normas para coordinación con quienes diseñan el proceso",
				"Desarrollo inadecuado de normas para compromiso del trabajador",
				"Desarrollo inadecuado de normas para estándares/procedimientos/reglas inconsistentes",
				"Comunicación inadecuada de las normas",
				"Mantenimiento inadecuado de las normas"
			]
		},
		{ 
			id: 14, 
			text: "Uso y Desgaste",
			options: [
				"Planificación inadecuada del uso",
				"Prolongación excesiva de la vida útil de elementos",
				"Inspección y/o control inadecuados",
				"Sobrecarga o sobreutilización",
				"Mantenimiento inadecuado",
				"Empleo del elemento por personas no calificadas o sin preparación"
			]
		},
		{ 
			id: 15, 
			text: "Abuso o Mal Uso",
			options: [
				"Uso por personas no calificadas o sin preparación",
				"Uso inadecuado para otros propósitos",
				"Uso inadecuado como herramienta",
				"Operación inadecuada",
				"Mantenimiento inadecuado",
				"Uso a sabiendas de que está defectuoso"
			]
		}
	];

	const handleSectionSelect = (section) => {
		setActiveSection(section);
		setSearchTerm("");
	};

	const handleItemClick = (itemId) => {
		setActiveModal(itemId);
		const currentSection = activeSection;
		const currentData = causasBasicasData[currentSection];
		setModalSelectedItems(currentData.detailedSelections[itemId] || []);
	};

	const handleModalItemToggle = (optionIndex) => {
		setModalSelectedItems((prev) => {
			if (prev.includes(optionIndex)) {
				return prev.filter((index) => index !== optionIndex);
			} else {
				return [...prev, optionIndex];
			}
		});
	};

	const handleModalConfirm = () => {
		const currentSection = activeSection;
		const currentData = causasBasicasData[currentSection];
		
		if (modalSelectedItems.length > 0) {
			// Agregar el item a selectedItems si no está
			const newSelectedItems = currentData.selectedItems.includes(activeModal)
				? currentData.selectedItems
				: [...currentData.selectedItems, activeModal];
			
			// Guardar las selecciones detalladas
			const newDetailedSelections = {
				...currentData.detailedSelections,
				[activeModal]: modalSelectedItems
			};

			setCausasBasicasData(currentSection, {
				...currentData,
				selectedItems: newSelectedItems,
				detailedSelections: newDetailedSelections
			});
		} else {
			// Si no hay selecciones, remover el item
			const newSelectedItems = currentData.selectedItems.filter(id => id !== activeModal);
			const newDetailedSelections = { ...currentData.detailedSelections };
			delete newDetailedSelections[activeModal];

			setCausasBasicasData(currentSection, {
				...currentData,
				selectedItems: newSelectedItems,
				detailedSelections: newDetailedSelections
			});
		}
		
		setActiveModal(null);
		setModalSelectedItems([]);
	};

	const handleModalCancel = () => {
		setActiveModal(null);
		setModalSelectedItems([]);
	};

	const clearAllSelections = () => {
		const currentSection = activeSection;
		setCausasBasicasData(currentSection, {
			selectedItems: [],
			detailedSelections: {},
			image: null,
			observation: ''
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
				const currentData = causasBasicasData[currentSection];
				
				setCausasBasicasData(currentSection, {
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
		const currentData = causasBasicasData[currentSection];
		
		setCausasBasicasData(currentSection, {
			...currentData,
			image: null
		});
		fileInputRef.current.value = "";
	};

	const handleObservationChange = (e) => {
		const currentSection = activeSection;
		const currentData = causasBasicasData[currentSection];
		
		setCausasBasicasData(currentSection, {
			...currentData,
			observation: e.target.value
		});
	};

	const getCurrentItems = () => {
		return activeSection === 'personales' ? factoresPersonales : factoresLaborales;
	};

	const getSectionTitle = () => {
		return activeSection === 'personales' ? 'FACTORES PERSONALES' : 'FACTORES LABORALES';
	};

	const getSectionSubtitle = () => {
		return activeSection === 'personales' 
			? 'Factores relacionados con la persona'
			: 'Factores relacionados con el trabajo';
	};

	const getModalItem = () => {
		const items = getCurrentItems();
		return items.find(item => item.id === activeModal);
	};

	const getCurrentSectionData = () => {
		return causasBasicasData[activeSection] || { 
			selectedItems: [], 
			detailedSelections: {},
			image: null, 
			observation: '' 
		};
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
		const currentSection = activeSection;
		const currentData = causasBasicasData[currentSection];
		
		// Remover de selectedItems
		const newSelectedItems = currentData.selectedItems.filter(id => id !== itemId);
		
		// Remover de detailedSelections
		const newDetailedSelections = { ...currentData.detailedSelections };
		delete newDetailedSelections[itemId];

		setCausasBasicasData(currentSection, {
			...currentData,
			selectedItems: newSelectedItems,
			detailedSelections: newDetailedSelections
		});
	};

	const hasDetails = (itemId) => {
		const currentData = getCurrentSectionData();
		return currentData.detailedSelections[itemId] && currentData.detailedSelections[itemId].length > 0;
	};

	if (!activeSection) {
		return (
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={styles.headerContent}>
						<h1 className={styles.title}>Causas Básicas</h1>
						<p className={styles.subtitle}>
							Identifique los factores subyacentes del incidente
						</p>
					</div>
				</div>

				<div className={styles.sectionGrid}>
					<div
						className={`${styles.sectionCard} ${
							causasBasicasData.personales.selectedItems.length > 0 ? styles.hasData : ''
						}`}
						onClick={() => handleSectionSelect('personales')}
					>
						<div className={styles.cardIcon}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
								<circle cx="12" cy="7" r="4"/>
							</svg>
						</div>
						<div className={styles.cardContent}>
							<h3 className={styles.cardTitle}>Factores Personales</h3>
							<p className={styles.cardDescription}>
								Factores relacionados con la persona
							</p>
							<div className={styles.cardMeta}>
								<span className={styles.itemCount}>7 factores</span>
								{causasBasicasData.personales.selectedItems.length > 0 && (
									<span className={styles.selectedCount}>
										{causasBasicasData.personales.selectedItems.length} seleccionados
									</span>
								)}
							</div>
						</div>
					</div>

					<div
						className={`${styles.sectionCard} ${
							causasBasicasData.laborales.selectedItems.length > 0 ? styles.hasData : ''
						}`}
						onClick={() => handleSectionSelect('laborales')}
					>
						<div className={styles.cardIcon}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
								<polyline points="9,22 9,12 15,12 15,22"/>
							</svg>
						</div>
						<div className={styles.cardContent}>
							<h3 className={styles.cardTitle}>Factores Laborales</h3>
							<p className={styles.cardDescription}>
								Factores relacionados con el trabajo
							</p>
							<div className={styles.cardMeta}>
								<span className={styles.itemCount}>8 factores</span>
								{causasBasicasData.laborales.selectedItems.length > 0 && (
									<span className={styles.selectedCount}>
										{causasBasicasData.laborales.selectedItems.length} seleccionados
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
								placeholder="Buscar factores..."
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
								} ${hasDetails(item.id) ? styles.hasDetails : ""}`}
								onClick={() => handleItemClick(item.id)}
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
								{hasDetails(item.id) && (
									<div className={styles.detailsBadge}>
										{currentSectionData.detailedSelections[item.id].length}
									</div>
								)}
							</div>
						))}
					</div>

					{currentSectionData.selectedItems.length > 0 && !isSelectedCollapsed && (
						<div className={styles.selectedSummary}>
							<div className={styles.summaryHeader}>
								<h4>Factores seleccionados</h4>
								<span className={styles.badge}>
									{currentSectionData.selectedItems.length}
								</span>
							</div>
							<div className={styles.selectedTags}>
								{currentSectionData.selectedItems.map((id) => {
									const item = getCurrentItems().find((item) => item.id === id);
									const detailCount = currentSectionData.detailedSelections[id]?.length || 0;
									return (
										<span 
											key={id} 
											className={`${styles.tag} ${detailCount > 0 ? styles.hasDetails : ''}`}
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveSelectedItem(id);
											}}
										>
											{id}. {item?.text || 'Factor no encontrado'} 
											{detailCount > 0 && <span className={styles.detailCount}>({detailCount})</span>}
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

			{/* Modal */}
			{activeModal && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<div className={styles.modalHeader}>
							<h3 className={styles.modalTitle}>
								{getModalItem()?.text}
							</h3>
							<button 
								className={styles.modalClose}
								onClick={handleModalCancel}
							>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<line x1="18" y1="6" x2="6" y2="18"/>
									<line x1="6" y1="6" x2="18" y2="18"/>
								</svg>
							</button>
						</div>
						
						<div className={styles.modalBody}>
							<p className={styles.modalDescription}>
								Seleccione las opciones específicas que aplican:
							</p>
							
							<div className={styles.optionsList}>
								{getModalItem()?.options.map((option, index) => (
									<label
										key={index}
										className={`${styles.option} ${
											modalSelectedItems.includes(index) ? styles.selected : ""
										}`}
									>
										<input
											type="checkbox"
											checked={modalSelectedItems.includes(index)}
											onChange={() => handleModalItemToggle(index)}
											className={styles.checkbox}
										/>
										<div className={styles.checkboxCustom}>
											{modalSelectedItems.includes(index) && (
												<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
													<polyline points="20,6 9,17 4,12"/>
												</svg>
											)}
										</div>
										<span className={styles.optionText}>{option}</span>
									</label>
								))}
							</div>
						</div>
						
						<div className={styles.modalFooter}>
							<button 
								className={styles.cancelButton}
								onClick={handleModalCancel}
							>
								Cancelar
							</button>
							<button 
								className={styles.confirmButton}
								onClick={handleModalConfirm}
							>
								Confirmar ({modalSelectedItems.length})
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default CausasBasicasContent;