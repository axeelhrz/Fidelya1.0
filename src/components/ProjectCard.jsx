import { FileText, Edit, FileDown } from "lucide-react";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project, isHighlighted = false }) {
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
				<button className={styles.actionButton}>
					<FileText size={14} />
				</button>
				<button className={styles.actionButton}>
					<Edit size={14} />
				</button>
				<button className={styles.actionButton}>
					<FileDown size={14} />
				</button>
			</div>
		</div>
	);
}
