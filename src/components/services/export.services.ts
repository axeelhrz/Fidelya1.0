import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';

// Define interfaces for the data structures
interface ExportOptions {
  sections: string[];
  fileName?: string;
}

interface AnalyticsData {
  kpis: {
    totalPolicies: number;
    totalPremiums: number;
    newClientsMonthly: number;
    retentionRate: number;
    policyTrend: string;
    premiumTrend: string;
    clientTrend: string;
    retentionTrend: string;
  };
  graphs: {
    byType: Array<{ name: string; value: number }>;
    byMonth: Array<{ month: string; new: number; renewals: number }>;
    expirations: Array<{ range: string; value: number }>;
    satisfaction: number;
  };
  lists: {
    recentPolicies: Array<{ type: string; clientName: string; premium: number; status: string; date: string }>;
    activeCustomers: Array<{ name: string; lastActivity: string; policyCount: number; totalPremium?: number }>;
    pendingTasks: Array<{ description: string; dueDate: string; priority: string }>;
  };
  recommendations?: Array<{ priority: string; text: string }>;
  alerts?: Array<{ severity: string; text: string; timestamp: string }>;
}

// Función para exportar datos a PDF
export const exportToPdf = (data: AnalyticsData, options: ExportOptions): void => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let yPos = margin;
    
    // Título y fecha
    doc.setFontSize(18);
    doc.text('Informe de Análisis', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text(`Generado el: ${dayjs().format('DD/MM/YYYY HH:mm')}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;
    
    // KPIs
    if (options.sections.includes('kpis')) {
      doc.setFontSize(14);
      doc.text('Resumen Ejecutivo', margin, yPos);
      yPos += 8;
      
      const kpiData = [
        ['Métrica', 'Valor', 'Tendencia'],
        ['Pólizas Activas', data.kpis.totalPolicies.toString(), data.kpis.policyTrend],
        ['Primas Aseguradas', `€${data.kpis.totalPremiums.toLocaleString()}`, data.kpis.premiumTrend],
        ['Clientes Nuevos (Mes)', data.kpis.newClientsMonthly.toString(), data.kpis.clientTrend],
        ['Retención (%)', `${data.kpis.retentionRate}%`, data.kpis.retentionTrend]
      ];
      
      // @ts-expect-error - jspdf-autotable types
      doc.autoTable({
        startY: yPos,
        head: [kpiData[0]],
        body: kpiData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [25, 118, 210], textColor: 255 },
        margin: { top: yPos, left: margin, right: margin }
      });
      
      // @ts-expect-error - getting last auto table end position
      yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Gráficos (solo texto en PDF, los gráficos reales requerirían canvas)
    if (options.sections.includes('graphs')) {
      doc.setFontSize(14);
      doc.text('Análisis Visual', margin, yPos);
      yPos += 8;
      
      // Distribución por tipo
      doc.setFontSize(12);
      doc.text('Distribución por Tipo de Póliza', margin, yPos);
      yPos += 6;
      
      const typeData = data.graphs.byType.map(item => [item.name, item.value.toString(), `${((item.value / data.kpis.totalPolicies) * 100).toFixed(1)}%`]);
      
      // @ts-expect-error - jspdf-autotable types
      doc.autoTable({
        startY: yPos,
        head: [['Tipo', 'Cantidad', 'Porcentaje']],
        body: typeData,
        theme: 'grid',
        margin: { top: yPos, left: margin, right: margin }
      });
      
      // @ts-expect-error - getting last auto table end position
      yPos = doc.lastAutoTable.finalY + 10;
      
      // Verificar si necesitamos una nueva página
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = margin;
      }
      
      // Tendencia mensual
      doc.setFontSize(12);
      doc.text('Tendencia de Ventas Mensual', margin, yPos);
      yPos += 6;
      
      const monthlyData = data.graphs.byMonth.map(item => [
        item.month, 
        item.new.toString(), 
        item.renewals.toString(),
        (item.new + item.renewals).toString()
      ]);
      
      // @ts-expect-error - jspdf-autotable types
      doc.autoTable({
        startY: yPos,
        head: [['Mes', 'Nuevas', 'Renovaciones', 'Total']],
        body: monthlyData,
        theme: 'grid',
        margin: { top: yPos, left: margin, right: margin }
      });
      
      // @ts-expect-error - getting last auto table end position
      yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Listas
    if (options.sections.includes('lists')) {
      // Verificar si necesitamos una nueva página
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.setFontSize(14);
      doc.text('Actividad Reciente', margin, yPos);
      yPos += 8;
      
      // Pólizas recientes
      doc.setFontSize(12);
      doc.text('Últimas Pólizas', margin, yPos);
      yPos += 6;
      
      const policyData = data.lists.recentPolicies.map(item => [
        item.type,
        item.clientName,
        `€${item.premium.toLocaleString()}`,
        item.status,
        item.date
      ]);
      
      // @ts-expect-error - jspdf-autotable types
      doc.autoTable({
        startY: yPos,
        head: [['Tipo', 'Cliente', 'Prima', 'Estado', 'Fecha']],
        body: policyData,
        theme: 'grid',
        margin: { top: yPos, left: margin, right: margin }
      });
      
      // @ts-expect-error - getting last auto table end position
      yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Recomendaciones
    if (options.sections.includes('recommendations') && data.recommendations) {
      // Verificar si necesitamos una nueva página
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.setFontSize(14);
      doc.text('Recomendaciones', margin, yPos);
      yPos += 8;
      
      const recData = data.recommendations.map(item => [
        item.priority.toUpperCase(),
        item.text
      ]);
      
      // @ts-expect-error - jspdf-autotable types
      doc.autoTable({
        startY: yPos,
        head: [['Prioridad', 'Recomendación']],
        body: recData,
        theme: 'grid',
        margin: { top: yPos, left: margin, right: margin }
      });
      
      // @ts-expect-error - getting last auto table end position
      yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Alertas
    if (options.sections.includes('alerts') && data.alerts) {
      // Verificar si necesitamos una nueva página
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.setFontSize(14);
      doc.text('Alertas', margin, yPos);
      yPos += 8;
      
      const alertData = data.alerts.map(item => [
        item.severity.toUpperCase(),
        item.text,
        item.timestamp
      ]);
      
      // @ts-expect-error - jspdf-autotable types
      doc.autoTable({
        startY: yPos,
        head: [['Severidad', 'Alerta', 'Fecha']],
        body: alertData,
        theme: 'grid',
        margin: { top: yPos, left: margin, right: margin }
      });
    }
    
    // Guardar el PDF
    const fileName = options.fileName || `analisis_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`;
    doc.save(fileName);
    
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

// Función para exportar datos a CSV
export const exportToCsv = (data: AnalyticsData, options: ExportOptions): void => {
  try {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // KPIs
    if (options.sections.includes('kpis')) {
      csvContent += 'RESUMEN EJECUTIVO\r\n';
      csvContent += 'Métrica,Valor,Tendencia\r\n';
      csvContent += `Pólizas Activas,${data.kpis.totalPolicies},${data.kpis.policyTrend}\r\n`;
      csvContent += `Primas Aseguradas,${data.kpis.totalPremiums},${data.kpis.premiumTrend}\r\n`;
      csvContent += `Clientes Nuevos (Mes),${data.kpis.newClientsMonthly},${data.kpis.clientTrend}\r\n`;
      csvContent += `Retención (%),${data.kpis.retentionRate},${data.kpis.retentionTrend}\r\n\r\n`;
    }
    
    // Gráficos
    if (options.sections.includes('graphs')) {
      csvContent += 'DISTRIBUCIÓN POR TIPO DE PÓLIZA\r\n';
      csvContent += 'Tipo,Cantidad,Porcentaje\r\n';
      data.graphs.byType.forEach(item => {
        const percentage = ((item.value / data.kpis.totalPolicies) * 100).toFixed(1);
        csvContent += `${item.name},${item.value},${percentage}%\r\n`;
      });
      csvContent += '\r\n';
      
      csvContent += 'TENDENCIA DE VENTAS MENSUAL\r\n';
      csvContent += 'Mes,Nuevas,Renovaciones,Total\r\n';
      data.graphs.byMonth.forEach(item => {
        const total = item.new + item.renewals;
        csvContent += `${item.month},${item.new},${item.renewals},${total}\r\n`;
      });
      csvContent += '\r\n';
      
      csvContent += 'ANÁLISIS DE VENCIMIENTOS\r\n';
      csvContent += 'Rango,Cantidad\r\n';
      data.graphs.expirations.forEach(item => {
        csvContent += `${item.range},${item.value}\r\n`;
      });
      csvContent += '\r\n';
      
      csvContent += 'SATISFACCIÓN DE CLIENTES\r\n';
      csvContent += `Puntuación,${data.graphs.satisfaction}%\r\n\r\n`;
    }
    
    // Listas
    if (options.sections.includes('lists')) {
      csvContent += 'ÚLTIMAS PÓLIZAS\r\n';
      csvContent += 'Tipo,Cliente,Prima,Estado,Fecha\r\n';
      data.lists.recentPolicies.forEach(item => {
        csvContent += `${item.type},${item.clientName},${item.premium},${item.status},${item.date}\r\n`;
      });
      csvContent += '\r\n';
      
      csvContent += 'CLIENTES ACTIVOS\r\n';
      csvContent += 'Nombre,Última Actividad,Número de Pólizas,Prima Total\r\n';
      data.lists.activeCustomers.forEach(item => {
        csvContent += `${item.name},${item.lastActivity},${item.policyCount},${item.totalPremium || 0}\r\n`;
      });
      csvContent += '\r\n';
      
      csvContent += 'TAREAS PENDIENTES\r\n';
      csvContent += 'Descripción,Fecha Límite,Prioridad\r\n';
      data.lists.pendingTasks.forEach(item => {
        csvContent += `${item.description},${item.dueDate},${item.priority}\r\n`;
      });
      csvContent += '\r\n';
    }
    
    // Recomendaciones
    if (options.sections.includes('recommendations') && data.recommendations) {
      csvContent += 'RECOMENDACIONES\r\n';
      csvContent += 'Prioridad,Recomendación\r\n';
      data.recommendations.forEach(item => {
        csvContent += `${item.priority},${item.text}\r\n`;
      });
      csvContent += '\r\n';
    }
    
    // Alertas
    if (options.sections.includes('alerts') && data.alerts) {
      csvContent += 'ALERTAS\r\n';
      csvContent += 'Severidad,Alerta,Fecha\r\n';
      data.alerts.forEach(item => {
        csvContent += `${item.severity},${item.text},${item.timestamp}\r\n`;
      });
    }
    
    // Crear enlace de descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', options.fileName || `analisis_${dayjs().format('YYYYMMDD_HHmmss')}.csv`);
    document.body.appendChild(link);
    
    // Descargar archivo
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

// Función para exportar datos a Excel (usando CSV como base)
export const exportToExcel = (data: AnalyticsData, options: ExportOptions): void => {
  // Para Excel, usamos la misma función de CSV pero cambiamos la extensión
  const excelOptions = {
    ...options,
    fileName: options.fileName || `analisis_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`
  };
  
  exportToCsv(data, excelOptions);
};