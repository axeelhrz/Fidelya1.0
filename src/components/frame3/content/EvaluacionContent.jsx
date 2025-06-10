import styles from "./EvaluacionContent.module.css";

import { useState } from "react";

function EvaluacionContent() {
	const [selections, setSelections] = useState({
		severity: null,
		probability: null,
		frequency: null,
	});

	const handleSelection = (category, value) => {
		setSelections((prev) => ({
			...prev,
			[category]: prev[category] === value ? null : value,
		}));
	};

	return (
		<div className={styles.riskAssessment}>
			<div className={styles.riskCategory}>
				<div className={styles.categoryLabel}>
					<span>Potencial de Severidad de Pérdida</span>
				</div>
				<div className={styles.optionsContainer}>
					<button
						className={`${styles.optionButton} ${
							selections.severity === "A" ? styles.selected : ""
						}`}
						onClick={() => handleSelection("severity", "A")}
					>
						<span className={styles.letter}>A</span>
						<span className={`${styles.value} ${styles.mayor}`}>Mayor</span>
					</button>
					<button
						className={`${styles.optionButton} ${
							selections.severity === "B" ? styles.selected : ""
						}`}
						onClick={() => handleSelection("severity", "B")}
					>
						<span className={styles.letter}>B</span>
						<span className={`${styles.value} ${styles.grave}`}>Grave</span>
					</button>
					<button
						className={`${styles.optionButton} ${
							selections.severity === "C" ? styles.selected : ""
						}`}
						onClick={() => handleSelection("severity", "C")}
					>
						<span className={styles.letter}>C</span>
						<span className={`${styles.value} ${styles.menor}`}>Menor</span>
					</button>
				</div>
			</div>

			<div className={styles.riskCategory}>
				<div className={styles.categoryLabel}>
					<span>Probabilidad de Ocurrencia</span>
				</div>
				<div className={styles.optionsContainer}>
					<button
						className={`${styles.optionButton} ${
							selections.probability === "A" ? styles.selected : ""
						}`}
						onClick={() => handleSelection("probability", "A")}
					>
						<span className={styles.letter}>A</span>
						<span className={`${styles.value} ${styles.alta}`}>Alta</span>
					</button>
					<button
						className={`${styles.optionButton} ${
							selections.probability === "B" ? styles.selected : ""
						}`}
						onClick={() => handleSelection("probability", "B")}
					>
						<span className={styles.letter}>B</span>
						<span className={`${styles.value} ${styles.moderada}`}>
							Moderada
						</span>
					</button>
					<button
						className={`${styles.optionButton} ${
							selections.probability === "C" ? styles.selected : ""
						}`}
						onClick={() => handleSelection("probability", "C")}
					>
						<span className={styles.letter}>C</span>
						<span className={`${styles.value} ${styles.rara}`}>Rara</span>
					</button>
				</div>
			</div>

			<div className={styles.riskCategory}>
				<div className={styles.categoryLabel}>
					<span>Frecuencia de Exposición</span>
				</div>
				<div className={styles.optionsContainer}>
					<button
						className={`${styles.optionButton} ${
							selections.frequency === "A" ? styles.selected : ""
						}`}
						onClick={() => handleSelection("frequency", "A")}
					>
						<span className={styles.letter}>A</span>
						<span className={`${styles.value} ${styles.grande}`}>Grande</span>
					</button>
					<button
						className={`${styles.optionButton} ${
							selections.frequency === "B" ? styles.selected : ""
						}`}
						onClick={() => handleSelection("frequency", "B")}
					>
						<span className={styles.letter}>B</span>
						<span className={`${styles.value} ${styles.moderada}`}>
							Moderada
						</span>
					</button>
					<button
						className={`${styles.optionButton} ${
							selections.frequency === "C" ? styles.selected : ""
						}`}
						onClick={() => handleSelection("frequency", "C")}
					>
						<span className={styles.letter}>C</span>
						<span className={`${styles.value} ${styles.baja}`}>Baja</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default EvaluacionContent;
