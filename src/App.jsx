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
	const [editingProject, setEditingProject] = useState(null);

	const handleNavigateToScat = (data) => {
		console.log("Navigating to SCAT with data:", data);
		setFormData(data);
		
		// Si estamos editando, guardar la referencia del proyecto
		if (data.isEditing && data.projectData) {
			setEditingProject(data.projectData);
		} else {
			setEditingProject(null);
		}
		
		setCurrentFrame("scat");
	};

	const handleNavigateToBase = () => {
		console.log("Navigating to base");
		setCurrentFrame("base");
		setEditingProject(null);
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
		setEditingProject(null);
		setCurrentFrame("base");
		// Aquí podrías agregar lógica adicional como limpiar localStorage, etc.
		localStorage.removeItem('scatProgress');
	};

	const handleStartNew = () => {
		setFormData(null);
		setEditingProject(null);
		setCurrentFrame("base");
	};

	const handleSaveProject = (projectData) => {
		console.log("Saving project from SCAT:", projectData);
		
		if (editingProject) {
			// Estamos editando un proyecto existente
			const updatedProject = {
				...editingProject,
				...projectData,
				lastModified: new Date().toISOString(),
				version: (editingProject.version || 1) + 1
			};
			
			// Actualizar en localStorage
			const savedProjects = localStorage.getItem('scatProjects');
			if (savedProjects) {
				const projects = JSON.parse(savedProjects);
				const updatedProjects = projects.map(p => 
					p.id === editingProject.id ? updatedProject : p
				);
				localStorage.setItem('scatProjects', JSON.stringify(updatedProjects));
			}
			
			console.log("Project updated:", updatedProject);
		}
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
						onSaveProject={handleSaveProject}
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
	);
}

export default App;