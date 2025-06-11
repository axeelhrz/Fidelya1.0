"use client";

import { useState } from "react";
import BaseFrame from "./components/BaseFrame";
import ScatInterface from "./components/frame3/ScatInterface";
import ProjectsView from "./components/ProjectsView";
import Description from "./components/Description";
import { ScatDataProvider } from "./contexts/ScatDataContext";
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

	const handleNavigateToDescription = () => {
		console.log("Navigating to description");
		setCurrentFrame("description");
	};

	const handleNavigateToHome = () => {
		console.log("Navigating to home");
		// Resetear todo y volver al dashboard principal
		setFormData(null);
		setCurrentFrame("base");
		// Aquí podrías agregar lógica adicional como limpiar localStorage, etc.
		localStorage.removeItem('scatProgress');
	};

	const handleStartNew = () => {
		setFormData(null);
		setCurrentFrame("base");
	};

	console.log("Current frame:", currentFrame);

	return (
		<ScatDataProvider>
			<div className={styles.app}>
				{currentFrame === "base" && (
					<BaseFrame 
						onNavigateToScat={handleNavigateToScat}
						onNavigateToProjects={handleNavigateToProjects}
					/>
				)}
				{currentFrame === "scat" && (
					<ScatInterface 
						onNavigateToBase={handleNavigateToBase}
						onNavigateToHome={handleNavigateToHome}
						onNavigateToProjects={handleNavigateToProjects}
						onNavigateToDescription={handleNavigateToDescription}
						formData={formData}
					/>
				)}
				{currentFrame === "projects" && (
					<ProjectsView 
						onNavigateToBase={handleNavigateToBase}
						onNavigateToScat={handleNavigateToScat}
					/>
				)}
				{currentFrame === "description" && (
					<Description 
						formData={formData}
						onGoBack={handleNavigateToBase}
						onStartNew={handleStartNew}
					/>
				)}
			</div>
		</ScatDataProvider>
	);
}

export default App;