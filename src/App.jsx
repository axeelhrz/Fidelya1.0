"use client";

import { useState } from "react";
import BaseFrame from "./components/BaseFrame";
import ScatInterface from "./components/frame3/ScatInterface";
import ProjectsView from "./components/ProjectsView";
import styles from "./App.module.css";

function App() {
	const [currentFrame, setCurrentFrame] = useState("base");
	const [formData, setFormData] = useState(null);

	const handleNavigateToScat = (data) => {
		console.log("Navigating to SCAT with data:", data);
		setFormData(data);
		setCurrentFrame("scat");
	};

	const handleNavigateToBase = () => {
		console.log("Navigating to base");
		setCurrentFrame("base");
	};

	const handleNavigateToProjects = () => {
		console.log("Navigating to projects");
		setCurrentFrame("projects");
	};

	const handleNavigateToHome = () => {
		console.log("Navigating to home");
		// Resetear todo y volver al dashboard principal
		setFormData(null);
		setCurrentFrame("base");
		// Aquí podrías agregar lógica adicional como limpiar localStorage, etc.
		localStorage.removeItem('scatProgress');
	};

	console.log("Current frame:", currentFrame);

	return (
		<div className={styles.app}>
			{currentFrame === "base" && (
				<BaseFrame onNavigateToScat={handleNavigateToScat} />
			)}
			{currentFrame === "scat" && (
				<ScatInterface 
					onNavigateToBase={handleNavigateToBase}
					onNavigateToHome={handleNavigateToHome}
					onNavigateToProjects={handleNavigateToProjects}
					formData={formData}
				/>
			)}
			{currentFrame === "projects" && (
				<ProjectsView 
					onNavigateToBase={handleNavigateToBase}
					onNavigateToScat={handleNavigateToScat}
				/>
			)}
		</div>
	);
}

export default App;