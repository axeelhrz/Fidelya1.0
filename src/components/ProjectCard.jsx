import { FileText, Edit, FileDown, Trash2 } from "lucide-react";
import styles from "./ProjectCard.module.css";
import pdfService from "../services/pdfService";

export default function ProjectCard({ project, isHighlighted = false, onDelete }) {
	const handleDelete = (e) => {
		e.stopPropagation();
		if (onDelete) {
			const confirmed = window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.name}"?`);
			if (confirmed) {
				onDelete();
			}
		}
	};

	const handleDownloadPDF = (e) => {
		e.stopPropagation();
		
		try {
			// Crear datos de SCAT con la información disponible del proyecto
			const scatData = {
				project: project.formData || {
					evento: project.name || 'Sin título',
					involucrado: project.description || 'Sin descripción',
					area: 'No especificada',
					fechaHora: project.createdAt || new Date().toISOString(),
					investigador: 'No especificado',
					otrosDatos: ''
				},
				evaluacion: {
					severity: null,
					probability: null,
					frequency: null
				},
				contacto: {
					selectedIncidents: [],
					image: null,
					observation: ''
				},
				causasInmediatas: {
					actos: {
						selectedItems: [],
						image: null,
						observation: ''
					},
					condiciones: {
						selectedItems: [],
						image: null,
						observation: ''
					}
				},
				causasBasicas: {
					personales: {
						selectedItems: [],
						detailedSelections: {},
						image: null,
						observation: ''
					},
					laborales: {
						selectedItems: [],
						detailedSelections: {},
						image: null,
						observation: ''
					}
				},
				necesidadesControl: {
					selectedItems: [],
					detailedData: {},
					globalImage: null,
					globalObservation: ''
				}
			};

			// Generar nombre de archivo basado en el proyecto
			const fileName = `reporte-scat-${project.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.pdf`;
			
			// Descargar PDF
			pdfService.downloadPDF(scatData, fileName);
			
		} catch (error) {
			console.error('Error generating PDF:', error);
			alert('Error al generar el PDF. Por favor, intenta nuevamente.');
		}
	};

	const handleView = (e) => {
		e.stopPropagation();
		// Aquí podrías implementar la funcionalidad de ver el proyecto
		console.log('Ver proyecto:', project);
		alert('Funcionalidad de visualización en desarrollo');
	};

	const handleEdit = (e) => {
		e.stopPropagation();
		// Aquí podrías implementar la funcionalidad de editar el proyecto
		console.log('Editar proyecto:', project);
		alert('Funcionalidad de edición en desarrollo');
	};

	return (
		<div
			className={`${styles.card}${isHighlighted ? ` ${styles.highlighted}` : ""}`}
		>
			<div className={styles.content}>
				<div className={styles.title}>PROYECTO</div>
				<div className={styles.subtitle}>CREADO</div>
				{project.name && (
					<div className={styles.projectName}>{project.name}</div>
				)}
				{project.createdAt && (
					<div className={styles.projectDate}>
						{new Date(project.createdAt).toLocaleDateString('es-ES')}
					</div>
				)}
			</div>

			<div className={styles.actions}>
				<button 
					className={styles.actionButton} 
					onClick={handleView}
					title="Ver proyecto"
				>
					<FileText size={14} />
				</button>
				<button 
					className={styles.actionButton} 
					onClick={handleEdit}
					title="Editar proyecto"
				>
					<Edit size={14} />
				</button>
				<button 
					className={styles.actionButton} 
					onClick={handleDownloadPDF}
					title="Descargar proyecto como PDF"
				>
					<FileDown size={14} />
				</button>
				<button 
					className={`${styles.actionButton} ${styles.deleteButton}`} 
					onClick={handleDelete}
					title="Eliminar proyecto"
				>
					<Trash2 size={14} />
				</button>
			</div>
		</div>
	);
}