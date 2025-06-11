"use client";

import { useState } from "react";
import BaseFrame from "./components/BaseFrame";
import ScatInterface from "./components/frame3/ScatInterface";
import styles from "./App.module.css";

function App() {
	const [currentFrame, setCurrentFrame] = useState("base");
	const [formData, setFormData] = useState(null);

	const handleNavigateToScat = (data) => {
		setFormData(data);
		setCurrentFrame("scat");
	};

	const handleNavigateToBase = () => {
		setCurrentFrame("base");
	};

	const handleNavigateToHome = () => {
		// Resetear todo y volver al dashboard principal
		setFormData(null);
		setCurrentFrame("base");
		// Aquí podrías agregar lógica adicional como limpiar localStorage, etc.
		localStorage.removeItem('scatProgress');
	};

	return (
		<div className={styles.app}>
			{currentFrame === "base" && (
				<BaseFrame onNavigateToScat={handleNavigateToScat} />
			)}
			{currentFrame === "scat" && (
				<ScatInterface 
					onNavigateToBase={handleNavigateToBase}
					onNavigateToHome={handleNavigateToHome}
					formData={formData}
				/>
			)}
		</div>
	);
}

export default App;