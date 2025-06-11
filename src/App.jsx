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

	// Componente de prueba simple
	if (currentFrame === "test") {
		return (
			<div style={{ padding: '20px', color: 'white', backgroundColor: '#111827', minHeight: '100vh' }}>
				<h1>Test Component</h1>
				<p>Si puedes ver esto, la aplicación está funcionando.</p>
				<button onClick={() => setCurrentFrame("base")}>Ir a BaseFrame</button>
			</div>
		);
	}

	return (
		<ScatDataProvider>
			<div className={styles.app}>
				{/* Botón de prueba temporal */}
				<button 
					onClick={() => setCurrentFrame("test")}
					style={{
						position: 'fixed',
						top: '10px',
						right: '10px',
						zIndex: 9999,
						padding: '10px',
						backgroundColor: '#d97706',
						color: 'white',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer'
					}}
				>
					Test
				</button>

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