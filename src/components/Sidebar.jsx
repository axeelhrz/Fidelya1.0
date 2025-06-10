"use client";

import { Home, TrendingUp, Layers, FileText, X } from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar({ isOpen, onToggle }) {
	return (
		<>
			{/* Mobile overlay */}
			{isOpen && <div className={styles.overlay} onClick={onToggle} />}

			{/* Sidebar */}
			<div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
				{/* Mobile close button */}
				<button onClick={onToggle} className={styles.closeButton}>
					<X size={20} />
				</button>

				<div className={styles.logo}>SCAT</div>

				<nav className={styles.nav}>
					<button className={styles.navButton}>
						<Home size={20} />
					</button>
					<button className={styles.navButton}>
						<TrendingUp size={20} />
					</button>
					<button className={styles.navButton}>
						<Layers size={20} />
					</button>
					<button className={styles.navButton}>
						<FileText size={20} />
					</button>
				</nav>
			</div>
		</>
	);
}
