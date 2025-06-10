import styles from "./CausasInmediatasContent.module.css";

function CausasInmediatasContent() {
	const actosSubestandar = [
		{ id: 1, text: "Operar equipos sin autorización" },
		{ id: 2, text: "Omitir el uso de equipos de seguridad personal" },
		{ id: 3, text: "Omitir el uso de dispositivos de seguridad" },
		{ id: 4, text: "Operar a velocidad inadecuada" },
		{ id: 5, text: "Poner fuera de servicio los dispositivos de seguridad" },
		{ id: 6, text: "Usar equipos defectuosos" },
		{ id: 7, text: "No usar o usar inadecuadamente el equipo de protección personal" },
		{ id: 8, text: "Cargar incorrectamente" },
	];

	const condicionesSubestandar = [
		{ id: 9, text: "Guardas inadecuadas" },
		{ id: 10, text: "Equipos de protección inadecuados o insuficientes" },
		{ id: 11, text: "Herramientas, equipos o materiales defectuosos" },
		{ id: 12, text: "Espacio limitado para desenvolverse" },
		{ id: 13, text: "Sistemas de advertencia inadecuados" },
		{ id: 14, text: "Peligros de incendio y explosión" },
		{ id: 15, text: "Orden y limpieza deficientes en el lugar de trabajo" },
	];

	const necesidadesControl = [
		{ id: 16, text: "Programa inadecuado de mantenimiento preventivo" },
		{ id: 17, text: "Normas inadecuadas de trabajo" },
		{ id: 18, text: "Diseño o mantenimiento inadecuado de las instalaciones" },
		{ id: 19, text: "Compras inadecuadas" },
		{ id: 20, text: "Mantenimiento inadecuado" },
		{ id: 21, text: "Herramientas y equipos inadecuados" },
		{ id: 22, text: "Estándares inadecuados de trabajo" },
		{ id: 23, text: "Uso y desgaste normal" },
		{ id: 24, text: "Uso anormal e inesperado" },
	];

	return (
		<div className={styles.contentCard}>
			<div className={styles.contentHeader}>
				<h2 className={styles.contentTitle}>CAUSAS INMEDIATAS O DIRECTAS</h2>
				<p className={styles.contentSubtitle}>
					Técnica de Análisis Sistemático de las Causas
				</p>
			</div>

			<div className={styles.contentBody}>
				<p className={styles.description}>
					Las causas inmediatas son aquellas que están directamente relacionadas con el accidente y que normalmente son observables o se hacen sentir en el momento mismo del accidente.
				</p>

				<div className={styles.threeColumnGrid}>
					{/* Actos Subestándar */}
					<div className={styles.columnItem}>
						<h3 className={styles.columnTitle}>ACTOS SUBESTÁNDAR</h3>
						<p className={styles.columnSubtitle}>VIOLACIÓN DE UN PROCEDIMIENTO ACEPTADO COMO SEGURO</p>
						<ul className={styles.columnList}>
							{actosSubestandar.map((item) => (
								<li key={item.id} className={styles.listItem}>
									<span className={styles.itemNumber}>{item.id}</span>
									<span className={styles.itemText}>{item.text}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Condiciones Subestándar */}
					<div className={styles.columnItem}>
						<h3 className={styles.columnTitle}>CONDICIONES SUBESTÁNDAR</h3>
						<p className={styles.columnSubtitle}>CONDICIÓN O CIRCUNSTANCIA FÍSICA PELIGROSA</p>
						<ul className={styles.columnList}>
							{condicionesSubestandar.map((item) => (
								<li key={item.id} className={styles.listItem}>
									<span className={styles.itemNumber}>{item.id}</span>
									<span className={styles.itemText}>{item.text}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Necesidades de Control */}
					<div className={styles.columnItem}>
						<h3 className={styles.columnTitle}>NECESIDADES DE CONTROL</h3>
						<p className={styles.columnSubtitle}>FALTA DE CONTROL</p>
						<ul className={styles.columnList}>
							{necesidadesControl.map((item) => (
								<li key={item.id} className={styles.listItem}>
									<span className={styles.itemNumber}>{item.id}</span>
									<span className={styles.itemText}>{item.text}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CausasInmediatasContent;