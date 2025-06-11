"use client";

import { useState } from "react";
import InitialPage from "./components/BaseFrame.jsx";
import Frame3 from "./components/frame3/ScatInterface.jsx";

function App() {
	const [currentPage, setCurrentPage] = useState("initial");
	const [formData, setFormData] = useState(null);

	const handleNavigateToNext = (data) => {
		setFormData(data);
		setCurrentPage("next");
	};

	const handleGoBack = () => {
		setCurrentPage("initial");
	};

	const handleStartNew = () => {
		setFormData(null);
		setCurrentPage("initial");
	};

	return (
		<>
			{currentPage === "initial" && (
				<InitialPage onNavigateToNext={handleNavigateToNext} />
			)}

			{currentPage === "next" && (
				<Frame3
					formData={formData}
					onGoBack={handleGoBack}
					onStartNew={handleStartNew}
				/>
			)}
		</>
	);
}

export default App;
