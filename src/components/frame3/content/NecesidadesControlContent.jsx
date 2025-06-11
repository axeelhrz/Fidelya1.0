"use client";

import { useState, useRef, useMemo } from "react";
import styles from "./NecesidadesControlContent.module.css";
import { useScatData } from "../../../contexts/ScatContext";

function NecesidadesControlContent() {
	const { necesidadesControlData, setNecesidadesControlData, causasBasicasData } = useScatData();
	const [activeModal, setActiveModal] = useState(null);
	const [modalData, setModalData] = useState({
		selectedOptions: [],
		optionsPEC: {},
		image: null,
		comments: ""
	});
	const [showCorrectiveModal, setShowCorrectiveModal] = useState(false);
	const [correctiveText, setCorrectiveText] = useState("");
	const fileInputRef = useRef(null);

	// Mapeo detallado de Causas Básicas a NAC basado en las imágenes proporcionadas
	const causasBasicasToNAC = useMemo(() => ({
		// CB 1: Capacidad Física / Fisiológica Inadecuada
		1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 2: Capacidad Mental / Psicológica Inadecuada
		2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 3: Tensión Física o Fisiológica
		3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 4: Tensión Mental o Psicológica
		4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 5: Falta de Conocimiento
		5: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 6: Falta de Habilidad
		6: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 7: Motivación Incorrecta
		7: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 8: Liderazgo y/o Supervisión Deficiente
		8: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 9: Ingeniería Inadecuada
		9: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 10: Adquisiciones Deficientes
		10: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 11: Mantenimiento Deficiente
		11: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 12: Herramientas y Equipos Inadecuados
		12: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 13: Estándares de Trabajo Inadecuados
		13: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 14: Uso y Desgaste
		14: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200],
		
		// CB 15: Abuso o Mal Uso
		15: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200]
	}), []);

	// Definición completa de todos los NAC (200 elementos)
	const allNACItems = useMemo(() => [
		// NAC 1-50
		{ id: 1, text: "Selección de personal", category: "Selección y Colocación", options: ["Evaluación de competencias", "Pruebas psicotécnicas", "Verificación de referencias", "Evaluación médica", "Entrevistas estructuradas"] },
		{ id: 2, text: "Colocación de personal", category: "Selección y Colocación", options: ["Asignación según capacidades", "Rotación de puestos", "Adaptación del puesto", "Seguimiento inicial", "Evaluación de adaptación"] },
		{ id: 3, text: "Evaluación de capacidades", category: "Selección y Colocación", options: ["Evaluación física", "Evaluación mental", "Evaluación de habilidades", "Evaluación de experiencia", "Evaluación de actitudes"] },
		{ id: 4, text: "Orientación y entrenamiento inicial", category: "Entrenamiento y Desarrollo", options: ["Inducción general", "Orientación específica del puesto", "Entrenamiento en seguridad", "Presentación del equipo", "Evaluación inicial"] },
		{ id: 5, text: "Entrenamiento de habilidades", category: "Entrenamiento y Desarrollo", options: ["Entrenamiento técnico", "Desarrollo de destrezas", "Práctica supervisada", "Certificación de competencias", "Entrenamiento continuo"] },
		{ id: 6, text: "Entrenamiento de seguridad", category: "Entrenamiento y Desarrollo", options: ["Procedimientos de seguridad", "Uso de EPP", "Identificación de riesgos", "Respuesta a emergencias", "Cultura de seguridad"] },
		{ id: 7, text: "Entrenamiento de supervisores", category: "Entrenamiento y Desarrollo", options: ["Liderazgo", "Comunicación efectiva", "Gestión de equipos", "Toma de decisiones", "Resolución de conflictos"] },
		{ id: 8, text: "Entrenamiento de gerencia", category: "Entrenamiento y Desarrollo", options: ["Planificación estratégica", "Gestión de recursos", "Liderazgo organizacional", "Gestión del cambio", "Toma de decisiones ejecutivas"] },
		{ id: 9, text: "Entrenamiento profesional", category: "Entrenamiento y Desarrollo", options: ["Actualización técnica", "Certificaciones profesionales", "Desarrollo de carrera", "Especialización", "Educación continua"] },
		{ id: 10, text: "Motivación y concienciación", category: "Motivación y Concienciación", options: ["Programas motivacionales", "Reconocimiento", "Comunicación de objetivos", "Feedback positivo", "Desarrollo personal"] },
		{ id: 11, text: "Promoción general", category: "Motivación y Concienciación", options: ["Campañas de seguridad", "Comunicación interna", "Eventos de concienciación", "Material promocional", "Actividades grupales"] },
		{ id: 12, text: "Programas de incentivos", category: "Motivación y Concienciación", options: ["Bonificaciones", "Reconocimientos públicos", "Beneficios adicionales", "Oportunidades de crecimiento", "Premios por desempeño"] },
		{ id: 13, text: "Programas de reconocimiento", category: "Motivación y Concienciación", options: ["Empleado del mes", "Reconocimiento por seguridad", "Certificados de logro", "Menciones públicas", "Eventos de reconocimiento"] },
		{ id: 14, text: "Competencias y concursos", category: "Motivación y Concienciación", options: ["Concursos de seguridad", "Competencias técnicas", "Desafíos de mejora", "Torneos internos", "Olimpiadas de seguridad"] },
		{ id: 15, text: "Adaptación del trabajo al trabajador", category: "Motivación y Concienciación", options: ["Ergonomía", "Horarios flexibles", "Adaptaciones físicas", "Modificación de tareas", "Apoyo personalizado"] },
		{ id: 16, text: "Políticas de personal", category: "Motivación y Concienciación", options: ["Políticas claras", "Procedimientos justos", "Comunicación transparente", "Aplicación consistente", "Revisión periódica"] },
		{ id: 17, text: "Selección y desarrollo de líderes", category: "Liderazgo", options: ["Identificación de talentos", "Programas de desarrollo", "Mentoring", "Coaching", "Planes de sucesión"] },
		{ id: 18, text: "Definición de responsabilidades", category: "Liderazgo", options: ["Descripciones de puesto", "Matriz de responsabilidades", "Autoridad y responsabilidad", "Rendición de cuentas", "Claridad de roles"] },
		{ id: 19, text: "Normas de desempeño", category: "Liderazgo", options: ["Estándares claros", "Métricas de desempeño", "Objetivos específicos", "Evaluación regular", "Retroalimentación continua"] },
		{ id: 20, text: "Instrucciones de trabajo", category: "Liderazgo", options: ["Procedimientos detallados", "Instrucciones paso a paso", "Guías visuales", "Listas de verificación", "Actualizaciones regulares"] },
		{ id: 21, text: "Desarrollo de procedimientos", category: "Liderazgo", options: ["Análisis de procesos", "Documentación clara", "Validación de procedimientos", "Aprobación formal", "Control de versiones"] },
		{ id: 22, text: "Comunicación de procedimientos", category: "Liderazgo", options: ["Difusión efectiva", "Entrenamiento en procedimientos", "Acceso fácil", "Recordatorios regulares", "Verificación de comprensión"] },
		{ id: 23, text: "Verificación de procedimientos", category: "Liderazgo", options: ["Auditorías internas", "Observaciones directas", "Revisiones periódicas", "Feedback de usuarios", "Mejora continua"] },
		{ id: 24, text: "Desarrollo de normas de seguridad", category: "Liderazgo", options: ["Análisis de riesgos", "Mejores prácticas", "Consulta con expertos", "Revisión legal", "Aprobación formal"] },
		{ id: 25, text: "Comunicación de normas de seguridad", category: "Liderazgo", options: ["Difusión masiva", "Entrenamiento específico", "Material visual", "Recordatorios constantes", "Canales múltiples"] },
		{ id: 26, text: "Verificación de normas de seguridad", category: "Liderazgo", options: ["Inspecciones regulares", "Auditorías de cumplimiento", "Observaciones de comportamiento", "Reportes de incidentes", "Medición de indicadores"] },
		{ id: 27, text: "Análisis de tareas", category: "Ingeniería", options: ["Descomposición de tareas", "Identificación de riesgos", "Análisis ergonómico", "Secuencia de pasos", "Requerimientos de habilidades"] },
		{ id: 28, text: "Investigación de necesidades", category: "Ingeniería", options: ["Estudios de campo", "Análisis de requerimientos", "Consulta con usuarios", "Benchmarking", "Análisis de brechas"] },
		{ id: 29, text: "Desarrollo de criterios de diseño", category: "Ingeniería", options: ["Especificaciones técnicas", "Estándares de seguridad", "Criterios de desempeño", "Requerimientos ergonómicos", "Factores ambientales"] },
		{ id: 30, text: "Revisión de diseño", category: "Ingeniería", options: ["Revisión técnica", "Análisis de seguridad", "Validación de criterios", "Aprobación de diseño", "Documentación de cambios"] },
		{ id: 31, text: "Revisión de especificaciones", category: "Ingeniería", options: ["Verificación técnica", "Cumplimiento normativo", "Factibilidad", "Costos", "Plazos de entrega"] },
		{ id: 32, text: "Inspección de construcción", category: "Ingeniería", options: ["Supervisión de obra", "Control de calidad", "Verificación de especificaciones", "Pruebas de materiales", "Documentación de progreso"] },
		{ id: 33, text: "Pruebas de pre-operación", category: "Ingeniería", options: ["Pruebas funcionales", "Pruebas de seguridad", "Calibración de equipos", "Verificación de sistemas", "Documentación de resultados"] },
		{ id: 34, text: "Inspección de pre-uso", category: "Ingeniería", options: ["Verificación final", "Lista de verificación", "Pruebas de funcionamiento", "Certificación", "Entrega formal"] },
		{ id: 35, text: "Evaluación de condiciones", category: "Ingeniería", options: ["Monitoreo continuo", "Evaluación periódica", "Análisis de tendencias", "Identificación de deterioro", "Planificación de mantenimiento"] },
		{ id: 36, text: "Controles de ingeniería", category: "Ingeniería", options: ["Sistemas de protección", "Automatización", "Redundancia", "Fail-safe", "Monitoreo automático"] },
		{ id: 37, text: "Especificaciones de compra", category: "Compras", options: ["Requerimientos técnicos", "Estándares de calidad", "Criterios de seguridad", "Especificaciones de desempeño", "Certificaciones requeridas"] },
		{ id: 38, text: "Inspección de recepción", category: "Compras", options: ["Verificación de cantidad", "Control de calidad", "Inspección visual", "Pruebas básicas", "Documentación de recepción"] },
		{ id: 39, text: "Inspección de aceptación", category: "Compras", options: ["Pruebas de aceptación", "Verificación de especificaciones", "Certificación de calidad", "Aprobación formal", "Liberación para uso"] },
		{ id: 40, text: "Certificación de calidad", category: "Compras", options: ["Certificados de fabricante", "Pruebas de laboratorio", "Auditorías de calidad", "Trazabilidad", "Documentación completa"] },
		{ id: 41, text: "Comunicación de riesgos", category: "Compras", options: ["Hojas de seguridad", "Etiquetado de riesgos", "Capacitación específica", "Procedimientos de manejo", "Comunicación de cambios"] },
		{ id: 42, text: "Manejo de materiales", category: "Compras", options: ["Procedimientos de manejo", "Equipos adecuados", "Almacenamiento seguro", "Transporte interno", "Disposición final"] },
		{ id: 43, text: "Evaluación de necesidades de mantenimiento", category: "Mantenimiento", options: ["Análisis de condición", "Historial de fallas", "Criticidad de equipos", "Recursos disponibles", "Planificación de actividades"] },
		{ id: 44, text: "Trabajo de mantenimiento preventivo", category: "Mantenimiento", options: ["Programación regular", "Procedimientos estándar", "Repuestos disponibles", "Personal calificado", "Documentación de actividades"] },
		{ id: 45, text: "Programación de mantenimiento", category: "Mantenimiento", options: ["Calendario de actividades", "Asignación de recursos", "Coordinación de paradas", "Priorización de trabajos", "Seguimiento de cumplimiento"] },
		{ id: 46, text: "Trabajo de mantenimiento correctivo", category: "Mantenimiento", options: ["Respuesta rápida", "Diagnóstico efectivo", "Reparación adecuada", "Pruebas post-reparación", "Análisis de causa raíz"] },
		{ id: 47, text: "Inspecciones de mantenimiento", category: "Mantenimiento", options: ["Inspecciones rutinarias", "Monitoreo de condición", "Detección temprana", "Registro de hallazgos", "Seguimiento de acciones"] },
		{ id: 48, text: "Comunicación de necesidades", category: "Mantenimiento", options: ["Reportes de condición", "Solicitudes de trabajo", "Comunicación urgente", "Coordinación con operaciones", "Feedback de resultados"] },
		{ id: 49, text: "Evaluación de herramientas y equipos", category: "Herramientas y Equipos", options: ["Análisis de necesidades", "Evaluación de opciones", "Pruebas de campo", "Análisis costo-beneficio", "Selección final"] },
		{ id: 50, text: "Mantenimiento de herramientas", category: "Herramientas y Equipos", options: ["Mantenimiento preventivo", "Calibración regular", "Limpieza adecuada", "Almacenamiento correcto", "Registro de mantenimiento"] },

		// NAC 51-100
		{ id: 51, text: "Inspección de herramientas", category: "Herramientas y Equipos", options: ["Inspección pre-uso", "Inspección periódica", "Detección de defectos", "Registro de inspecciones", "Retiro de servicio"] },
		{ id: 52, text: "Reparación de herramientas", category: "Herramientas y Equipos", options: ["Diagnóstico de fallas", "Reparación adecuada", "Pruebas post-reparación", "Certificación de reparación", "Registro de reparaciones"] },
		{ id: 53, text: "Reemplazo de herramientas", category: "Herramientas y Equipos", options: ["Criterios de reemplazo", "Planificación de reemplazo", "Disposición adecuada", "Entrenamiento en nuevas herramientas", "Actualización de inventarios"] },
		{ id: 54, text: "Controles de uso", category: "Herramientas y Equipos", options: ["Autorización de uso", "Entrenamiento requerido", "Supervisión de uso", "Registro de uso", "Evaluación de desempeño"] },
		{ id: 55, text: "Desarrollo de normas de trabajo", category: "Normas de Trabajo", options: ["Análisis de mejores prácticas", "Consulta con expertos", "Validación en campo", "Aprobación formal", "Documentación clara"] },
		{ id: 56, text: "Comunicación de normas", category: "Normas de Trabajo", options: ["Difusión efectiva", "Entrenamiento específico", "Material de apoyo", "Canales múltiples", "Verificación de comprensión"] },
		{ id: 57, text: "Mantenimiento de normas", category: "Normas de Trabajo", options: ["Revisión periódica", "Actualización continua", "Control de versiones", "Comunicación de cambios", "Archivo histórico"] },
		{ id: 58, text: "Actualización de normas", category: "Normas de Trabajo", options: ["Identificación de necesidades", "Análisis de cambios", "Validación de actualizaciones", "Aprobación de cambios", "Implementación controlada"] },
		{ id: 59, text: "Verificación de cumplimiento", category: "Normas de Trabajo", options: ["Auditorías regulares", "Observaciones directas", "Medición de indicadores", "Reportes de desviaciones", "Acciones correctivas"] },
		{ id: 60, text: "Evaluación de desempeño", category: "Normas de Trabajo", options: ["Métricas de desempeño", "Evaluación regular", "Feedback constructivo", "Planes de mejora", "Reconocimiento de logros"] },
		{ id: 61, text: "Equipo de protección personal", category: "Protección Personal", options: ["Selección adecuada", "Entrenamiento en uso", "Mantenimiento de EPP", "Reemplazo oportuno", "Verificación de uso"] },
		{ id: 62, text: "Dispositivos de protección", category: "Protección Personal", options: ["Sistemas de protección", "Dispositivos de seguridad", "Equipos de emergencia", "Sistemas de alarma", "Equipos de rescate"] },
		{ id: 63, text: "Ropa de protección", category: "Protección Personal", options: ["Ropa especializada", "Protección térmica", "Protección química", "Ropa de alta visibilidad", "Calzado de seguridad"] },
		{ id: 64, text: "Equipos de rescate", category: "Protección Personal", options: ["Equipos de emergencia", "Sistemas de rescate", "Equipos de evacuación", "Primeros auxilios", "Comunicación de emergencia"] },
		{ id: 65, text: "Equipos de primeros auxilios", category: "Protección Personal", options: ["Botiquines completos", "Equipos especializados", "Medicamentos básicos", "Equipos de reanimación", "Sistemas de comunicación"] },
		{ id: 66, text: "Sistemas de comunicación", category: "Protección Personal", options: ["Radios de emergencia", "Sistemas de alarma", "Comunicación bidireccional", "Señales de emergencia", "Protocolos de comunicación"] },
		{ id: 67, text: "Guardas de maquinaria", category: "Controles de Ingeniería", options: ["Protecciones físicas", "Sistemas de bloqueo", "Guardas móviles", "Sistemas de detección", "Mantenimiento de guardas"] },
		{ id: 68, text: "Dispositivos de seguridad", category: "Controles de Ingeniería", options: ["Sistemas de parada", "Dispositivos de bloqueo", "Sensores de seguridad", "Sistemas de alivio", "Controles de emergencia"] },
		{ id: 69, text: "Sistemas de ventilación", category: "Controles de Ingeniería", options: ["Ventilación general", "Extracción localizada", "Filtración de aire", "Monitoreo de calidad", "Mantenimiento de sistemas"] },
		{ id: 70, text: "Sistemas de iluminación", category: "Controles de Ingeniería", options: ["Iluminación adecuada", "Iluminación de emergencia", "Control de deslumbramiento", "Mantenimiento de luminarias", "Eficiencia energética"] },
		{ id: 71, text: "Controles de ruido", category: "Controles de Ingeniería", options: ["Reducción en la fuente", "Aislamiento acústico", "Absorción de ruido", "Mantenimiento preventivo", "Monitoreo de niveles"] },
		{ id: 72, text: "Controles de temperatura", category: "Controles de Ingeniería", options: ["Sistemas de climatización", "Aislamiento térmico", "Ventilación natural", "Monitoreo continuo", "Protección personal"] },
		{ id: 73, text: "Señalización de seguridad", category: "Señalización", options: ["Señales de advertencia", "Señales de prohibición", "Señales de obligación", "Señales de emergencia", "Mantenimiento de señales"] },
		{ id: 74, text: "Códigos de colores", category: "Señalización", options: ["Estándares de colores", "Identificación de riesgos", "Códigos de tuberías", "Identificación de equipos", "Consistencia visual"] },
		{ id: 75, text: "Etiquetado de riesgos", category: "Señalización", options: ["Etiquetas de peligro", "Información de riesgos", "Instrucciones de seguridad", "Pictogramas", "Actualización regular"] },
		{ id: 76, text: "Marcado de equipos", category: "Señalización", options: ["Identificación única", "Estado operacional", "Información técnica", "Historial de mantenimiento", "Trazabilidad"] },
		{ id: 77, text: "Instrucciones visuales", category: "Señalización", options: ["Diagramas de flujo", "Instrucciones paso a paso", "Ayudas visuales", "Recordatorios gráficos", "Información clara"] },
		{ id: 78, text: "Avisos de advertencia", category: "Señalización", options: ["Alertas tempranas", "Comunicación de riesgos", "Instrucciones específicas", "Contactos de emergencia", "Actualizaciones oportunas"] },
		{ id: 79, text: "Inspecciones planeadas", category: "Inspecciones", options: ["Programación regular", "Listas de verificación", "Personal calificado", "Documentación completa", "Seguimiento de hallazgos"] },
		{ id: 80, text: "Inspecciones de seguridad", category: "Inspecciones", options: ["Identificación de riesgos", "Evaluación de controles", "Verificación de cumplimiento", "Recomendaciones", "Planes de acción"] },
		{ id: 81, text: "Auditorías de sistemas", category: "Inspecciones", options: ["Evaluación sistemática", "Verificación de efectividad", "Identificación de brechas", "Recomendaciones de mejora", "Seguimiento de implementación"] },
		{ id: 82, text: "Observaciones de trabajo", category: "Inspecciones", options: ["Observación directa", "Análisis de comportamiento", "Feedback inmediato", "Identificación de riesgos", "Refuerzo positivo"] },
		{ id: 83, text: "Inspecciones de equipos", category: "Inspecciones", options: ["Verificación de condición", "Detección de defectos", "Evaluación de desempeño", "Planificación de mantenimiento", "Registro de hallazgos"] },
		{ id: 84, text: "Monitoreo de condiciones", category: "Inspecciones", options: ["Monitoreo continuo", "Análisis de tendencias", "Alertas tempranas", "Evaluación de riesgos", "Acciones preventivas"] },
		{ id: 85, text: "Investigación de accidentes", category: "Investigación", options: ["Metodología sistemática", "Análisis de causas", "Recolección de evidencia", "Entrevistas", "Recomendaciones"] },
		{ id: 86, text: "Análisis de causas", category: "Investigación", options: ["Técnicas de análisis", "Identificación de causas raíz", "Análisis de factores", "Validación de hallazgos", "Planes de acción"] },
		{ id: 87, text: "Investigación de incidentes", category: "Investigación", options: ["Respuesta inmediata", "Preservación de evidencia", "Análisis preliminar", "Investigación detallada", "Lecciones aprendidas"] },
		{ id: 88, text: "Análisis de tendencias", category: "Investigación", options: ["Recolección de datos", "Análisis estadístico", "Identificación de patrones", "Predicción de riesgos", "Acciones preventivas"] },
		{ id: 89, text: "Evaluación de riesgos", category: "Investigación", options: ["Identificación de peligros", "Análisis de probabilidad", "Evaluación de consecuencias", "Matriz de riesgos", "Planes de control"] },
		{ id: 90, text: "Estudios de seguridad", category: "Investigación", options: ["Análisis de procesos", "Evaluación de sistemas", "Benchmarking", "Mejores prácticas", "Recomendaciones"] },
		{ id: 91, text: "Preparación para emergencias", category: "Preparación para Emergencias", options: ["Planes de emergencia", "Procedimientos específicos", "Recursos necesarios", "Coordinación externa", "Comunicación de crisis"] },
		{ id: 92, text: "Planificación de emergencias", category: "Preparación para Emergencias", options: ["Análisis de escenarios", "Desarrollo de planes", "Asignación de roles", "Recursos de emergencia", "Coordinación interinstitucional"] },
		{ id: 93, text: "Equipos de emergencia", category: "Preparación para Emergencias", options: ["Equipos especializados", "Mantenimiento preventivo", "Ubicación estratégica", "Acceso rápido", "Entrenamiento en uso"] },
		{ id: 94, text: "Entrenamiento de emergencias", category: "Preparación para Emergencias", options: ["Capacitación específica", "Simulacros regulares", "Evaluación de respuesta", "Mejora continua", "Certificación de competencias"] },
		{ id: 95, text: "Simulacros de emergencia", category: "Preparación para Emergencias", options: ["Planificación de simulacros", "Ejecución realista", "Evaluación de desempeño", "Identificación de mejoras", "Actualización de planes"] },
		{ id: 96, text: "Comunicación de emergencias", category: "Preparación para Emergencias", options: ["Sistemas de alerta", "Protocolos de comunicación", "Canales múltiples", "Comunicación externa", "Información al público"] },
		{ id: 97, text: "Atención médica", category: "Servicios Médicos", options: ["Servicios médicos", "Atención de emergencia", "Primeros auxilios", "Evacuación médica", "Seguimiento médico"] },
		{ id: 98, text: "Primeros auxilios", category: "Servicios Médicos", options: ["Entrenamiento básico", "Equipos de primeros auxilios", "Respuesta inmediata", "Estabilización", "Comunicación con servicios médicos"] },
		{ id: 99, text: "Exámenes médicos", category: "Servicios Médicos", options: ["Exámenes pre-empleo", "Exámenes periódicos", "Exámenes post-incidente", "Vigilancia médica", "Evaluación de aptitud"] },
		{ id: 100, text: "Tratamiento médico", category: "Servicios Médicos", options: ["Atención especializada", "Tratamiento oportuno", "Seguimiento médico", "Rehabilitación", "Retorno al trabajo"] },

		// NAC 101-150
		{ id: 101, text: "Rehabilitación", category: "Servicios Médicos", options: ["Programas de rehabilitación", "Terapia física", "Adaptación laboral", "Seguimiento médico", "Reintegración laboral"] },
		{ id: 102, text: "Servicios de salud ocupacional", category: "Servicios Médicos", options: ["Medicina ocupacional", "Higiene industrial", "Ergonomía", "Vigilancia epidemiológica", "Promoción de la salud"] },
		{ id: 103, text: "Comunicación general", category: "Comunicaciones", options: ["Canales de comunicación", "Información regular", "Feedback bidireccional", "Comunicación clara", "Acceso a información"] },
		{ id: 104, text: "Reuniones de seguridad", category: "Comunicaciones", options: ["Reuniones regulares", "Temas específicos", "Participación activa", "Seguimiento de acuerdos", "Documentación de reuniones"] },
		{ id: 105, text: "Contactos personales", category: "Comunicaciones", options: ["Comunicación directa", "Relaciones interpersonales", "Confianza mutua", "Feedback personal", "Resolución de conflictos"] },
		{ id: 106, text: "Observaciones de grupo", category: "Comunicaciones", options: ["Dinámicas grupales", "Observación de comportamientos", "Feedback grupal", "Mejora de procesos", "Trabajo en equipo"] },
		{ id: 107, text: "Comunicación escrita", category: "Comunicaciones", options: ["Documentos claros", "Procedimientos escritos", "Comunicados oficiales", "Registro de comunicaciones", "Archivo de información"] },
		{ id: 108, text: "Sistemas de información", category: "Comunicaciones", options: ["Sistemas digitales", "Base de datos", "Acceso controlado", "Actualización regular", "Respaldo de información"] },
		{ id: 109, text: "Comités de seguridad", category: "Organización", options: ["Estructura formal", "Representación amplia", "Reuniones regulares", "Toma de decisiones", "Seguimiento de acuerdos"] },
		{ id: 110, text: "Coordinación de actividades", category: "Organización", options: ["Planificación conjunta", "Sincronización de actividades", "Comunicación efectiva", "Resolución de conflictos", "Optimización de recursos"] },
		{ id: 111, text: "Asignación de responsabilidades", category: "Organización", options: ["Definición clara", "Autoridad correspondiente", "Rendición de cuentas", "Evaluación de desempeño", "Ajustes necesarios"] },
		{ id: 112, text: "Estructura organizacional", category: "Organización", options: ["Organigrama claro", "Líneas de autoridad", "Canales de comunicación", "Roles definidos", "Flexibilidad organizacional"] },
		{ id: 113, text: "Delegación de autoridad", category: "Organización", options: ["Delegación efectiva", "Límites claros", "Seguimiento adecuado", "Desarrollo de capacidades", "Responsabilidad compartida"] },
		{ id: 114, text: "Coordinación interdepartamental", category: "Organización", options: ["Comunicación entre áreas", "Objetivos comunes", "Resolución de conflictos", "Optimización de procesos", "Trabajo colaborativo"] },
		{ id: 115, text: "Actividades de grupos", category: "Actividades de Grupo", options: ["Trabajo en equipo", "Proyectos grupales", "Dinámicas de grupo", "Colaboración efectiva", "Sinergia grupal"] },
		{ id: 116, text: "Participación de empleados", category: "Actividades de Grupo", options: ["Involucramiento activo", "Toma de decisiones participativa", "Sugerencias de mejora", "Empoderamiento", "Reconocimiento de aportes"] },
		{ id: 117, text: "Círculos de calidad", category: "Actividades de Grupo", options: ["Grupos de mejora", "Análisis de problemas", "Soluciones creativas", "Implementación de mejoras", "Medición de resultados"] },
		{ id: 118, text: "Equipos de mejora", category: "Actividades de Grupo", options: ["Equipos multidisciplinarios", "Proyectos específicos", "Metodologías de mejora", "Seguimiento de resultados", "Reconocimiento de logros"] },
		{ id: 119, text: "Grupos de trabajo", category: "Actividades de Grupo", options: ["Objetivos específicos", "Roles definidos", "Cronogramas claros", "Recursos adecuados", "Evaluación de resultados"] },
		{ id: 120, text: "Comités de acción", category: "Actividades de Grupo", options: ["Respuesta rápida", "Toma de decisiones", "Implementación de acciones", "Seguimiento de resultados", "Comunicación de avances"] },
		{ id: 121, text: "Disciplina progresiva", category: "Disciplina", options: ["Proceso estructurado", "Escalamiento gradual", "Documentación adecuada", "Oportunidades de mejora", "Aplicación justa"] },
		{ id: 122, text: "Refuerzo positivo", category: "Disciplina", options: ["Reconocimiento oportuno", "Incentivos apropiados", "Feedback positivo", "Motivación intrínseca", "Cultura de reconocimiento"] },
		{ id: 123, text: "Corrección de comportamiento", category: "Disciplina", options: ["Identificación temprana", "Intervención oportuna", "Coaching efectivo", "Seguimiento continuo", "Apoyo al cambio"] },
		{ id: 124, text: "Consecuencias por incumplimiento", category: "Disciplina", options: ["Consecuencias claras", "Aplicación consistente", "Proporcionalidad", "Debido proceso", "Oportunidades de mejora"] },
		{ id: 125, text: "Reconocimiento por cumplimiento", category: "Disciplina", options: ["Sistemas de reconocimiento", "Premios y incentivos", "Reconocimiento público", "Oportunidades de crecimiento", "Cultura de excelencia"] },
		{ id: 126, text: "Sistemas de recompensas", category: "Disciplina", options: ["Recompensas apropiadas", "Criterios claros", "Aplicación justa", "Variedad de opciones", "Impacto motivacional"] },
		{ id: 127, text: "Controles administrativos", category: "Controles Administrativos", options: ["Políticas claras", "Procedimientos definidos", "Sistemas de autorización", "Control de acceso", "Documentación adecuada"] },
		{ id: 128, text: "Políticas y procedimientos", category: "Controles Administrativos", options: ["Desarrollo participativo", "Comunicación efectiva", "Actualización regular", "Cumplimiento verificado", "Mejora continua"] },
		{ id: 129, text: "Permisos de trabajo", category: "Controles Administrativos", options: ["Sistemas de permisos", "Evaluación de riesgos", "Autorización formal", "Supervisión adecuada", "Cierre formal"] },
		{ id: 130, text: "Sistemas de autorización", category: "Controles Administrativos", options: ["Niveles de autorización", "Criterios claros", "Proceso eficiente", "Trazabilidad", "Revisión periódica"] },
		{ id: 131, text: "Control de acceso", category: "Controles Administrativos", options: ["Sistemas de seguridad", "Identificación personal", "Áreas restringidas", "Monitoreo de acceso", "Actualización de permisos"] },
		{ id: 132, text: "Rotación de personal", category: "Controles Administrativos", options: ["Planificación de rotación", "Desarrollo de competencias", "Prevención de fatiga", "Conocimiento amplio", "Flexibilidad operacional"] },
		{ id: 133, text: "Evaluación de proveedores", category: "Gestión de Contratistas", options: ["Criterios de evaluación", "Proceso de selección", "Verificación de capacidades", "Evaluación continua", "Mejora de desempeño"] },
		{ id: 134, text: "Selección de contratistas", category: "Gestión de Contratistas", options: ["Proceso de licitación", "Evaluación técnica", "Verificación de referencias", "Análisis de propuestas", "Selección objetiva"] },
		{ id: 135, text: "Orientación de contratistas", category: "Gestión de Contratistas", options: ["Inducción específica", "Requisitos de seguridad", "Procedimientos aplicables", "Expectativas claras", "Evaluación inicial"] },
		{ id: 136, text: "Supervisión de contratistas", category: "Gestión de Contratistas", options: ["Supervisión continua", "Verificación de cumplimiento", "Apoyo técnico", "Resolución de problemas", "Evaluación de desempeño"] },
		{ id: 137, text: "Evaluación de desempeño de contratistas", category: "Gestión de Contratistas", options: ["Métricas de desempeño", "Evaluación regular", "Feedback constructivo", "Planes de mejora", "Reconocimiento de logros"] },
		{ id: 138, text: "Coordinación con contratistas", category: "Gestión de Contratistas", options: ["Comunicación efectiva", "Coordinación de actividades", "Resolución de conflictos", "Trabajo colaborativo", "Objetivos comunes"] },
		{ id: 139, text: "Gestión del cambio", category: "Gestión del Cambio", options: ["Proceso formal", "Análisis de impacto", "Planificación detallada", "Comunicación efectiva", "Seguimiento de resultados"] },
		{ id: 140, text: "Análisis de impacto", category: "Gestión del Cambio", options: ["Evaluación de riesgos", "Análisis de beneficios", "Impacto en operaciones", "Recursos requeridos", "Cronograma de implementación"] },
		{ id: 141, text: "Autorización de cambios", category: "Gestión del Cambio", options: ["Proceso de aprobación", "Niveles de autorización", "Documentación formal", "Comunicación de decisiones", "Registro de cambios"] },
		{ id: 142, text: "Comunicación de cambios", category: "Gestión del Cambio", options: ["Plan de comunicación", "Audiencias objetivo", "Mensajes claros", "Canales apropiados", "Feedback bidireccional"] },
		{ id: 143, text: "Entrenamiento para cambios", category: "Gestión del Cambio", options: ["Necesidades de entrenamiento", "Programas específicos", "Métodos efectivos", "Evaluación de competencias", "Soporte continuo"] },
		{ id: 144, text: "Seguimiento de cambios", category: "Gestión del Cambio", options: ["Monitoreo de implementación", "Medición de resultados", "Identificación de problemas", "Acciones correctivas", "Lecciones aprendidas"] },
		{ id: 145, text: "Análisis de riesgos del proceso", category: "Seguridad del Proceso", options: ["Identificación de peligros", "Análisis de escenarios", "Evaluación de consecuencias", "Medidas de control", "Documentación de análisis"] },
		{ id: 146, text: "Información de seguridad del proceso", category: "Seguridad del Proceso", options: ["Datos de seguridad", "Información de procesos", "Límites operacionales", "Procedimientos de emergencia", "Actualización continua"] },
		{ id: 147, text: "Procedimientos operativos", category: "Seguridad del Proceso", options: ["Procedimientos detallados", "Instrucciones claras", "Límites de operación", "Respuesta a desviaciones", "Actualización regular"] },
		{ id: 148, text: "Entrenamiento de operadores", category: "Seguridad del Proceso", options: ["Competencias requeridas", "Programas de entrenamiento", "Evaluación de habilidades", "Certificación", "Entrenamiento continuo"] },
		{ id: 149, text: "Integridad mecánica", category: "Seguridad del Proceso", options: ["Mantenimiento preventivo", "Inspecciones regulares", "Pruebas de integridad", "Gestión de cambios", "Documentación completa"] },
		{ id: 150, text: "Investigación de incidentes del proceso", category: "Seguridad del Proceso", options: ["Metodología sistemática", "Análisis de causas", "Recomendaciones", "Implementación de mejoras", "Seguimiento de efectividad"] },

		// NAC 151-200
		{ id: 151, text: "Auditorías de cumplimiento", category: "Auditorías y Revisiones", options: ["Programas de auditoría", "Verificación de cumplimiento", "Identificación de brechas", "Planes de acción", "Seguimiento de mejoras"] },
		{ id: 152, text: "Revisiones de seguridad", category: "Auditorías y Revisiones", options: ["Evaluación sistemática", "Análisis de efectividad", "Identificación de oportunidades", "Recomendaciones", "Implementación de mejoras"] },
		{ id: 153, text: "Evaluaciones de riesgo", category: "Auditorías y Revisiones", options: ["Metodologías de evaluación", "Identificación de peligros", "Análisis de riesgos", "Medidas de control", "Monitoreo continuo"] },
		{ id: 154, text: "Revisiones de diseño", category: "Auditorías y Revisiones", options: ["Evaluación técnica", "Análisis de seguridad", "Cumplimiento normativo", "Optimización de diseño", "Aprobación formal"] },
		{ id: 155, text: "Análisis de efectividad", category: "Auditorías y Revisiones", options: ["Medición de resultados", "Análisis de indicadores", "Evaluación de impacto", "Identificación de mejoras", "Optimización de recursos"] },
		{ id: 156, text: "Benchmarking", category: "Auditorías y Revisiones", options: ["Comparación con mejores prácticas", "Análisis de brechas", "Identificación de oportunidades", "Planes de mejora", "Implementación de cambios"] },
		{ id: 157, text: "Sistemas de gestión", category: "Sistemas de Gestión", options: ["Desarrollo de sistemas", "Implementación efectiva", "Mantenimiento continuo", "Mejora continua", "Certificación"] },
		{ id: 158, text: "Documentación de sistemas", category: "Sistemas de Gestión", options: ["Documentación completa", "Control de versiones", "Acceso controlado", "Actualización regular", "Archivo histórico"] },
		{ id: 159, text: "Implementación de sistemas", category: "Sistemas de Gestión", options: ["Planificación detallada", "Recursos adecuados", "Entrenamiento específico", "Seguimiento de progreso", "Evaluación de resultados"] },
		{ id: 160, text: "Mantenimiento de sistemas", category: "Sistemas de Gestión", options: ["Operación continua", "Mantenimiento preventivo", "Actualización regular", "Resolución de problemas", "Optimización de desempeño"] },
		{ id: 161, text: "Mejora continua", category: "Sistemas de Gestión", options: ["Ciclo de mejora", "Identificación de oportunidades", "Implementación de cambios", "Medición de resultados", "Sostenibilidad"] },
		{ id: 162, text: "Certificación de sistemas", category: "Sistemas de Gestión", options: ["Preparación para auditoría", "Cumplimiento de estándares", "Certificación externa", "Mantenimiento de certificación", "Mejora continua"] },
		{ id: 163, text: "Cultura organizacional", category: "Cultura y Comportamiento", options: ["Desarrollo de cultura", "Valores compartidos", "Comportamientos esperados", "Liderazgo visible", "Comunicación efectiva"] },
		{ id: 164, text: "Comportamiento seguro", category: "Cultura y Comportamiento", options: ["Promoción de comportamientos", "Refuerzo positivo", "Eliminación de barreras", "Modelado de liderazgo", "Medición de comportamientos"] },
		{ id: 165, text: "Liderazgo visible", category: "Cultura y Comportamiento", options: ["Compromiso de liderazgo", "Presencia en campo", "Comunicación directa", "Modelado de comportamientos", "Apoyo a iniciativas"] },
		{ id: 166, text: "Participación de empleados", category: "Cultura y Comportamiento", options: ["Involucramiento activo", "Toma de decisiones participativa", "Sugerencias de mejora", "Empoderamiento", "Reconocimiento de aportes"] },
		{ id: 167, text: "Comunicación de valores", category: "Cultura y Comportamiento", options: ["Definición clara", "Comunicación consistente", "Refuerzo continuo", "Integración en procesos", "Evaluación de comprensión"] },
		{ id: 168, text: "Desarrollo de competencias", category: "Cultura y Comportamiento", options: ["Identificación de necesidades", "Programas de desarrollo", "Evaluación de competencias", "Planes de carrera", "Reconocimiento de logros"] },
		{ id: 169, text: "Tecnología de seguridad", category: "Tecnología y Automatización", options: ["Sistemas avanzados", "Automatización de procesos", "Monitoreo inteligente", "Alertas tempranas", "Integración de sistemas"] },
		{ id: 170, text: "Sistemas de monitoreo", category: "Tecnología y Automatización", options: ["Monitoreo continuo", "Análisis de datos", "Alertas automáticas", "Tendencias predictivas", "Respuesta automatizada"] },
		{ id: 171, text: "Automatización de procesos", category: "Tecnología y Automatización", options: ["Procesos automatizados", "Reducción de errores", "Eficiencia operacional", "Control de calidad", "Mantenimiento predictivo"] },
		{ id: 172, text: "Sistemas de alerta", category: "Tecnología y Automatización", options: ["Detección temprana", "Alertas automáticas", "Escalamiento de alarmas", "Respuesta rápida", "Registro de eventos"] },
		{ id: 173, text: "Inteligencia artificial", category: "Tecnología y Automatización", options: ["Análisis predictivo", "Reconocimiento de patrones", "Optimización automática", "Toma de decisiones", "Aprendizaje continuo"] },
		{ id: 174, text: "Internet de las cosas", category: "Tecnología y Automatización", options: ["Sensores inteligentes", "Conectividad total", "Datos en tiempo real", "Análisis avanzado", "Respuesta automática"] },
		{ id: 175, text: "Sostenibilidad ambiental", category: "Sostenibilidad", options: ["Gestión ambiental", "Reducción de impactos", "Eficiencia de recursos", "Energías renovables", "Economía circular"] },
		{ id: 176, text: "Responsabilidad social", category: "Sostenibilidad", options: ["Compromiso social", "Desarrollo comunitario", "Relaciones con stakeholders", "Transparencia", "Impacto positivo"] },
		{ id: 177, text: "Eficiencia energética", category: "Sostenibilidad", options: ["Optimización energética", "Tecnologías eficientes", "Monitoreo de consumo", "Reducción de emisiones", "Energías alternativas"] },
		{ id: 178, text: "Gestión de residuos", category: "Sostenibilidad", options: ["Minimización de residuos", "Reciclaje y reutilización", "Tratamiento adecuado", "Disposición segura", "Economía circular"] },
		{ id: 179, text: "Conservación de recursos", category: "Sostenibilidad", options: ["Uso eficiente", "Conservación de agua", "Materiales sostenibles", "Procesos optimizados", "Reducción de desperdicios"] },
		{ id: 180, text: "Innovación sostenible", category: "Sostenibilidad", options: ["Tecnologías limpias", "Procesos innovadores", "Productos sostenibles", "Investigación y desarrollo", "Colaboración externa"] },
		{ id: 181, text: "Gestión de crisis", category: "Gestión de Crisis", options: ["Planes de crisis", "Equipos de respuesta", "Comunicación de crisis", "Toma de decisiones", "Recuperación rápida"] },
		{ id: 182, text: "Continuidad del negocio", category: "Gestión de Crisis", options: ["Planes de continuidad", "Análisis de impacto", "Estrategias de recuperación", "Recursos alternativos", "Pruebas regulares"] },
		{ id: 183, text: "Comunicación de crisis", category: "Gestión de Crisis", options: ["Protocolos de comunicación", "Portavoces designados", "Mensajes consistentes", "Medios de comunicación", "Stakeholders clave"] },
		{ id: 184, text: "Recuperación post-crisis", category: "Gestión de Crisis", options: ["Evaluación de daños", "Planes de recuperación", "Restauración de operaciones", "Lecciones aprendidas", "Mejora de preparación"] },
		{ id: 185, text: "Resiliencia organizacional", category: "Gestión de Crisis", options: ["Capacidad de adaptación", "Flexibilidad operacional", "Redundancia de sistemas", "Cultura resiliente", "Aprendizaje continuo"] },
		{ id: 186, text: "Gestión de stakeholders", category: "Gestión de Crisis", options: ["Identificación de stakeholders", "Comunicación efectiva", "Gestión de expectativas", "Relaciones sólidas", "Colaboración mutua"] },
		{ id: 187, text: "Innovación en seguridad", category: "Innovación", options: ["Nuevas tecnologías", "Métodos innovadores", "Soluciones creativas", "Investigación aplicada", "Implementación piloto"] },
		{ id: 188, text: "Investigación y desarrollo", category: "Innovación", options: ["Proyectos de I+D", "Colaboración académica", "Desarrollo de prototipos", "Pruebas de concepto", "Transferencia de tecnología"] },
		{ id: 189, text: "Colaboración externa", category: "Innovación", options: ["Alianzas estratégicas", "Redes de colaboración", "Intercambio de conocimiento", "Proyectos conjuntos", "Benchmarking externo"] },
		{ id: 190, text: "Gestión del conocimiento", category: "Innovación", options: ["Captura de conocimiento", "Almacenamiento organizado", "Compartir experiencias", "Aplicación práctica", "Actualización continua"] },
		{ id: 191, text: "Transformación digital", category: "Innovación", options: ["Digitalización de procesos", "Plataformas digitales", "Análisis de big data", "Automatización inteligente", "Experiencia digital"] },
		{ id: 192, text: "Agilidad organizacional", category: "Innovación", options: ["Adaptabilidad rápida", "Procesos ágiles", "Equipos flexibles", "Toma de decisiones rápida", "Innovación continua"] },
		{ id: 193, text: "Medición y análisis", category: "Medición y Análisis", options: ["Indicadores clave", "Recolección de datos", "Análisis estadístico", "Reportes regulares", "Toma de decisiones basada en datos"] },
		{ id: 194, text: "Indicadores de desempeño", category: "Medición y Análisis", options: ["KPIs relevantes", "Métricas de seguridad", "Indicadores predictivos", "Benchmarking", "Mejora continua"] },
		{ id: 195, text: "Análisis de datos", category: "Medición y Análisis", options: ["Análisis avanzado", "Identificación de patrones", "Análisis predictivo", "Visualización de datos", "Insights accionables"] },
		{ id: 196, text: "Reportes de gestión", category: "Medición y Análisis", options: ["Reportes ejecutivos", "Dashboards interactivos", "Información oportuna", "Análisis de tendencias", "Recomendaciones"] },
		{ id: 197, text: "Benchmarking interno", category: "Medición y Análisis", options: ["Comparación interna", "Mejores prácticas", "Transferencia de conocimiento", "Estandarización", "Mejora continua"] },
		{ id: 198, text: "Evaluación de efectividad", category: "Medición y Análisis", options: ["Medición de resultados", "Análisis de impacto", "ROI de seguridad", "Evaluación de programas", "Optimización de recursos"] },
		{ id: 199, text: "Gestión de la información", category: "Gestión de Información", options: ["Sistemas de información", "Calidad de datos", "Seguridad de información", "Acceso controlado", "Respaldo y recuperación"] },
		{ id: 200, text: "Documentación y registros", category: "Gestión de Información", options: ["Control documental", "Registros completos", "Trazabilidad", "Archivo organizado", "Retención adecuada"] }
	], []);

	// Cargar medidas correctivas existentes al inicializar
	useState(() => {
		if (necesidadesControlData.medidasCorrectivas) {
			setCorrectiveText(necesidadesControlData.medidasCorrectivas);
		}
	}, []);

	// Función para obtener los NAC filtrados según las selecciones de Causas Básicas
	const getFilteredNACItems = useMemo(() => {
		// Obtener todas las causas básicas seleccionadas
		const selectedCausasBasicas = [
			...causasBasicasData.personales.selectedItems,
			...causasBasicasData.laborales.selectedItems
		];

		if (selectedCausasBasicas.length === 0) {
			// Si no hay causas básicas seleccionadas, mostrar mensaje
			return [];
		}

		// Obtener los NAC permitidos basados en las causas básicas seleccionadas
		const allowedNACIds = new Set();
		selectedCausasBasicas.forEach(causaId => {
			const nacIds = causasBasicasToNAC[causaId];
			if (nacIds) {
				nacIds.forEach(nacId => allowedNACIds.add(nacId));
			}
		});

		// Filtrar los NAC para mostrar solo los permitidos
		return allNACItems.filter(item => allowedNACIds.has(item.id));

	}, [causasBasicasData.personales.selectedItems, causasBasicasData.laborales.selectedItems, allNACItems, causasBasicasToNAC]);

	// Agrupar NAC por categoría
	const groupedNACItems = useMemo(() => {
		const filteredItems = getFilteredNACItems;
		const grouped = {};
		
		filteredItems.forEach(item => {
			if (!grouped[item.category]) {
				grouped[item.category] = [];
			}
			grouped[item.category].push(item);
		});
		
		return grouped;
	}, [getFilteredNACItems]);

	const handleItemClick = (item) => {
		setActiveModal(item);
		
		// Cargar datos existentes si los hay
		const existingData = necesidadesControlData.detailedData[item.id];
		if (existingData) {
			setModalData(existingData);
		} else {
			setModalData({
				selectedOptions: [],
				optionsPEC: {},
				image: null,
				comments: ""
			});
		}
	};

	const handleOptionToggle = (optionIndex) => {
		setModalData(prev => ({
			...prev,
			selectedOptions: prev.selectedOptions.includes(optionIndex)
				? prev.selectedOptions.filter(i => i !== optionIndex)
				: [...prev.selectedOptions, optionIndex]
		}));
	};

	// Nueva función para manejar la selección de P E C por opción
	const handleOptionPECToggle = (optionIndex, pec) => {
		setModalData(prev => {
			const currentPECs = prev.optionsPEC[optionIndex] || [];
			const newPECs = currentPECs.includes(pec)
				? currentPECs.filter(p => p !== pec)
				: [...currentPECs, pec];
			
			return {
				...prev,
				optionsPEC: {
					...prev.optionsPEC,
					[optionIndex]: newPECs
				}
			};
		});
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setModalData(prev => ({
					...prev,
					image: e.target.result
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	const removeImage = () => {
		setModalData(prev => ({
			...prev,
			image: null
		}));
		fileInputRef.current.value = "";
	};

	const handleCommentsChange = (e) => {
		setModalData(prev => ({
			...prev,
			comments: e.target.value
		}));
	};

	const handleModalConfirm = () => {
		const hasData = modalData.selectedOptions.length > 0 || 
						modalData.image || 
						modalData.comments.trim() !== "" ||
						Object.keys(modalData.optionsPEC).length > 0;

		if (hasData) {
			// Agregar el item a selectedItems si no está
			const newSelectedItems = necesidadesControlData.selectedItems.includes(activeModal.id)
				? necesidadesControlData.selectedItems
				: [...necesidadesControlData.selectedItems, activeModal.id];
			
			// Guardar los datos detallados
			const newDetailedData = {
				...necesidadesControlData.detailedData,
				[activeModal.id]: modalData
			};

			setNecesidadesControlData({
				...necesidadesControlData,
				selectedItems: newSelectedItems,
				detailedData: newDetailedData
			});
		} else {
			// Si no hay datos, remover el item
			const newSelectedItems = necesidadesControlData.selectedItems.filter(id => id !== activeModal.id);
			const newDetailedData = { ...necesidadesControlData.detailedData };
			delete newDetailedData[activeModal.id];

			setNecesidadesControlData({
				...necesidadesControlData,
				selectedItems: newSelectedItems,
				detailedData: newDetailedData
			});
		}
		
		setActiveModal(null);
		setModalData({
			selectedOptions: [],
			optionsPEC: {},
			image: null,
			comments: ""
		});
	};

	const handleModalCancel = () => {
		setActiveModal(null);
		setModalData({
			selectedOptions: [],
			optionsPEC: {},
			image: null,
			comments: ""
		});
	};

	const clearAllSelections = () => {
		setNecesidadesControlData({
			selectedItems: [],
			detailedData: {},
			globalImage: null,
			globalObservation: '',
			medidasCorrectivas: ''
		});
		setCorrectiveText("");
	};

	const handleGlobalObservationChange = (e) => {
		setNecesidadesControlData({
			...necesidadesControlData,
			globalObservation: e.target.value
		});
	};

	// Funciones para el modal de medidas correctivas
	const handleOpenCorrectiveModal = () => {
		setCorrectiveText(necesidadesControlData.medidasCorrectivas || "");
		setShowCorrectiveModal(true);
	};

	const handleCloseCorrectiveModal = () => {
		setShowCorrectiveModal(false);
	};

	const handleSaveCorrectiveMeasures = () => {
		setNecesidadesControlData({
			...necesidadesControlData,
			medidasCorrectivas: correctiveText
		});
		setShowCorrectiveModal(false);
	};

	const handleCorrectiveTextChange = (e) => {
		setCorrectiveText(e.target.value);
	};

	const getSelectedCount = () => {
		return necesidadesControlData.selectedItems.length;
	};

	// Obtener las causas básicas seleccionadas para mostrar información
	const getSelectedCausasBasicas = () => {
		return [
			...causasBasicasData.personales.selectedItems,
			...causasBasicasData.laborales.selectedItems
		];
	};

	const selectedCausasBasicas = getSelectedCausasBasicas();
	const filteredNACItems = getFilteredNACItems;

	return (
		<div className={styles.scatContainer}>
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<h1 className={styles.mainTitle}>NECESIDADES DE ACCIÓN DE CONTROL (NAC)</h1>
					<h2 className={styles.subtitle}>Técnica de Análisis Sistemático de las Causas</h2>
				</div>
				<div className={styles.headerActions}>
					<button 
						className={styles.clearButton}
						onClick={clearAllSelections}
						disabled={necesidadesControlData.selectedItems.length === 0}
					>
						Limpiar Todo ({getSelectedCount()})
					</button>
				</div>
			</div>

			{/* Información sobre el filtrado */}
			{selectedCausasBasicas.length > 0 && (
				<div className={styles.filterInfo}>
					<h3>NAC filtradas según Causas Básicas seleccionadas:</h3>
					<p>Causas Básicas: {selectedCausasBasicas.join(', ')}</p>
					<p>Se muestran {filteredNACItems.length} NAC relacionadas con estas causas básicas.</p>
				</div>
			)}

			{filteredNACItems.length === 0 ? (
				<div className={styles.noOptionsMessage}>
					<h3>No hay NAC disponibles</h3>
					<p>Primero debe seleccionar causas básicas en la sección anterior (Botón 4) para ver las Necesidades de Acción de Control correspondientes.</p>
				</div>
			) : (
				<div className={styles.categoriesGrid}>
					{Object.entries(groupedNACItems).map(([category, items]) => (
						<div key={category} className={styles.categoryCard}>
							<div 
								className={styles.categoryHeader}
								style={{ backgroundColor: '#2563eb' }}
							>
								<h3 className={styles.categoryTitle}>{category}</h3>
								<p className={styles.categorySubtitle}>{items.length} NAC disponibles</p>
							</div>
							
							<div className={styles.categoryBody}>
								{items.map((item) => {
									const isSelected = necesidadesControlData.selectedItems.includes(item.id);
									const hasDetailedData = necesidadesControlData.detailedData[item.id];
									
									return (
										<button
											key={item.id}
											className={`${styles.itemButton} ${
												isSelected ? styles.selected : ""
											}`}
											onClick={() => handleItemClick(item)}
										>
											<div className={styles.itemNumber}>{item.id}</div>
											<div className={styles.itemText}>{item.text}</div>
											<div className={styles.itemIcon}>
												{isSelected ? "✓" : "→"}
											</div>
											{hasDetailedData && (
												<div className={styles.dataIndicator}>
													{hasDetailedData.selectedOptions?.length > 0 && 
														<span className={styles.optionsCount}>
															{hasDetailedData.selectedOptions.length} opciones
														</span>
													}
													{hasDetailedData.optionsPEC && Object.keys(hasDetailedData.optionsPEC).length > 0 && 
														<span className={styles.pecIndicator}>
															PEC: {Object.values(hasDetailedData.optionsPEC).flat().length}
														</span>
													}
												</div>
											)}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Global Observation Section */}
			<div className={styles.globalObservationSection}>
				<h3 className={styles.globalObservationTitle}>Observaciones Generales</h3>
				<textarea
					className={styles.globalObservationTextarea}
					value={necesidadesControlData.globalObservation || ''}
					onChange={handleGlobalObservationChange}
					placeholder="Escriba observaciones generales sobre las necesidades de control identificadas..."
					rows={4}
				></textarea>
			</div>

			{/* Botón de Medidas Correctivas */}
			<div className={styles.correctiveMeasuresSection}>
				<button 
					className={styles.correctiveMeasuresButton}
					onClick={handleOpenCorrectiveModal}
				>
					<div className={styles.correctiveMeasuresIcon}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M12 20h9"></path>
							<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
						</svg>
					</div>
					<span>Aplicar Medidas Correctivas</span>
					{necesidadesControlData.medidasCorrectivas && (
						<div className={styles.correctiveMeasuresIndicator}>
							✓ Completado
						</div>
					)}
				</button>
			</div>

			<div className={styles.footer}>
				<div className={styles.footerContent}>
					<div className={styles.legend}>
						<div className={styles.legendItem}>
							<div className={styles.legendColor} style={{ backgroundColor: '#dc2626' }}></div>
							<span>P - Potencial</span>
						</div>
						<div className={styles.legendItem}>
							<div className={styles.legendColor} style={{ backgroundColor: '#eab308' }}></div>
							<span>E - Eventos</span>
						</div>
						<div className={styles.legendItem}>
							<div className={styles.legendColor} style={{ backgroundColor: '#10b981' }}></div>
							<span>C - Control</span>
						</div>
					</div>
				</div>
			</div>

			{/* Modal */}
			{activeModal && (
				<div className={styles.modalOverlay}>
					<div className={styles.modalContent}>
						<div className={styles.modalHeader}>
							<h3 className={styles.modalTitle}>
								{activeModal.id}. {activeModal.text}
							</h3>
							<button 
								className={styles.modalCloseBtn}
								onClick={handleModalCancel}
							>
								×
							</button>
						</div>
						
						<div className={styles.modalBody}>
							{/* Options Selection with P-E-C buttons */}
							<div className={styles.optionsSection}>
								<h4 className={styles.optionsTitle}>Seleccione las opciones que aplican:</h4>
								<div className={styles.modalOptions}>
									{activeModal.options.map((option, index) => (
										<div key={index} className={styles.optionContainer}>
											<button
												className={`${styles.modalOption} ${
													modalData.selectedOptions.includes(index) ? styles.modalOptionSelected : ""
												}`}
												onClick={() => handleOptionToggle(index)}
											>
												<div className={styles.modalOptionIcon}>
													{modalData.selectedOptions.includes(index) ? "✓" : "○"}
												</div>
												<span className={styles.modalOptionText}>{option}</span>
											</button>
											
											{/* Botones P E C al costado de cada opción */}
											<div className={styles.optionPECButtons}>
												<button
													className={`${styles.optionPECButton} ${styles.optionPECP} ${
														modalData.optionsPEC[index]?.includes('P') ? styles.optionPECSelected : ""
													}`}
													onClick={() => handleOptionPECToggle(index, 'P')}
													title="Potencial"
												>
													P
												</button>
												<button
													className={`${styles.optionPECButton} ${styles.optionPECE} ${
														modalData.optionsPEC[index]?.includes('E') ? styles.optionPECSelected : ""
													}`}
													onClick={() => handleOptionPECToggle(index, 'E')}
													title="Eventos"
												>
													E
												</button>
												<button
													className={`${styles.optionPECButton} ${styles.optionPECC} ${
														modalData.optionsPEC[index]?.includes('C') ? styles.optionPECSelected : ""
													}`}
													onClick={() => handleOptionPECToggle(index, 'C')}
													title="Control"
												>
													C
												</button>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Image Upload */}
							<div className={styles.imageSection}>
								<h4 className={styles.imageTitle}>Imagen (opcional)</h4>
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleImageUpload}
									accept="image/*"
									className={styles.fileInput}
								/>

								{modalData.image ? (
									<div className={styles.imagePreviewContainer}>
										<img
											src={modalData.image}
											alt="Preview"
											className={styles.imagePreview}
										/>
										<button className={styles.removeImageBtn} onClick={removeImage}>
											×
										</button>
									</div>
								) : (
									<div
										className={styles.uploadPlaceholder}
										onClick={triggerFileInput}
									>
										<div className={styles.cameraIcon}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
												<circle cx="12" cy="13" r="4"></circle>
											</svg>
										</div>
										<p>Haga clic para agregar imagen</p>
									</div>
								)}
							</div>

							{/* Comments */}
							<div className={styles.commentsSection}>
								<h4 className={styles.commentsTitle}>Comentarios</h4>
								<textarea
									className={styles.commentsTextarea}
									value={modalData.comments}
									onChange={handleCommentsChange}
									placeholder="Escriba sus comentarios aquí..."
									rows={4}
								></textarea>
							</div>
						</div>
						
						<div className={styles.modalFooter}>
							<button 
								className={styles.modalCancelBtn}
								onClick={handleModalCancel}
							>
								Cancelar
							</button>
							<button 
								className={styles.modalConfirmBtn}
								onClick={handleModalConfirm}
							>
								Confirmar
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal para Medidas Correctivas */}
			{showCorrectiveModal && (
				<div className={styles.modalOverlay}>
					<div className={styles.correctiveModalContent}>
						<div className={styles.modalHeader}>
							<h3 className={styles.modalTitle}>
								Medidas Correctivas
							</h3>
							<button 
								className={styles.modalCloseBtn}
								onClick={handleCloseCorrectiveModal}
							>
								×
							</button>
						</div>
						
						<div className={styles.correctiveModalBody}>
							<div className={styles.correctiveInstructions}>
								<p>Describa las medidas correctivas que se implementarán para abordar las necesidades de control identificadas:</p>
							</div>
							
							<textarea
								className={styles.correctiveTextarea}
								value={correctiveText}
								onChange={handleCorrectiveTextChange}
								placeholder="Escriba aquí las medidas correctivas detalladas, incluyendo:
- Acciones específicas a implementar
- Responsables de cada acción
- Plazos de implementación
- Recursos necesarios
- Indicadores de seguimiento"
								rows={15}
							></textarea>
						</div>
						
						<div className={styles.modalFooter}>
							<button 
								className={styles.modalCancelBtn}
								onClick={handleCloseCorrectiveModal}
							>
								Cancelar
							</button>
							<button 
								className={styles.modalConfirmBtn}
								onClick={handleSaveCorrectiveMeasures}
							>
								Guardar Medidas Correctivas
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default NecesidadesControlContent;
