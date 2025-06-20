import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { DashboardMetrics, ExportOptions, NotionExportConfig } from '@/types/metrics';
import { Session } from '@/types/session';
import { Patient } from '@/types/patient';
import { ClinicalAlert } from '@/types/alert';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export class ExportService {
  /**
   * Exporta métricas a PDF
   */
  static async exportToPDF(
    metrics: DashboardMetrics,
    options: ExportOptions,
    centerName: string = 'Centro Psicológico'
  ): Promise<void> {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Configurar fuente
      pdf.setFont('helvetica');

      // Título del reporte
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text(`Reporte de Métricas - ${centerName}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Período del reporte
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      const periodText = `Período: ${format(metrics.periodStart, 'dd/MM/yyyy', { locale: es })} - ${format(metrics.periodEnd, 'dd/MM/yyyy', { locale: es })}`;
      pdf.text(periodText, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Métricas principales
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Métricas Principales', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      const mainMetrics = [
        `Pacientes Activos: ${metrics.totalActivePatients}`,
        `Total de Sesiones: ${metrics.totalSessions}`,
        `Promedio Sesiones por Paciente: ${metrics.averageSessionsPerPatient}`,
        `Alertas Activas: ${metrics.activeAlerts}`,
        `Alertas Resueltas: ${metrics.resolvedAlerts}`,
        `Tasa de Seguimiento: ${metrics.followUpRate}%`,
        `Tiempo Promedio entre Sesiones: ${metrics.averageTimeBetweenSessions} días`
      ];

      mainMetrics.forEach(metric => {
        pdf.text(metric, 25, yPosition);
        yPosition += 7;
      });

      yPosition += 10;

      // Distribución emocional
      if (Object.keys(metrics.emotionalDistribution).length > 0) {
        pdf.setFontSize(16);
        pdf.text('Distribución Emocional', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        Object.entries(metrics.emotionalDistribution)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .forEach(([emotion, count]) => {
            pdf.text(`${emotion}: ${count} registros`, 25, yPosition);
            yPosition += 7;
          });

        yPosition += 10;
      }

      // Motivos de consulta más frecuentes
      if (Object.keys(metrics.motivesDistribution).length > 0) {
        pdf.setFontSize(16);
        pdf.text('Motivos de Consulta Principales', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        Object.entries(metrics.motivesDistribution)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 8)
          .forEach(([motive, count]) => {
            const motiveText = motive.length > 50 ? `${motive.substring(0, 50)}...` : motive;
            pdf.text(`${motiveText}: ${count} pacientes`, 25, yPosition);
            yPosition += 7;
          });

        yPosition += 10;
      }

      // Carga de trabajo por profesional
      if (Object.keys(metrics.professionalWorkload).length > 0) {
        pdf.setFontSize(16);
        pdf.text('Carga de Trabajo por Profesional', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        Object.entries(metrics.professionalWorkload)
          .sort(([,a], [,b]) => b - a)
          .forEach(([professionalId, sessions]) => {
            pdf.text(`Profesional ${professionalId}: ${sessions} sesiones`, 25, yPosition);
            yPosition += 7;
          });

        yPosition += 10;
      }

      // Métricas de riesgo
      pdf.setFontSize(16);
      pdf.text('Evaluación de Riesgo', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      const riskMetrics = [
        `Pacientes Alto Riesgo: ${metrics.highRiskPatients}`,
        `Pacientes Riesgo Medio: ${metrics.mediumRiskPatients}`,
        `Pacientes Bajo Riesgo: ${metrics.lowRiskPatients}`
      ];

      riskMetrics.forEach(metric => {
        pdf.text(metric, 25, yPosition);
        yPosition += 7;
      });

      // Pie de página
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      // Descargar PDF
      const fileName = `metricas_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw new Error('Error al exportar a PDF');
    }
  }

  /**
   * Exporta métricas a Excel
   */
  static async exportToExcel(
    metrics: DashboardMetrics,
    rawData: {
      sessions: Session[];
      patients: Patient[];
      alerts: ClinicalAlert[];
    },
    options: ExportOptions,
    centerName: string = 'Centro Psicológico'
  ): Promise<void> {
    try {
      const workbook = XLSX.utils.book_new();

      // Hoja 1: Resumen de métricas
      const summaryData = [
        ['Reporte de Métricas - ' + centerName],
        ['Período', `${format(metrics.periodStart, 'dd/MM/yyyy')} - ${format(metrics.periodEnd, 'dd/MM/yyyy')}`],
        ['Generado', format(new Date(), 'dd/MM/yyyy HH:mm')],
        [],
        ['MÉTRICAS PRINCIPALES'],
        ['Pacientes Activos', metrics.totalActivePatients],
        ['Total de Sesiones', metrics.totalSessions],
        ['Promedio Sesiones por Paciente', metrics.averageSessionsPerPatient],
        ['Alertas Activas', metrics.activeAlerts],
        ['Alertas Resueltas', metrics.resolvedAlerts],
        ['Tasa de Seguimiento (%)', metrics.followUpRate],
        ['Tiempo Promedio entre Sesiones (días)', metrics.averageTimeBetweenSessions],
        [],
        ['MÉTRICAS DE RIESGO'],
        ['Pacientes Alto Riesgo', metrics.highRiskPatients],
        ['Pacientes Riesgo Medio', metrics.mediumRiskPatients],
        ['Pacientes Bajo Riesgo', metrics.lowRiskPatients]
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');

      // Hoja 2: Distribución emocional
      if (Object.keys(metrics.emotionalDistribution).length > 0) {
        const emotionalData = [
          ['Estado Emocional', 'Cantidad', 'Porcentaje'],
          ...Object.entries(metrics.emotionalDistribution)
            .sort(([,a], [,b]) => b - a)
            .map(([emotion, count]) => {
              const total = Object.values(metrics.emotionalDistribution).reduce((sum, val) => sum + val, 0);
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
              return [emotion, count, `${percentage}%`];
            })
        ];

        const emotionalSheet = XLSX.utils.aoa_to_sheet(emotionalData);
        XLSX.utils.book_append_sheet(workbook, emotionalSheet, 'Distribución Emocional');
      }

      // Hoja 3: Motivos de consulta
      if (Object.keys(metrics.motivesDistribution).length > 0) {
        const motivesData = [
          ['Motivo de Consulta', 'Cantidad de Pacientes', 'Porcentaje'],
          ...Object.entries(metrics.motivesDistribution)
            .sort(([,a], [,b]) => b - a)
            .map(([motive, count]) => {
              const total = Object.values(metrics.motivesDistribution).reduce((sum, val) => sum + val, 0);
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
              return [motive, count, `${percentage}%`];
            })
        ];

        const motivesSheet = XLSX.utils.aoa_to_sheet(motivesData);
        XLSX.utils.book_append_sheet(workbook, motivesSheet, 'Motivos de Consulta');
      }

      // Hoja 4: Tendencias temporales
      if (metrics.sessionsOverTime.length > 0) {
        const trendsData = [
          ['Fecha', 'Sesiones', 'Pacientes Nuevos'],
          ...metrics.sessionsOverTime.map((sessionData, index) => {
            const patientData = metrics.patientsOverTime[index];
            return [
              format(new Date(sessionData.date), 'dd/MM/yyyy'),
              sessionData.value,
              patientData?.value || 0
            ];
          })
        ];

        const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData);
        XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Tendencias Temporales');
      }

      // Hoja 5: Carga de trabajo
      if (Object.keys(metrics.professionalWorkload).length > 0) {
        const workloadData = [
          ['Profesional ID', 'Número de Sesiones', 'Porcentaje del Total'],
          ...Object.entries(metrics.professionalWorkload)
            .sort(([,a], [,b]) => b - a)
            .map(([professionalId, sessions]) => {
              const totalSessions = Object.values(metrics.professionalWorkload).reduce((sum, val) => sum + val, 0);
              const percentage = totalSessions > 0 ? ((sessions / totalSessions) * 100).toFixed(1) : '0';
              return [professionalId, sessions, `${percentage}%`];
            })
        ];

        const workloadSheet = XLSX.utils.aoa_to_sheet(workloadData);
        XLSX.utils.book_append_sheet(workbook, workloadSheet, 'Carga de Trabajo');
      }

      // Incluir datos crudos si se solicita
      if (options.includeRawData) {
        // Hoja de sesiones
        if (rawData.sessions.length > 0) {
          const sessionsData = [
            ['ID', 'Fecha', 'Paciente ID', 'Profesional ID', 'Tipo', 'Estado', 'Duración', 'Tono Emocional', 'Nivel de Riesgo'],
            ...rawData.sessions.map(session => [
              session.id,
              session.date,
              session.patientId,
              session.professionalId,
              session.type,
              session.status,
              session.duration || '',
              session.aiAnalysis?.emotionalTone || '',
              session.aiAnalysis?.riskLevel || ''
            ])
          ];

          const sessionsSheet = XLSX.utils.aoa_to_sheet(sessionsData);
          XLSX.utils.book_append_sheet(workbook, sessionsSheet, 'Datos Sesiones');
        }

        // Hoja de pacientes
        if (rawData.patients.length > 0) {
          const patientsData = [
            ['ID', 'Nombre Completo', 'Fecha Nacimiento', 'Edad', 'Género', 'Estado Emocional', 'Motivo Consulta', 'Psicólogo Asignado', 'Estado'],
            ...rawData.patients.map(patient => [
              patient.id,
              patient.fullName,
              patient.birthDate,
              patient.age || '',
              patient.gender,
              patient.emotionalState,
              patient.motivoConsulta,
              patient.assignedPsychologist,
              patient.status
            ])
          ];

          const patientsSheet = XLSX.utils.aoa_to_sheet(patientsData);
          XLSX.utils.book_append_sheet(workbook, patientsSheet, 'Datos Pacientes');
        }

        // Hoja de alertas
        if (rawData.alerts.length > 0) {
          const alertsData = [
            ['ID', 'Tipo', 'Descripción', 'Urgencia', 'Estado', 'Paciente ID', 'Creado Por', 'Fecha Creación', 'Auto Generada'],
            ...rawData.alerts.map(alert => [
              alert.id,
              alert.type,
              alert.description,
              alert.urgency,
              alert.status,
              alert.patientId,
              alert.createdBy,
              format(alert.createdAt instanceof Date ? alert.createdAt : (alert.createdAt as { toDate(): Date }).toDate(), 'dd/MM/yyyy HH:mm'),
              alert.autoGenerated ? 'Sí' : 'No'
            ])
          ];

          const alertsSheet = XLSX.utils.aoa_to_sheet(alertsData);
          XLSX.utils.book_append_sheet(workbook, alertsSheet, 'Datos Alertas');
        }
      }

      // Descargar archivo Excel
      const fileName = `metricas_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
      XLSX.writeFile(workbook, fileName);

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Error al exportar a Excel');
    }
  }

  /**
   * Exporta métricas a Notion
   */
  static async exportToNotion(
    metrics: DashboardMetrics,
    options: ExportOptions,
    config: NotionExportConfig,
    centerName: string = 'Centro Psicológico'
  ): Promise<void> {
    try {
      // Preparar el contenido para Notion
      const content = {
        parent: { database_id: config.databaseId },
        properties: {
          'Título': {
            title: [
              {
                text: {
                  content: `${config.pageTitle} - ${format(new Date(), 'dd/MM/yyyy')}`
                }
              }
            ]
          },
          'Centro': {
            rich_text: [
              {
                text: {
                  content: centerName
                }
              }
            ]
          },
          'Período Inicio': {
            date: {
              start: format(metrics.periodStart, 'yyyy-MM-dd')
            }
          },
          'Período Fin': {
            date: {
              start: format(metrics.periodEnd, 'yyyy-MM-dd')
            }
          },
          'Pacientes Activos': {
            number: metrics.totalActivePatients
          },
          'Total Sesiones': {
            number: metrics.totalSessions
          },
          'Promedio Sesiones': {
            number: metrics.averageSessionsPerPatient
          },
          'Alertas Activas': {
            number: metrics.activeAlerts
          },
          'Tasa Seguimiento': {
            number: metrics.followUpRate
          }
        },
        children: [
          {
            object: 'block',
            type: 'heading_1',
            heading_1: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: 'Reporte de Métricas Clínicas'
                  }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: `Período analizado: ${format(metrics.periodStart, 'dd/MM/yyyy')} - ${format(metrics.periodEnd, 'dd/MM/yyyy')}`
                  }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: 'Métricas Principales'
                  }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: `Pacientes Activos: ${metrics.totalActivePatients}`
                  }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: `Total de Sesiones: ${metrics.totalSessions}`
                  }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: `Tasa de Seguimiento: ${metrics.followUpRate}%`
                  }
                }
              ]
            }
          }
        ]
      };

      // Enviar a Notion API
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(content)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Notion API error: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      console.log('Successfully exported to Notion:', result.url);

    } catch (error) {
      console.error('Error exporting to Notion:', error);
      throw new Error('Error al exportar a Notion');
    }
  }

  /**
   * Genera un resumen de métricas en texto
   */
  static generateMetricsSummary(metrics: DashboardMetrics): string {
    const summary = `
RESUMEN DE MÉTRICAS CLÍNICAS
============================

Período: ${format(metrics.periodStart, 'dd/MM/yyyy')} - ${format(metrics.periodEnd, 'dd/MM/yyyy')}
Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm')}

MÉTRICAS PRINCIPALES:
- Pacientes Activos: ${metrics.totalActivePatients}
- Total de Sesiones: ${metrics.totalSessions}
- Promedio Sesiones por Paciente: ${metrics.averageSessionsPerPatient}
- Tasa de Seguimiento: ${metrics.followUpRate}%

ALERTAS:
- Activas: ${metrics.activeAlerts}
- Resueltas: ${metrics.resolvedAlerts}

EVALUACIÓN DE RIESGO:
- Alto Riesgo: ${metrics.highRiskPatients} pacientes
- Riesgo Medio: ${metrics.mediumRiskPatients} pacientes
- Bajo Riesgo: ${metrics.lowRiskPatients} pacientes

ESTADOS EMOCIONALES MÁS FRECUENTES:
${Object.entries(metrics.emotionalDistribution)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([emotion, count]) => `- ${emotion}: ${count} registros`)
  .join('\n')}

MOTIVOS DE CONSULTA PRINCIPALES:
${Object.entries(metrics.motivesDistribution)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([motive, count]) => `- ${motive}: ${count} pacientes`)
  .join('\n')}
    `.trim();

    return summary;
  }

  /**
   * Valida las opciones de exportación
   */
  static validateExportOptions(options: ExportOptions): boolean {
    if (!options.format || !['pdf', 'excel', 'notion'].includes(options.format)) {
      throw new Error('Formato de exportación no válido');
    }

    if (!options.dateRange || !options.dateRange.start || !options.dateRange.end) {
      throw new Error('Rango de fechas requerido para exportación');
    }

    return true;
  }
}
