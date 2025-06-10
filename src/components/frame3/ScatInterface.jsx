"use client";

import { useState } from "react";
import styles from "./ScatInterface.module.css";
import EvaluacionContent from "./content/EvaluacionContent";
import ContactoContent from "./content/ContactoContent";
import CausasInmediatasContent from "./content/CausasInmediatasContent";
import CausasBasicasContent from "./content/CausasBasicasContent";
import NecesidadesControlContent from "./content/NecesidadesControlContent";
import {
	InfoIcon,
	SaveIcon,
	GridIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
} from "./icons/Icons";

const scatSections = [
	{
		id: "evaluacion",
		title: "EVALUACIÓN POTENCIAL DE PERDIDA SI NO ES CONTROLADO",
		component: EvaluacionContent,
	},
	{
		id: "contacto",
		title: "Tipo de Contacto o Cuasi Contacto con Energía o Sustancia",
		component: ContactoContent,
	},
	{
		id: "causas-inmediatas",
		title: "(CI) Causas Inmediatas o Directas",
		component: CausasInmediatasContent,
	},
	{
		id: "causas-basicas",
		title: "(CB) Causas Básicas / Subyacentes",
		component: CausasBasicasContent,
	},
	{
		id: "necesidades-control",
		title: "(NAC) Necesidades de Acción de Control (NAC) = Falta de Control",
		component: NecesidadesControlContent,
	},
];

function ScatInterface({ onNavigateToBase }) {
	const [activeSection, setActiveSection] = useState("evaluacion");

	const handleSectionClick = (sectionId) => {
		setActiveSection(sectionId);
	};

	const ActiveComponent =
		scatSections.find((section) => section.id === activeSection)?.component ||
		EvaluacionContent;

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<div>
						<h1 className={styles.title}>TABLA SCAT</h1>
						<h2 className={styles.subtitle}>
							Técnica de Análisis Sistemático de las Causas
						</h2>
					</div>
				</div>
			</div>

			<div className={styles.navigationContainer}>
				<div className={styles.navigationButtons}>
					{scatSections.map((section) => (
						<button
							key={section.id}
							onClick={() => handleSectionClick(section.id)}
							className={`${styles.navButton} ${
								activeSection === section.id ? styles.activeButton : ""
							}`}
						>
							{section.title}
						</button>
					))}
				</div>
			</div>

			<div className={styles.contentArea}>
				<ActiveComponent />
			</div>

			<div className={styles.bottomNav}>
				<button className={styles.iconButton}>
					<InfoIcon />
				</button>
				<button className={styles.iconButton}>
					<SaveIcon />
				</button>
				<button className={`${styles.iconButton} ${styles.darkButton}`}>
					<GridIcon />
				</button>
				<button
					className={`${styles.iconButton} ${styles.darkButton}`}
					onClick={onNavigateToBase}
				>
					<ArrowLeftIcon />
				</button>
				<button className={`${styles.iconButton} ${styles.darkButton}`}>
					<ArrowRightIcon />
				</button>
			</div>
		</div>
	);
}

export default ScatInterface;
