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
			? 'FACTORES RELACIONADOS CON LA PERSONA'
			: 'FACTORES RELACIONADOS CON EL TRABAJO';
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
			<div className={styles.contentCard}>
				<div className={styles.contentHeader}>
					<h2 className={styles.contentTitle}>CAUSAS BÁSICAS / SUBYACENTES</h2>
					<p className={styles.contentSubtitle}>
						Técnica de Análisis Sistemático de las Causas
					</p>
				</div>

				<div className={styles.contentBody}>
					<p className={styles.description}>
						Seleccione el tipo de causa básica que desea analizar:
					</p>

					<div className={styles.sectionSelector}>
						<button
							className={`${styles.sectionCard} ${
								causasBasicasData.personales.selectedItems.length > 0 ? styles.hasData : ''
							}`}
							onClick={() => handleSectionSelect('personales')}
						>
							<div className={styles.sectionNumber}>1</div>
							<div className={styles.sectionContent}>
								<h3 className={styles.sectionTitle}>FACTORES PERSONALES</h3>
								<p className={styles.sectionDescription}>
									Factores relacionados con la persona
								</p>
								<p className={styles.sectionRange}>Opciones 1-7</p>
								{causasBasicasData.personales.selectedItems.length > 0 && (
									<p className={styles.dataIndicator}>
										{causasBasicasData.personales.selectedItems.length} factor(es) seleccionado(s)
									</p>
								)}
							</div>
						</button>

						<button
							className={`${styles.sectionCard} ${
								causasBasicasData.laborales.selectedItems.length > 0 ? styles.hasData : ''
							}`}
							onClick={() => handleSectionSelect('laborales')}
						>
							<div className={styles.sectionNumber}>2</div>
							<div className={styles.sectionContent}>
								<h3 className={styles.sectionTitle}>FACTORES LABORALES</h3>
								<p className={styles.sectionDescription}>
									Factores relacionados con el trabajo
								</p>
								<p className={styles.sectionRange}>Opciones 8-15</p>
								{causasBasicasData.laborales.selectedItems.length > 0 && (
									<p className={styles.dataIndicator}>
										{causasBasicasData.laborales.selectedItems.length} factor(es) seleccionado(s)
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
					<div className={styles.headerActions}>
						{currentSectionData.selectedItems.length > 0 && (
							<button
								className={styles.toggleSelectedButton}
								onClick={toggleSelectedCollapse}
							>
								{isSelectedCollapsed ? '👁️ Mostrar' : '👁️‍🗨️ Ocultar'} Selecciones
							</button>
						)}
						<button
							className={styles.clearButton}
							onClick={clearAllSelections}
							disabled={currentSectionData.selectedItems.length === 0}
						>
							Limpiar Selección
						</button>
					</div>
				</div>

				<div className={styles.contentWrapper}>
					<div className={styles.itemsGridContainer}>
						{/* Barra de búsqueda */}
						<div className={styles.searchSection}>
							<input
								type="text"
								placeholder="Buscar elementos..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={styles.searchInput}
							/>
						</div>

						<div className={styles.itemsGrid}>
							{filteredItems.map((item) => (
								<button
									key={item.id}
									className={`${styles.itemCard} ${
										currentSectionData.selectedItems.includes(item.id) ? styles.selected : ""
									} ${hasDetails(item.id) ? styles.hasDetails : ""}`}
									onClick={() => handleItemClick(item.id)}
								>
									<div className={styles.itemNumber}>{item.id}</div>
									<div className={styles.itemContent}>
										<div className={styles.itemText}>{item.text}</div>
									</div>
									{currentSectionData.selectedItems.includes(item.id) && (
										<div className={styles.selectedIndicator}>✓</div>
									)}
									{hasDetails(item.id) && (
										<div className={styles.detailsIndicator}>
											{currentSectionData.detailedSelections[item.id].length} detalles
										</div>
									)}
								</button>
							))}
						</div>

						{currentSectionData.selectedItems.length > 0 && (
							<div className={`${styles.selectedSummary} ${isSelectedCollapsed ? styles.collapsed : ''}`}>
								<h4>
									Elementos Seleccionados 
									<span className={styles.selectedCount}>
										{currentSectionData.selectedItems.length}
									</span>
								</h4>
								{!isSelectedCollapsed && (
									<div className={styles.selectedList}>
										{currentSectionData.selectedItems.map((id) => {
											const item = getCurrentItems().find((item) => item.id === id);
											const detailCount = currentSectionData.detailedSelections[id]?.length || 0;
											return (
												<span 
													key={id} 
													className={`${styles.selectedTag} ${detailCount > 0 ? styles.hasDetails : ''}`}
													onClick={() => handleRemoveSelectedItem(id)}
													title="Click para deseleccionar"
												>
													{id}. {item?.text || 'Elemento no encontrado'} 
													{detailCount > 0 && ` (${detailCount} detalles)`}
												</span>
											);
										})}
									</div>
								)}
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

			{/* Modal */}
			{activeModal && (
				<div className={styles.modalOverlay}>
					<div className={styles.modalContent}>
						<div className={styles.modalHeader}>
							<h3 className={styles.modalTitle}>
								{getModalItem()?.id}. {getModalItem()?.text}
							</h3>
							<button 
								className={styles.modalCloseBtn}
								onClick={handleModalCancel}
							>
								×
							</button>
						</div>
						
						<div className={styles.modalBody}>
							<p className={styles.modalDescription}>
								Seleccione las opciones específicas que aplican:
							</p>
							
							<div className={styles.modalOptions}>
								{getModalItem()?.options.map((option, index) => (
									<button
										key={index}
										className={`${styles.modalOption} ${
											modalSelectedItems.includes(index) ? styles.modalOptionSelected : ""
										}`}
										onClick={() => handleModalItemToggle(index)}
									>
										<div className={styles.modalOptionIcon}>
											{modalSelectedItems.includes(index) ? "✓" : "○"}
										</div>
										<span className={styles.modalOptionText}>{option}</span>
									</button>
								))}
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