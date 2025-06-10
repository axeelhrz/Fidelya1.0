"use client";

import { useState } from "react";
import styles from "./AccidentForm.module.css";

export default function AccidentFormModal({ isOpen, onClose, onContinue }) {
	const [formData, setFormData] = useState({
		evento: "",
		involucrado: "",
		area: "",
		fechaHora: "",
		investigador: "",
		otrosDatos: "",
	});

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleContinue = () => {
		onContinue(formData);
	};

	const formFields = [
		{
			key: "evento",
			label: "Evento",
			icon: (
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					/>
				</svg>
			),
		},
		{
			key: "involucrado",
			label: "Involucrado",
			icon: (
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
			),
		},
		{
			key: "area",
			label: "Área",
			icon: (
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			),
		},
		{
			key: "fechaHora",
			label: "Fecha y Hora",
			icon: (
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			),
		},
		{
			key: "investigador",
			label: "Investigador",
			icon: (
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			),
		},
		{
			key: "otrosDatos",
			label: "Otros datos",
			icon: (
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
					/>
				</svg>
			),
		},
	];

	if (!isOpen) return null;

	return (
		<div className={styles.modalSingle} onClick={onClose}>
			<div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
				<div className={styles.modalHeader}>
					<h2 className={styles.modalTitle}>DATOS</h2>
					<p className={styles.modalSubtitle}>ACCIDENTE / INCCIDENTE</p>
				</div>

				<div className={styles.formContainer}>
					{formFields.map((field) => (
						<div key={field.key} className={styles.formField}>
							<div className={styles.inputContainer}>
								<input
									type="text"
									placeholder={field.label}
									value={formData[field.key]}
									onChange={(e) => handleInputChange(field.key, e.target.value)}
									className={styles.formInput}
								/>
								<div className={styles.inputIcon}>{field.icon}</div>
							</div>
						</div>
					))}
				</div>

				<div className={styles.navigationContainer}>
					<button className={styles.navButton} onClick={onClose}>
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>

					<button onClick={handleContinue} className={styles.continueButton}>
						CONTINUAR
					</button>

					<button className={styles.navButton} onClick={handleContinue}>
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
