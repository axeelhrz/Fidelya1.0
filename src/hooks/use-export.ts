import { useState } from 'react';
import { exportToPdf, exportToCsv, exportToExcel } from '@/components/services/export.services';



export interface AnalyticsValues {
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
    byType?: { name: string; value: number; }[];
    byMonth?: { month: string; new: number; renewals: number; }[];
    expirations?: { range: string; value: number; }[];
    satisfaction?: number;
  }; 
  lists: {
    recentPolicies?: { type: string; clientName: string; premium: number; status: string; date: string; }[];
    activeCustomers?: { name: string; lastActivity: string; policyCount: number; totalPremium?: number; }[];
    pendingTasks?: { description: string; dueDate: string; priority: string; }[];
  };
}

// El contenedor exportable
export interface ExportableAnalytics {
  id: string; // Un identificador único (por ejemplo el uid del usuario o un timestamp)
  name: string; // Nombre del reporte (ej: "Reporte General")
  values: AnalyticsValues; // Contenido real del reporte
}

// Tipo que se pasa a useExport
export interface UseExportProps {
  data: ExportableAnalytics;
}


// This interface is no longer needed as we're using AnalyticsValues directly

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'excel';
  sections: string[];
  fileName?: string;
  data?: AnalyticsValues; // Optional data to be passed to the export function
  // Add other export options as needed
}

interface UseExportReturn {
  exportData: (options: ExportOptions) => void;
  exporting: boolean;
  error: Error | null;
}

export const useExport = ({ data }: UseExportProps): UseExportReturn => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const exportData = (options: ExportOptions) => {
    setExporting(true);
    setError(null);
    
    try {
      switch (options.format) {
        case 'pdf':
          // Ensure non-optional graph properties by providing defaults
          const pdfData = {
            ...data.values,
            graphs: {
              byType: data.values.graphs.byType || [],
              byMonth: data.values.graphs.byMonth || [],
              expirations: data.values.graphs.expirations || [],
              satisfaction: data.values.graphs.satisfaction || 0
            },
            lists: {
              recentPolicies: data.values.lists.recentPolicies || [],
              activeCustomers: data.values.lists.activeCustomers || [],
              pendingTasks: data.values.lists.pendingTasks || []
            }
          };
          exportToPdf(pdfData, options);
          break;
        case 'csv':
          // Provide defaults for optional properties
          const csvData = {
            ...data.values,
            graphs: {
              byType: data.values.graphs.byType || [],
              byMonth: data.values.graphs.byMonth || [],
              expirations: data.values.graphs.expirations || [],
              satisfaction: data.values.graphs.satisfaction || 0
            },
            lists: {
              recentPolicies: data.values.lists.recentPolicies || [],
              activeCustomers: data.values.lists.activeCustomers || [],
              pendingTasks: data.values.lists.pendingTasks || []
            }
          };
          exportToCsv(csvData, options);
          break;
        case 'excel':
          // Provide defaults for optional properties
          const excelData = {
            ...data.values,
            graphs: {
              byType: data.values.graphs.byType || [],
              byMonth: data.values.graphs.byMonth || [],
              expirations: data.values.graphs.expirations || [],
              satisfaction: data.values.graphs.satisfaction || 0
            },
            lists: {
              recentPolicies: data.values.lists.recentPolicies || [],
              activeCustomers: data.values.lists.activeCustomers || [],
              pendingTasks: data.values.lists.pendingTasks || []
            }
          };
          exportToExcel(excelData, options);
          break;
        default:
          throw new Error(`Formato de exportación no soportado: ${options.format}`);
      }
    } catch (err) {
      console.error('Error exporting data:', err);
      setError(err as Error);
    } finally {
      setExporting(false);
    }
  };
  
  return {
    exportData,
    exporting,
    error
  };
};