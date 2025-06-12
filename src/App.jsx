"use client";

import { useState } from "react";
import BaseFrame from "./components/BaseFrame";
import ScatInterface from "./components/frame3/ScatInterface";
import ProjectsView from "./components/ProjectsView";
import Description from "./components/Description";
import { ScatDataProvider } from "./contexts/ScatDataContext";
import { EditingProvider } from "./contexts/EditingContext";
import styles from "./App.module.css";

function App() {
	const [currentFrame, setCurrentFrame] = useState("base");
	const [formData, setFormData] = useState(null);
	const [editingProject, setEditingProject] = useState(null);

	const handleNavigateToScat = (data) => {
		console.log('=== NAVEGANDO AL SCAT ===');
		console.log('Datos recibidos:', data);
		
		setFormData(data);
		
		// Determinar si estamos editando
		if (data.isEditing && data.projectData) {
			console.log('Modo edición activado');
			setEditingProject(data.projectData);
		} else {
			console.log('Modo nuevo proyecto');
			setEditingProject(null);
		}
		
		setCurrentFrame("scat");
	};

	const handleNavigateToBase = () => {
		console.log('=== NAVEGANDO AL MENÚ PRINCIPAL ===');
		// Limpiar estados
		setFormData(null);
		setEditingProject(null);
		setCurrentFrame("base");
	};

	const handleNavigateToProjects = () => {
		console.log('=== NAVEGANDO A PROYECTOS ===');
		// Limpiar estados
		setFormData(null);
		setEditingProject(null);
		setCurrentFrame("projects");
	};

	const handleNavigateToDescription = () => {
		console.log('=== NAVEGANDO A DESCRIPCIÓN ===');
		setCurrentFrame("description");
	};

	const handleNavigateToHome = () => {
		console.log('=== NAVEGANDO AL HOME ===');
		// Reset completo
		setFormData(null);
		setEditingProject(null);
		setCurrentFrame("base");
		
		// Limpiar datos temporales
		localStorage.removeItem('scatData');
	};

	const handleStartNew = () => {
		console.log('=== INICIANDO NUEVO PROYECTO ===');
		// Limpiar todo
		setFormData(null);
		setEditingProject(null);
		setCurrentFrame("base");
		
		// Limpiar datos temporales
		localStorage.removeItem('scatData');
	};

	return (
		<EditingProvider>
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
							editingProject={editingProject}
							isEditing={formData?.isEditing || false}
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
		</EditingProvider>
	);
}

export default App;