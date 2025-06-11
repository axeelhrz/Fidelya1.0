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
		// Limpiar estados al volver al menú principal
		setFormData(null);
		setEditingProject(null);
		setCurrentFrame("base");
	};

	const handleNavigateToProjects = () => {
		// Limpiar estados al navegar a proyectos
		setFormData(null);
		setEditingProject(null);
		setCurrentFrame("projects");
	};

	const handleNavigateToDescription = () => {
		setCurrentFrame("description");
	};

	const handleNavigateToHome = () => {
		// Resetear todo y volver al dashboard principal
		setFormData(null);
		setEditingProject(null);
		setCurrentFrame("base");
		
		// Limpiar datos temporales del localStorage
		localStorage.removeItem('scatProgress');
		localStorage.removeItem('scatData');
	};

	const handleStartNew = () => {
		// Limpiar todo para empezar nuevo proyecto
		setFormData(null);
		setEditingProject(null);
		setCurrentFrame("base");
		
		// Limpiar datos temporales
		localStorage.removeItem('scatData');
	};

	const handleSaveProject = (projectData) => {
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
		}
	};

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