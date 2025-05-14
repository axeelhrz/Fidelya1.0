import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Stack, 
  Typography, 
  CircularProgress, 
  Alert, 
  useTheme, 
  alpha,
  Button,
  useMediaQuery,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  FileText, 
  BarChart3, 
  ListChecks, 
  Lightbulb, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

// Componentes
import { KpiCard } from '@/components/dashboard/analytics/kpi-card';
import { PolicyTypePieChart } from '@/components/dashboard/analytics/policy-type-pie-chart';
import { SalesTrendLineChart } from '@/components/dashboard/analytics/sales-trend-line-chart';
import { ExpirationAnalysisBarChart } from '@/components/dashboard/analytics/expiration-anaysis-bar-chart';
import { ClientSatisfactionGauge } from '@/components/dashboard/analytics/client-satisfaction-gauge';
import { RecentActivityList } from '@/components/dashboard/analytics/recent-activity-list';
import { ActionableIntelligence } from '@/components/dashboard/analytics/actionable-intelligence';
import { RealTimeAlerts } from '@/components/dashboard/analytics/realtime-alerts';
import { IndustryComparison } from '@/components/dashboard/analytics/industry-comparison';
import { AnalyticsFilters } from '@/components/dashboard/analytics/analytics-filters';
import { ExportOptions } from '@/components/dashboard/analytics/export-options';

// Hooks y servicios
import { useAnalyticsData } from '@/hooks/use-analyitics-data';
import { useFilters } from '@/hooks/use-filters';

// Tipos
// Define the types directly since they're not exported from '@/types/index'
type UserPlan = 'basic' | 'pro' | 'enterprise';
type PolicyType = 'Salud' | 'Vida' | 'Auto' | 'Hogar' | 'Empresa' | 'Otros';
// Import the prop type from analytics-filters
interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  sections: ('kpis' | 'recommendations' | 'graphs' | 'lists' | 'alerts')[];
  includeCharts: boolean;
  fileName?: string;
}
type ImportedExportOptions = ExportOptions;

// Define the interface for exportable analytics data
interface ExportableAnalytics {
  id: string;
  name: string;
  values: AnalyticsData | null;
}

// Analytics data structure
export interface KpiData {
  totalPolicies: number;
  totalPremiums: number;
  newClientsMonthly: number;
  retentionRate: number;
  policyTrend: 'up' | 'down' | 'neutral';
  premiumTrend: 'up' | 'down' | 'neutral';
  clientTrend: 'up' | 'down' | 'neutral';
  retentionTrend: 'up' | 'down' | 'neutral';
}

export interface AnalyticsData {
  kpis: KpiData;
  graphs?: {
    byType: Array<{ type: PolicyType; count: number; value: number }>;
    byMonth: Array<{ month: string; policies: number; premiums: number }>;
    expirations: Array<{ month: string; count: number; value: number }>;
    satisfaction?: number;
    industryComparison?: Array<{ metric: string; companyValue: number; industryAverage: number }>;
  };
  recommendations?: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    type: string;
  }>;
  alerts?: Array<{
    id: string;
    title: string;
    message: string;
    type: 'warning' | 'error' | 'info';
    timestamp: string;
    read: boolean;
  }>;
  lists?: {
    recentPolicies: Array<{
      id: string;
      policyNumber: string;
      client: string;
      type: PolicyType;
      insurer: string;
      premium: number;
      startDate: string;
      status: 'active' | 'pending' | 'renewed' | 'cancelled';
    }>;
    activeCustomers: Array<{
      id: string;
      name: string;
      activePolicies: number;
      totalPremium: number;
      lastActivity: string;
    }>;
    pendingTasks: Array<{
      id: string;
      title: string;
      dueDate: string;
      priority: 'high' | 'medium' | 'low';
      type: 'renewal' | 'payment' | 'document' | 'other';
    }>;
  };
  lastUpdated?: string;
}

// Simulación del plan del usuario (esto vendría de tu Auth Context o similar)
const currentUserPlan = 'enterprise' as UserPlan; // Cambia esto para probar restricciones

// Datos simulados para filtros
const availablePolicyTypes: PolicyType[] = ['Salud', 'Vida', 'Auto', 'Hogar', 'Empresa', 'Otros'];
const availableInsurers = ['Aseguradora ABC', 'Seguros XYZ', 'Compañía 123', 'Aseguradora DEF'];
const availableClients = [
  { id: 'c1', name: 'Ana García' },
  { id: 'c2', name: 'Luis Fernández' },
  { id: 'c3', name: 'María Rodríguez' },
  { id: 'c4', name: 'Carlos Sánchez' },
  { id: 'c5', name: 'Empresa XYZ' }
];

export const AnalysisPage: React.FC = () => {
  const theme = useTheme();
  const [userId] = useState<string>('user123'); // Simulado, vendría de tu Auth Context
  const [exportError, setExportError] = useState<Error | null>(null);
  
  // Hooks personalizados
  const { filters, setDateRange, setPolicyTypes, setInsurers, setClientIds, setOnlyActive, resetFilters } = useFilters();
  // Add index signature to make the filters compatible with useAnalyticsData hook
  const filtersWithIndex = { ...filters, [Symbol.iterator]: undefined } as {
    [key: string]: unknown;
    dateRange?: { start: Date; end: Date };
    policyTypes?: string[];
    insurers?: string[];
    clientIds?: string[];
    onlyActive?: boolean;
  };
  const { data, loading, error, refetch } = useAnalyticsData({
        userId,
        userPlan: currentUserPlan,
        filters: filtersWithIndex,
        realtime: currentUserPlan === 'pro' || currentUserPlan === 'enterprise', // Solo tiempo real para Pro y Enterprise
      }) as { 
      data: AnalyticsData | null; 
      loading: boolean; 
      error: Error | null; 
      refetch: () => void 
    };
    const exportableData: ExportableAnalytics = {
      id: userId,
      name: 'Analytics Dashboard',
      values: data || {
        kpis: {
          totalPolicies: 0,
          totalPremiums: 0,
          newClientsMonthly: 0,
          retentionRate: 0,
          policyTrend: 'neutral',
          premiumTrend: 'neutral',
          clientTrend: 'neutral',
          retentionTrend: 'neutral'
        }
      } // Provide default valid object when data is null
    };
    
    
  
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };
  
  // Manejar cambios en filtros
  const handleFilterChange = (newFilters: {
    dateRange?: { start: Date; end: Date };
    policyTypes?: string[];
    insurers?: string[];
    clientIds?: string[];
    onlyActive?: boolean;
  }) => {
    // Aquí podrías aplicar lógica adicional antes de actualizar los filtros
    // Por ejemplo, validar fechas, etc.
    
    // Actualizar cada filtro individualmente
    if (newFilters.dateRange) {
      setDateRange(newFilters.dateRange.start, newFilters.dateRange.end);
    }
    
    if (newFilters.policyTypes) {
      setPolicyTypes(newFilters.policyTypes);
    }
    
    if (newFilters.insurers) {
      setInsurers(newFilters.insurers);
    }
    
    if (newFilters.clientIds) {
      setClientIds(newFilters.clientIds);
    }
    
    if (newFilters.onlyActive !== undefined) {
      setOnlyActive(newFilters.onlyActive);
    }
  };
  // Manejar exportación
  const handleExport = (options: Partial<ImportedExportOptions>) => {
    // Ensure all required fields are present
    const exportOptions: ImportedExportOptions = {
      format: options.format || 'pdf',
      sections: options.sections || ['kpis', 'graphs', 'lists'],
      includeCharts: options.includeCharts !== undefined ? options.includeCharts : true,
      fileName: options.fileName
    };
    
    try {
      // We would pass the exportableData to the export function
      console.log('Exporting data with options:', exportOptions, exportableData);
      
      // This function is likely defined elsewhere and needs to be imported
      // exportData(exportOptions, exportableData);
    } catch (error) {
      setExportError(error instanceof Error ? error : new Error('Unknown export error'));
    }
  };
  
  // Manejar actualización manual
  const handleRefresh = () => {
    refetch();
  };
  
  // Manejar descarte de alertas (simulado)
  const handleDismissAlert = (alertId: string) => {
    console.log('Dismiss alert:', alertId);
    // En un caso real, llamarías a una función para marcar la alerta como leída
  };

  if (loading && !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Error al cargar los datos de análisis: {error.message}
        </Alert>
      </Box>
    );
  }

  if (!data || !data.kpis) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          No hay datos de análisis disponibles.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 64px)', // Ajustar según altura de tu AppBar/Header
      }}
    >
      {/* Cabecera con título y acciones */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontFamily: 'Sora, sans-serif', 
              fontWeight: 700,
              color: theme.palette.text.primary
            }}
          >
            Análisis de Cartera
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: 'Inter, sans-serif',
              color: theme.palette.text.secondary,
              mt: 0.5
            }}
          >
            Visualiza métricas clave y obtén insights accionables sobre tu negocio
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <AnalyticsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            policyTypes={availablePolicyTypes}
            insurers={availableInsurers}
            clients={availableClients}
          />
          
          <ExportOptions
            onExport={handleExport}
            isExporting={false}
          />
          
          <Button
            variant="outlined"
            onClick={handleRefresh}
            disabled={loading}
            startIcon={<RefreshCw size={16} />}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Actualizar
          </Button>
        </Box>
        
        {exportError && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: '12px' }}
            onClose={() => setExportError(null)}
          >
            Error al exportar datos: {exportError.message}
          </Alert>
        )}
      </Box>
      
      <Stack spacing={4}>
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Sora, sans-serif', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <LayoutDashboard size={20} />
            Resumen Ejecutivo
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            <KpiCard
              title="Pólizas Activas"
              value={data.kpis?.totalPolicies ?? 0}
              icon={<FileText size={28} color={theme.palette.primary.main} />}
              trend={data.kpis?.policyTrend ?? 'neutral'}
              tooltip="Número total de pólizas actualmente vigentes."
              color={theme.palette.primary.main}
            />
            <KpiCard
              title="Primas Aseguradas"
              value={data.kpis?.totalPremiums ?? 0}
              isCurrency={true}
              icon={<TrendingUp size={28} color={theme.palette.success.main} />}
              trend={data.kpis?.premiumTrend ?? 'neutral'}
              tooltip="Suma total de las primas de las pólizas activas."
              color={theme.palette.success.main}
            />
            <KpiCard
              title="Clientes Nuevos (Mes)"
              value={data.kpis?.newClientsMonthly ?? 0}
              icon={<Users size={28} color={theme.palette.info.main} />}
              trend={data.kpis?.clientTrend ?? 'neutral'}
              tooltip="Número de clientes nuevos registrados este mes."
              color={theme.palette.info.main}
            />
            <KpiCard
              title="Retención (%)"
              value={data.kpis?.retentionRate ?? 0}
              isPercentage={true}
              icon={<BarChart3 size={28} color={theme.palette.warning.main} />}
              trend={data.kpis?.retentionTrend ?? 'neutral'}
              tooltip="Porcentaje de clientes que renuevan sus pólizas."
              color={theme.palette.warning.main}
            />
          </Box>
        </motion.div>

        {/* 2. Gráficos Visuales */}
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Sora, sans-serif', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <BarChart3 size={20} />
            Análisis Visual
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
              <PolicyTypePieChart 
                data={(data.graphs?.byType ?? []).map(item => ({ 
                  name: item.type, 
                  value: item.value 
                }))} 
                loading={loading} 
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
              <SalesTrendLineChart 
                data={(data.graphs?.byMonth ?? []).map(item => ({
                  month: item.month,
                  new: item.policies * 0.3, // Estimated new policies
                  renewals: item.policies * 0.7, // Estimated renewals
                  total: item.premiums // Using premiums as total
                }))} 
                loading={loading} 
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
              <ExpirationAnalysisBarChart 
                data={(data.graphs?.expirations ?? []).map(item => ({
                  month: item.month,
                  count: item.count,
                  value: item.value,
                  range: item.month, // Using month as range if not available
                  color: theme.palette.primary.main // Using theme color
                }))} 
                loading={loading} 
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
              <ClientSatisfactionGauge value={data.graphs?.satisfaction ?? 0} loading={loading} />
            </Box>
          </Box>
        </motion.div>
        
        {/* 3. Comparativa con la Industria (Solo Enterprise) */}
        {currentUserPlan === 'enterprise' && data.graphs?.industryComparison && (
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontFamily: 'Sora, sans-serif', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TrendingUp size={20} />
              Comparativa con la Industria
            </Typography>
            <IndustryComparison data={data.graphs.industryComparison.map(item => ({
              metric: item.metric,
              yourValue: item.companyValue,
              industryAvg: item.industryAverage,
              difference: item.companyValue - item.industryAverage
            }))} />
          </motion.div>
        )}

        {/* 4. Listado Analítico Reciente */}
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Sora, sans-serif', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ListChecks size={20} />
            Actividad Reciente y Tareas
          </Typography>
          <RecentActivityList
            recentPolicies={(data.lists?.recentPolicies ?? []).map(policy => ({
              ...policy,
              clientName: policy.client, // Map client to clientName
              date: policy.startDate // Map startDate to date
            }))}
            activeCustomers={(data.lists?.activeCustomers ?? []).map(customer => ({
              ...customer,
              policyCount: customer.activePolicies // Map activePolicies to policyCount
            }))}
            pendingTasks={(data.lists?.pendingTasks ?? []).map(task => ({
              id: task.id,
              description: task.title, // Use title as description
              priority: task.priority,
              dueDate: task.dueDate,
              relatedEntity: {
                type: task.type,
                name: task.title
              }
            }))}
          />
        </motion.div>

        {/* 5. Inteligencia Accionable (Restringido por Plan) */}
        {(currentUserPlan === 'pro' || currentUserPlan === 'enterprise') && (
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontFamily: 'Sora, sans-serif', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Lightbulb size={20} />
              Inteligencia Accionable
            </Typography>
            <ActionableIntelligence 
              recommendations={(data.recommendations ?? []).map(rec => ({
                id: rec.id,
                priority: rec.priority,
                text: rec.description,
                actionable: true,
                actionText: rec.title,
                type: rec.type
              }))} 
            />
          </motion.div>
        )}

        {/* 6. Alertas en Tiempo Real (Restringido por Plan) */}
        {currentUserPlan === 'enterprise' && (
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontFamily: 'Sora, sans-serif', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <AlertTriangle size={20} />
              Alertas Importantes
            </Typography>
            <RealTimeAlerts 
              alerts={(data.alerts ?? []).map(alert => ({
                id: alert.id,
                severity: alert.type,
                text: alert.message,
                timestamp: alert.timestamp,
                read: alert.read,
                title: alert.title
              }))} 
              onDismiss={handleDismissAlert}
            />
          </motion.div>
        )}
      </Stack>
      
      {/* Pie de página con última actualización */}
      <Box 
        sx={{ 
          mt: 4, 
          pt: 2, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            fontFamily: 'Inter, sans-serif',
            color: theme.palette.text.secondary
          }}
        >
          Última actualización: {data.lastUpdated || 'Desconocida'}
          {currentUserPlan !== 'basic' && ' (Actualización en tiempo real activada)'}
        </Typography>
        
        <Typography 
          variant="caption" 
          sx={{ 
            fontFamily: 'Inter, sans-serif',
            color: theme.palette.text.secondary
          }}
        >
          Plan actual: {currentUserPlan.toUpperCase()}
        </Typography>
      </Box>
    </Box>
  );
};