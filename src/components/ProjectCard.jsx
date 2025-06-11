import { FileText, Edit, FileDown, Trash2 } from "lucide-react";
import styles from "./ProjectCard.module.css";

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

	return (
		<div
			className={`${styles.card} ${isHighlighted ? styles.highlighted : ""}`}
		>
			<div className={styles.content}>
				<div className={styles.title}>PROYECTO</div>
				<div className={styles.subtitle}>CREADO</div>
				{project.name && (
					<div className={styles.projectName}>{project.name}</div>
				)}
			</div>

			<div className={styles.actions}>
				<button className={styles.actionButton} title="Ver proyecto">
					<FileText size={14} />
				</button>
				<button className={styles.actionButton} title="Editar proyecto">
					<Edit size={14} />
				</button>
				<button className={styles.actionButton} title="Descargar proyecto">
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