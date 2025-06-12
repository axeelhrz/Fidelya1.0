"use client";

import { useState, useRef } from "react";
import styles from "./NecesidadesControlContent.module.css";
import { useScatData } from "../../../contexts/ScatContext";

function NecesidadesControlContent() {
	const { necesidadesControlData, setNecesidadesControlData } = useScatData();
	const [activeModal, setActiveModal] = useState(null);
	const [modalData, setModalData] = useState({
		selectedOptions: [],
		selectedPEC: null,
		image: null,
		comments: ""
	});
	const fileInputRef = useRef(null);

	const categories = [
		{
			id: 'potencial',
			title: 'EVALUACIÓN POTENCIAL DE PÉRDIDA SIN CONTROLES',
			subtitle: 'Técnica de Análisis Sistemático de las Causas',
			color: '#dc2626',
			items: [
				{ 
					id: 1, 
					text: 'Capacidad Física / Fisiológica Inadecuada',
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
					text: 'Capacidad Mental / Psicológica Inadecuada',
					options: [
						"Temores y fobias",
						"Problemas emocionales",
						"Enfermedad mental",
						"Nivel de inteligencia",
						"Incapacidad de comprensión",
						"Falta de juicio",
						"Deficiencias de coordinación"
					]
				},
				{ 
					id: 3, 
					text: 'Tensión Física o Fisiológica',
					options: [
						"Lesión o enfermedad",
						"Fatiga debido a la carga o duración de las tareas",
						"Fatiga debido a la falta de descanso",
						"Fatiga debido a sobrecarga sensorial",
						"Exposición a riesgos contra la salud"
					]
				},
				{ 
					id: 4, 
					text: 'Tensión Mental o Psicológica',
					options: [
						"Sobrecarga emocional",
						"Fatiga debido a la carga o las exigencias mentales de la tarea",
						"Preocupaciones debido a problemas",
						"Frustración",
						"Enfermedad mental"
					]
				},
				{ 
					id: 5, 
					text: 'Falta de Conocimiento',
					options: [
						"Falta de experiencia",
						"Orientación deficiente",
						"Entrenamiento inicial inadecuado",
						"Reentrenamiento insuficiente",
						"Órdenes mal interpretadas"
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
					id: 6, 
					text: 'Golpeada Contra (chocar contra algo)',
					options: [
						"Golpeado contra objeto estacionario",
						"Golpeado contra objeto en movimiento",
						"Golpeado contra superficie áspera",
						"Golpeado contra objeto punzante",
						"Golpeado contra objeto caliente"
					]
				},
				{ 
					id: 7, 
					text: 'Golpeado por (Impactado por objeto en movimiento)',
					options: [
						"Objeto volador",
						"Objeto que cae",
						"Objeto lanzado",
						"Partícula en el ojo",
						"Objeto oscilante"
					]
				},
				{ 
					id: 8, 
					text: 'Caída a un nivel más bajo',
					options: [
						"Caída desde escalera",
						"Caída desde andamio",
						"Caída desde techo",
						"Caída en excavación",
						"Caída desde vehículo"
					]
				},
				{ 
					id: 9, 
					text: 'Caída en el mismo nivel',
					options: [
						"Resbalón y caída",
						"Tropezón y caída",
						"Caída por pérdida de equilibrio",
						"Caída por superficie irregular",
						"Caída por obstáculo"
					]
				},
				{ 
					id: 10, 
					text: 'Atrapado (Puntos de Pellizco y Mordida)',
					options: [
						"Atrapado entre objetos",
						"Atrapado bajo objeto",
						"Atrapado en maquinaria",
						"Pellizco en punto de operación",
						"Mordida de equipo"
					]
				},
			]
		},
		{
			id: 'causas_inmediatas',
			title: '(CI) Causas Inmediatas / Directas',
			subtitle: '',
			color: '#eab308',
			items: [
				{ 
					id: 11, 
					text: 'Operar equipos sin autorización',
					options: [
						"Operar sin permiso",
						"Operar sin capacitación",
						"Operar fuera del horario autorizado",
						"Operar equipo restringido",
						"Operar sin supervisión requerida"
					]
				},
				{ 
					id: 12, 
					text: 'Omitir el uso de equipos de seguridad personal',
					options: [
						"No usar casco",
						"No usar guantes",
						"No usar gafas de seguridad",
						"No usar calzado de seguridad",
						"No usar arnés de seguridad"
					]
				},
				{ 
					id: 13, 
					text: 'Omitir el uso de dispositivos de seguridad',
					options: [
						"Remover guardas de seguridad",
						"Desactivar sistemas de seguridad",
						"No usar dispositivos de bloqueo",
						"Omitir procedimientos de seguridad",
						"No usar señalización requerida"
					]
				},
				{ 
					id: 14, 
					text: 'Operar a velocidad inadecuada',
					options: [
						"Operar muy rápido",
						"Operar muy lento",
						"No respetar límites de velocidad",
						"Acelerar inadecuadamente",
						"Frenar inadecuadamente"
					]
				},
				{ 
					id: 15, 
					text: 'Poner fuera de servicio los dispositivos de seguridad',
					options: [
						"Desconectar alarmas",
						"Anular sistemas de protección",
						"Remover etiquetas de seguridad",
						"Desactivar interruptores de emergencia",
						"Modificar dispositivos de seguridad"
					]
				},
			]
		},
		{
			id: 'causas_basicas',
			title: '(CB) Causas Básicas / Subyacentes',
			subtitle: '',
			color: '#eab308',
			items: [
				{ 
					id: 16, 
					text: 'Liderazgo y/o Supervisión Deficiente',
					options: [
						"Relaciones jerárquicas poco claras",
						"Asignación de responsabilidades poco clara",
						"Delegación inadecuada o insuficiente",
						"Definición inadecuada de políticas",
						"Programación inadecuada del trabajo"
					]
				},
				{ 
					id: 17, 
					text: 'Ingeniería Inadecuada',
					options: [
						"Evaluación inadecuada de exposiciones",
						"Preocupación inadecuada por factores humanos",
						"Normas de diseño inadecuadas",
						"Control de construcciones inadecuado",
						"Evaluación inadecuada para uso operacional"
					]
				},
				{ 
					id: 18, 
					text: 'Adquisiciones Deficientes',
					options: [
						"Especificaciones deficientes de requerimientos",
						"Investigación inadecuada de materiales",
						"Especificaciones deficientes para vendedores",
						"Inspecciones de recepción inadecuadas",
						"Comunicación inadecuada de aspectos de seguridad"
					]
				},
				{ 
					id: 19, 
					text: 'Mantenimiento Deficiente',
					options: [
						"Aspectos preventivos inadecuados",
						"Lubricación y servicio inadecuados",
						"Ajuste/ensamblaje inadecuados",
						"Limpieza inadecuada",
						"Comunicación de necesidades inadecuada"
					]
				},
				{ 
					id: 20, 
					text: 'Herramientas y Equipos Inadecuados',
					options: [
						"Evaluación inadecuada de necesidades",
						"Preocupación inadecuada por factores humanos",
						"Normas o especificaciones inadecuadas",
						"Disponibilidad inadecuada",
						"Ajustes/reparación/mantenimiento deficientes"
					]
				},
			]
		},
		{
			id: 'necesidades',
			title: '(NAC) Necesidades de Acción de Control (NAC)',
			subtitle: 'Falta de Control',
			color: '#10b981',
			items: [
				{ 
					id: 21, 
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
					id: 22, 
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
					id: 23, 
					text: 'Diseño o mantenimiento inadecuado de las instalaciones',
					options: [
						"Diseño deficiente de instalaciones",
						"Mantenimiento inadecuado de estructuras",
						"Falta de señalización",
						"Iluminación inadecuada",
						"Ventilación deficiente"
					]
				},
				{ 
					id: 24, 
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
					id: 25, 
					text: 'Mantenimiento inadecuado',
					options: [
						"Mantenimiento correctivo deficiente",
						"Falta de personal de mantenimiento",
						"Herramientas de mantenimiento inadecuadas",
						"Repuestos de baja calidad",
						"Documentación de mantenimiento deficiente"
					]
				},
			]
		}
	];

	const handleItemClick = (item) => {
		setActiveModal(item);
		
		// Cargar datos existentes si los hay
		const existingData = necesidadesControlData.detailedData[item.id];
		if (existingData) {
			setModalData(existingData);
		} else {
			setModalData({
				selectedOptions: [],
				selectedPEC: null,
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

	const handlePECSelect = (pec) => {
		setModalData(prev => ({
			...prev,
			selectedPEC: prev.selectedPEC === pec ? null : pec
		}));
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
						modalData.selectedPEC || 
						modalData.image || 
						modalData.comments.trim() !== "";

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
			selectedPEC: null,
			image: null,
			comments: ""
		});
	};

	const handleModalCancel = () => {
		setActiveModal(null);
		setModalData({
			selectedOptions: [],
			selectedPEC: null,
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

			<div className={styles.categoriesGrid}>
				{categories.map((category) => (
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
												{hasDetailedData.selectedPEC && 
													<span className={styles.pecIndicator}>
														{hasDetailedData.selectedPEC}
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
							{/* P-E-C Selection */}
							<div className={styles.pecSection}>
								<h4 className={styles.pecTitle}>Clasificación P-E-C</h4>
								<div className={styles.pecButtons}>
									<button
										className={`${styles.pecButton} ${styles.pecP} ${
											modalData.selectedPEC === 'P' ? styles.pecSelected : ""
										}`}
										onClick={() => handlePECSelect('P')}
									>
										P
									</button>
									<button
										className={`${styles.pecButton} ${styles.pecE} ${
											modalData.selectedPEC === 'E' ? styles.pecSelected : ""
										}`}
										onClick={() => handlePECSelect('E')}
									>
										E
									</button>
									<button
										className={`${styles.pecButton} ${styles.pecC} ${
											modalData.selectedPEC === 'C' ? styles.pecSelected : ""
										}`}
										onClick={() => handlePECSelect('C')}
									>
										C
									</button>
								</div>
							</div>

							{/* Options Selection */}
							<div className={styles.optionsSection}>
								<h4 className={styles.optionsTitle}>Seleccione las opciones que aplican:</h4>
								<div className={styles.modalOptions}>
									{activeModal.options.map((option, index) => (
										<button
											key={index}
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