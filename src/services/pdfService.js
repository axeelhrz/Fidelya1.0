import jsPDF from 'jspdf';

class PDFService {
  constructor() {
    this.doc = null;
    this.currentY = 20;
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.lineHeight = 7;
  }

  // Inicializar documento PDF
  initDocument() {
    this.doc = new jsPDF();
    this.currentY = 20;
    
    // Configurar fuente
    this.doc.setFont('helvetica');
  }

  // Verificar si necesita nueva página
  checkPageBreak(requiredSpace = 20) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = 20;
      return true;
    }
    return false;
  }

  // Agregar título principal
  addMainTitle(title) {
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 15;
  }

  // Agregar subtítulo
  addSubtitle(subtitle) {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(subtitle, this.margin, this.currentY);
    this.currentY += 10;
  }

  // Agregar texto normal
  addText(text, indent = 0) {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const maxWidth = 170 - indent;
    const lines = this.doc.splitTextToSize(text, maxWidth);
    
    lines.forEach(line => {
      this.checkPageBreak();
      this.doc.text(line, this.margin + indent, this.currentY);
      this.currentY += this.lineHeight;
    });
  }

  // Agregar lista con viñetas
  addBulletList(items, indent = 5) {
    items.forEach(item => {
      this.checkPageBreak();
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('•', this.margin + indent, this.currentY);
      
      const maxWidth = 165 - indent;
      const lines = this.doc.splitTextToSize(item, maxWidth);
      
      lines.forEach((line, index) => {
        if (index > 0) {
          this.checkPageBreak();
        }
        this.doc.text(line, this.margin + indent + 5, this.currentY);
        if (index < lines.length - 1) {
          this.currentY += this.lineHeight;
        }
      });
      
      this.currentY += this.lineHeight + 2;
    });
  }

  // Agregar línea separadora
  addSeparator() {
    this.checkPageBreak();
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, 190, this.currentY);
    this.currentY += 10;
  }

  // Agregar información del proyecto
  addProjectInfo(projectData) {
    this.addSubtitle('INFORMACIÓN DEL PROYECTO');
    
    const fields = [
      { label: 'Evento', value: projectData.evento },
      { label: 'Involucrado', value: projectData.involucrado },
      { label: 'Área', value: projectData.area },
      { label: 'Fecha y Hora', value: projectData.fechaHora },
      { label: 'Investigador', value: projectData.investigador },
      { label: 'Otros Datos', value: projectData.otrosDatos }
    ];

    fields.forEach(field => {
      if (field.value && field.value.trim() !== '') {
        this.addText(`${field.label}: ${field.value}`);
      }
    });

    this.addSeparator();
  }

  // Agregar datos de evaluación
  addEvaluacionData(evaluacionData) {
    if (!evaluacionData.severity && !evaluacionData.probability && !evaluacionData.frequency) {
      return;
    }

    this.addSubtitle('EVALUACIÓN POTENCIAL DE PÉRDIDA');

    const evaluationMap = {
      severity: {
        title: 'Potencial de Severidad de Pérdida',
        values: { A: 'Mayor', B: 'Grave', C: 'Menor' }
      },
      probability: {
        title: 'Probabilidad de Ocurrencia',
        values: { A: 'Alta', B: 'Moderada', C: 'Rara' }
      },
      frequency: {
        title: 'Frecuencia de Exposición',
        values: { A: 'Grande', B: 'Moderada', C: 'Baja' }
      }
    };

    Object.entries(evaluationMap).forEach(([key, config]) => {
      if (evaluacionData[key]) {
        this.addText(`${config.title}: ${evaluacionData[key]} - ${config.values[evaluacionData[key]]}`);
      }
    });

    this.addSeparator();
  }

  // Agregar datos de contacto
  addContactoData(contactoData, incidentsData) {
    if (contactoData.selectedIncidents.length === 0) {
      return;
    }

    this.addSubtitle('TIPO DE CONTACTO O CUASI CONTACTO');

    const selectedIncidentTexts = contactoData.selectedIncidents.map(id => {
      const incident = incidentsData.find(inc => inc.id === id);
      return incident ? `${id}. ${incident.title}` : `${id}. Incidente no encontrado`;
    });

    this.addBulletList(selectedIncidentTexts);

    if (contactoData.observation && contactoData.observation.trim() !== '') {
      this.addText('Observaciones:');
      this.addText(contactoData.observation, 5);
    }

    this.addSeparator();
  }

  // Agregar datos de causas inmediatas
  addCausasInmediatasData(causasInmediatasData, actosData, condicionesData) {
    let hasData = false;

    if (causasInmediatasData.actos.selectedItems.length > 0) {
      hasData = true;
      this.addSubtitle('CAUSAS INMEDIATAS - ACTOS SUBESTÁNDAR');
      
      const selectedActos = causasInmediatasData.actos.selectedItems.map(id => {
        const acto = actosData.find(item => item.id === id);
        return acto ? `${id}. ${acto.text}` : `${id}. Acto no encontrado`;
      });

      this.addBulletList(selectedActos);

      if (causasInmediatasData.actos.observation && causasInmediatasData.actos.observation.trim() !== '') {
        this.addText('Observaciones:');
        this.addText(causasInmediatasData.actos.observation, 5);
      }
    }

    if (causasInmediatasData.condiciones.selectedItems.length > 0) {
      hasData = true;
      if (causasInmediatasData.actos.selectedItems.length > 0) {
        this.currentY += 5;
      }
      
      this.addSubtitle('CAUSAS INMEDIATAS - CONDICIONES SUBESTÁNDAR');
      
      const selectedCondiciones = causasInmediatasData.condiciones.selectedItems.map(id => {
        const condicion = condicionesData.find(item => item.id === id);
        return condicion ? `${id}. ${condicion.text}` : `${id}. Condición no encontrada`;
      });

      this.addBulletList(selectedCondiciones);

      if (causasInmediatasData.condiciones.observation && causasInmediatasData.condiciones.observation.trim() !== '') {
        this.addText('Observaciones:');
        this.addText(causasInmediatasData.condiciones.observation, 5);
      }
    }

    if (hasData) {
      this.addSeparator();
    }
  }

  // Agregar datos de causas básicas
  addCausasBasicasData(causasBasicasData, personalesData, laboralesData) {
    let hasData = false;

    if (causasBasicasData.personales.selectedItems.length > 0) {
      hasData = true;
      this.addSubtitle('CAUSAS BÁSICAS - FACTORES PERSONALES');
      
      const selectedPersonales = causasBasicasData.personales.selectedItems.map(id => {
        const factor = personalesData.find(item => item.id === id);
        return factor ? `${id}. ${factor.text}` : `${id}. Factor no encontrado`;
      });

      this.addBulletList(selectedPersonales);

      if (causasBasicasData.personales.observation && causasBasicasData.personales.observation.trim() !== '') {
        this.addText('Observaciones:');
        this.addText(causasBasicasData.personales.observation, 5);
      }
    }

    if (causasBasicasData.laborales.selectedItems.length > 0) {
      hasData = true;
      if (causasBasicasData.personales.selectedItems.length > 0) {
        this.currentY += 5;
      }
      
      this.addSubtitle('CAUSAS BÁSICAS - FACTORES LABORALES');
      
      const selectedLaborales = causasBasicasData.laborales.selectedItems.map(id => {
        const factor = laboralesData.find(item => item.id === id);
        return factor ? `${id}. ${factor.text}` : `${id}. Factor no encontrado`;
      });

      this.addBulletList(selectedLaborales);

      if (causasBasicasData.laborales.observation && causasBasicasData.laborales.observation.trim() !== '') {
        this.addText('Observaciones:');
        this.addText(causasBasicasData.laborales.observation, 5);
      }
    }

    if (hasData) {
      this.addSeparator();
    }
  }

  // Agregar datos de necesidades de control
  addNecesidadesControlData(necesidadesControlData, categoriesData) {
    if (necesidadesControlData.selectedItems.length === 0) {
      return;
    }

    this.addSubtitle('NECESIDADES DE ACCIÓN DE CONTROL (NAC)');

    // Agrupar por categoría
    const groupedItems = {};
    
    necesidadesControlData.selectedItems.forEach(itemId => {
      categoriesData.forEach(category => {
        const item = category.items.find(item => item.id === itemId);
        if (item) {
          if (!groupedItems[category.title]) {
            groupedItems[category.title] = [];
          }
          groupedItems[category.title].push(`${item.id}. ${item.text}`);
        }
      });
    });

    Object.entries(groupedItems).forEach(([categoryTitle, items]) => {
      this.addText(categoryTitle + ':', 0);
      this.addBulletList(items, 10);
      this.currentY += 3;
    });

    if (necesidadesControlData.globalObservation && necesidadesControlData.globalObservation.trim() !== '') {
      this.addText('Observaciones Generales:');
      this.addText(necesidadesControlData.globalObservation, 5);
    }

    this.addSeparator();
  }

  // Agregar pie de página
  addFooter() {
    const pageCount = this.doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      
      // Fecha de generación
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-ES') + ' ' + now.toLocaleTimeString('es-ES');
      this.doc.text(`Generado el: ${dateStr}`, this.margin, this.pageHeight - 10);
      
      // Número de página
      this.doc.text(`Página ${i} de ${pageCount}`, 190 - this.margin, this.pageHeight - 10, { align: 'right' });
    }
  }

  // Función principal para generar el PDF
  generatePDF(scatData) {
    this.initDocument();

    // Título principal
    this.addMainTitle('REPORTE SCAT - ANÁLISIS SISTEMÁTICO DE CAUSAS');
    this.currentY += 5;

    // Información del proyecto
    this.addProjectInfo(scatData.project);

    // Evaluación potencial de pérdida
    this.addEvaluacionData(scatData.evaluacion);

    // Datos de contacto (necesitamos los datos de referencia)
    const incidentsData = [
      { id: 1, title: "Golpeada Contra (chocar contra algo)" },
      { id: 2, title: "Golpeado por (Impactado por objeto en movimiento)" },
      { id: 3, title: "Caída a un nivel más bajo" },
      { id: 4, title: "Caída en el mismo nivel (Resbalar y caer, tropezar)" },
      { id: 5, title: "Atrapado (Puntos de Pellizco y Mordida)" },
      { id: 6, title: "Cogido (Enganchado, Colgado)" },
      { id: 7, title: "Atrapado entre o debajo (Chancado, Amputado)" },
      { id: 8, title: "Contacto con (Electricidad, Calor, Frío, Radiación, Causticos, Tóxicos, Ruido)" },
      { id: 9, title: "Golpeado por (Impactado por objeto en movimiento)" }
    ];
    this.addContactoData(scatData.contacto, incidentsData);

    // Datos de causas inmediatas (necesitamos los datos de referencia)
    const actosData = [
      { id: 1, text: "Operar equipos sin autorización" },
      { id: 2, text: "Omitir el uso de equipos de seguridad personal" },
      { id: 3, text: "Omitir el uso de dispositivos de seguridad" },
      { id: 4, text: "Operar a velocidad inadecuada" },
      { id: 5, text: "Poner fuera de servicio los dispositivos de seguridad" },
      { id: 6, text: "Usar equipos defectuosos" },
      { id: 7, text: "No usar o usar inadecuadamente el equipo de protección personal" },
      { id: 8, text: "Cargar incorrectamente" },
      { id: 9, text: "Colocar, mezclar, combinar, etc., de manera insegura" },
      { id: 10, text: "Levantar objetos en forma incorrecta" },
      { id: 11, text: "Adoptar una posición insegura para hacer el trabajo" },
      { id: 12, text: "Trabajar en equipos en movimiento o peligrosos" },
      { id: 13, text: "Distraerse, bromear, jugar, etc." },
      { id: 14, text: "Omitir el uso de equipos de protección personal disponibles" },
      { id: 15, text: "Usar equipos inseguros o usarlos inseguramente" }
    ];

    const condicionesData = [
      { id: 16, text: "Guardas inadecuadas" },
      { id: 17, text: "Equipos de protección inadecuados o insuficientes" },
      { id: 18, text: "Herramientas, equipos o materiales defectuosos" },
      { id: 19, text: "Espacio limitado para desenvolverse" },
      { id: 20, text: "Sistemas de advertencia inadecuados" },
      { id: 21, text: "Peligros de incendio y explosión" },
      { id: 22, text: "Orden y limpieza deficientes en el lugar de trabajo" },
      { id: 23, text: "Condiciones ambientales peligrosas" },
      { id: 24, text: "Iluminación deficiente" },
      { id: 25, text: "Ventilación deficiente" },
      { id: 26, text: "Ropa o vestimenta insegura" },
      { id: 27, text: "Congestión o acción restringida" },
      { id: 28, text: "Ubicación peligrosa de equipos y materiales" }
    ];

    this.addCausasInmediatasData(scatData.causasInmediatas, actosData, condicionesData);

    // Datos de causas básicas (datos de referencia simplificados)
    const personalesData = [
      { id: 1, text: 'Capacidad Física / Fisiológica Inadecuada' },
      { id: 2, text: 'Capacidad Mental / Psicológica Inadecuada' },
      { id: 3, text: 'Tensión Física o Fisiológica' },
      { id: 4, text: 'Tensión Mental o Psicológica' },
      { id: 5, text: 'Falta de Conocimiento' },
      { id: 6, text: 'Falta de Habilidad' },
      { id: 7, text: 'Motivación Incorrecta' }
    ];

    const laboralesData = [
      { id: 8, text: 'Liderazgo y/o Supervisión Deficiente' },
      { id: 9, text: 'Ingeniería Inadecuada' },
      { id: 10, text: 'Adquisiciones Deficientes' },
      { id: 11, text: 'Mantenimiento Deficiente' },
      { id: 12, text: 'Herramientas y Equipos Inadecuados' },
      { id: 13, text: 'Estándares de Trabajo Inadecuados' },
      { id: 14, text: 'Uso y Desgaste' },
      { id: 15, text: 'Abuso o Mal Uso' }
    ];

    this.addCausasBasicasData(scatData.causasBasicas, personalesData, laboralesData);

    // Datos de necesidades de control (datos de referencia simplificados)
    const categoriesData = [
      {
        title: 'EVALUACIÓN POTENCIAL DE PÉRDIDA SIN CONTROLES',
        items: [
          { id: 1, text: 'Capacidad Física / Fisiológica Inadecuada' },
          { id: 2, text: 'Capacidad Mental / Psicológica Inadecuada' },
          { id: 3, text: 'Tensión Física o Fisiológica' },
          { id: 4, text: 'Tensión Mental o Psicológica' },
          { id: 5, text: 'Falta de Conocimiento' }
        ]
      },
      {
        title: 'Tipo de Contacto o Qué Contactó con Energía o Sustancia',
        items: [
          { id: 6, text: 'Golpeada Contra (chocar contra algo)' },
          { id: 7, text: 'Golpeado por (Impactado por objeto en movimiento)' },
          { id: 8, text: 'Caída a un nivel más bajo' },
          { id: 9, text: 'Caída en el mismo nivel' },
          { id: 10, text: 'Atrapado (Puntos de Pellizco y Mordida)' }
        ]
      }
    ];

    this.addNecesidadesControlData(scatData.necesidadesControl, categoriesData);

    // Agregar pie de página
    this.addFooter();

    return this.doc;
  }

  // Función para descargar el PDF
  downloadPDF(scatData, filename = 'reporte-scat.pdf') {
    const doc = this.generatePDF(scatData);
    doc.save(filename);
  }

  // Función para obtener el PDF como blob
  getPDFBlob(scatData) {
    const doc = this.generatePDF(scatData);
    return doc.output('blob');
  }
}

export default new PDFService();
