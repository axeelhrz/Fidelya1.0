"use client";

import { useState, useRef } from "react";
import styles from "./CausasBasicasContent.module.css";

function CausasBasicasContent() {
	const [activeSection, setActiveSection] = useState(null);
	const [selectedItems, setSelectedItems] = useState([]);
	const [imagePreview, setImagePreview] = useState(null);
	const [observation, setObservation] = useState("");
	const fileInputRef = useRef(null);

	const factoresPersonales = [
		{ id: 1, text: "Capacidad Física / Fisiológica Inadecuada" },
		{ id: 2, text: "Capacidad Mental / Psicológica Inadecuada" },
		{ id: 3, text: "Tensión Física o Fisiológica" },
		{ id: 4, text: "Tensión Mental o Psicológica" },
		{ id: 5, text: "Falta de Conocimiento" },
		{ id: 6, text: "Falta de Habilidad" },
		{ id: 7, text: "Motivación Incorrecta" }
	];

	const factoresLaborales = [
		{ id: 8, text: "Liderazgo y/o Supervisión Deficiente" },
		{ id: 9, text: "Ingeniería Inadecuada" },
		{ id: 10, text: "Adquisiciones Deficientes" },
		{ id: 11, text: "Mantenimiento Deficiente" },
		{ id: 12, text: "Herramientas y Equipos Inadecuados" },
		{ id: 13, text: "Estándares de Trabajo Inadecuados" },
		{ id: 14, text: "Uso y Desgaste" },
		{ id: 15, text: "Abuso o Mal Uso" }
	];

	const handleSectionSelect = (section) => {
		setActiveSection(section);
		setSelectedItems([]);
		setImagePreview(null);
		setObservation("");
	};

	const handleItemToggle = (itemId) => {
		setSelectedItems((prev) => {
			if (prev.includes(itemId)) {
				return prev.filter((id) => id !== itemId);
			} else {
				return [...prev, itemId];
			}
		});
	};

	const clearAllSelections = () => {
		setSelectedItems([]);
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	const removeImage = () => {
		setImagePreview(null);
		fileInputRef.current.value = "";
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
							className={styles.sectionCard}
							onClick={() => handleSectionSelect('personales')}
						>
							<div className={styles.sectionNumber}>1</div>
							<div className={styles.sectionContent}>
								<h3 className={styles.sectionTitle}>FACTORES PERSONALES</h3>
								<p className={styles.sectionDescription}>
									Factores relacionados con la persona
								</p>
								<p className={styles.sectionRange}>Opciones 1-7</p>
							</div>
						</button>

						<button
							className={styles.sectionCard}
							onClick={() => handleSectionSelect('laborales')}
						>
							<div className={styles.sectionNumber}>2</div>
							<div className={styles.sectionContent}>
								<h3 className={styles.sectionTitle}>FACTORES LABORALES</h3>
								<p className={styles.sectionDescription}>
									Factores relacionados con el trabajo
								</p>
								<p className={styles.sectionRange}>Opciones 8-15</p>
							</div>
						</button>
					</div>
				</div>
			</div>
		);
	}

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
						disabled={selectedItems.length === 0}
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
										selectedItems.includes(item.id) ? styles.selected : ""
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

						{selectedItems.length > 0 && (
							<div className={styles.selectedSummary}>
								<h4>Elementos Seleccionados ({selectedItems.length}):</h4>
								<div className={styles.selectedList}>
									{selectedItems.map((id) => {
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

							{imagePreview ? (
								<div className={styles.imagePreviewContainer}>
									<img
										src={imagePreview || "/placeholder.svg"}
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
								value={observation}
								onChange={(e) => setObservation(e.target.value)}
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

export default CausasBasicasContent;