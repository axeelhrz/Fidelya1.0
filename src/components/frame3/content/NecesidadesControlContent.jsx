"use client";

import { useState } from "react";
import styles from "./NecesidadesControlContent.module.css";

function NecesidadesControlContent() {
	const [selectedItems, setSelectedItems] = useState([]);

	const categories = [
		{
			id: 'potencial',
			title: 'EVALUACIÓN POTENCIAL DE PÉRDIDA SIN CONTROLES',
			subtitle: 'Técnica de Análisis Sistemático de las Causas',
			color: '#dc2626',
			items: [
				{ id: 1, text: 'Capacidad Física / Fisiológica Inadecuada' },
				{ id: 2, text: 'Capacidad Mental / Psicológica Inadecuada' },
				{ id: 3, text: 'Tensión Física o Fisiológica' },
				{ id: 4, text: 'Tensión Mental o Psicológica' },
				{ id: 5, text: 'Falta de Conocimiento' },
			]
		},
		{
			id: 'contacto',
			title: 'Tipo de Contacto o Qué Contactó con Energía o Sustancia',
			subtitle: '',
			color: '#eab308',
			items: [
				{ id: 6, text: 'Golpeada Contra (chocar contra algo)' },
				{ id: 7, text: 'Golpeado por (Impactado por objeto en movimiento)' },
				{ id: 8, text: 'Caída a un nivel más bajo' },
				{ id: 9, text: 'Caída en el mismo nivel' },
				{ id: 10, text: 'Atrapado (Puntos de Pellizco y Mordida)' },
			]
		},
		{
			id: 'causas_inmediatas',
			title: '(CI) Causas Inmediatas / Directas',
			subtitle: '',
			color: '#eab308',
			items: [
				{ id: 11, text: 'Operar equipos sin autorización' },
				{ id: 12, text: 'Omitir el uso de equipos de seguridad personal' },
				{ id: 13, text: 'Omitir el uso de dispositivos de seguridad' },
				{ id: 14, text: 'Operar a velocidad inadecuada' },
				{ id: 15, text: 'Poner fuera de servicio los dispositivos de seguridad' },
			]
		},
		{
			id: 'causas_basicas',
			title: '(CB) Causas Básicas / Subyacentes',
			subtitle: '',
			color: '#eab308',
			items: [
				{ id: 16, text: 'Liderazgo y/o Supervisión Deficiente' },
				{ id: 17, text: 'Ingeniería Inadecuada' },
				{ id: 18, text: 'Adquisiciones Deficientes' },
				{ id: 19, text: 'Mantenimiento Deficiente' },
				{ id: 20, text: 'Herramientas y Equipos Inadecuados' },
			]
		},
		{
			id: 'necesidades',
			title: '(NAC) Necesidades de Acción de Control (NAC)',
			subtitle: 'Falta de Control',
			color: '#10b981',
			items: [
				{ id: 21, text: 'Programa inadecuado de mantenimiento preventivo' },
				{ id: 22, text: 'Normas inadecuadas de trabajo' },
				{ id: 23, text: 'Diseño o mantenimiento inadecuado de las instalaciones' },
				{ id: 24, text: 'Compras inadecuadas' },
				{ id: 25, text: 'Mantenimiento inadecuado' },
			]
		}
	];

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

	const getSelectedCount = () => {
		return selectedItems.length;
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
						disabled={selectedItems.length === 0}
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
							{category.items.map((item) => (
								<button
									key={item.id}
									className={`${styles.itemButton} ${
										selectedItems.includes(item.id) ? styles.selected : ""
									}`}
									onClick={() => handleItemToggle(item.id)}
								>
									<div className={styles.itemNumber}>{item.id}</div>
									<div className={styles.itemText}>{item.text}</div>
									<div className={styles.itemIcon}>
										{selectedItems.includes(item.id) ? "✓" : "○"}
									</div>
								</button>
							))}
						</div>
					</div>
				))}
			</div>

			{selectedItems.length > 0 && (
				<div className={styles.selectedSummary}>
					<h3>Elementos Seleccionados ({selectedItems.length})</h3>
					<div className={styles.selectedGrid}>
						{selectedItems.map((id) => {
							// Find the item across all categories
							let foundItem = null;
							let foundCategory = null;
							
							for (const category of categories) {
								const item = category.items.find(item => item.id === id);
								if (item) {
									foundItem = item;
									foundCategory = category;
									break;
								}
							}
							
							if (!foundItem) return null;
							
							return (
								<div key={id} className={styles.selectedItem}>
									<div 
										className={styles.selectedItemHeader}
										style={{ backgroundColor: foundCategory.color }}
									>
										<span className={styles.selectedItemNumber}>{foundItem.id}</span>
										<span className={styles.selectedItemCategory}>{foundCategory.title}</span>
									</div>
									<div className={styles.selectedItemText}>{foundItem.text}</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

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
		</div>
	);
}

export default NecesidadesControlContent;