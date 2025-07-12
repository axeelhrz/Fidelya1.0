import { BaseFirebaseService } from './firebaseService';
import { COLLECTIONS } from '@/lib/firebase';

// Define FirebaseDocument interface if not imported from elsewhere
export interface FirebaseDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaces para datos comerciales
export interface Lead extends FirebaseDocument {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: 'google_ads' | 'facebook' | 'referral' | 'organic' | 'email' | 'direct';
  campaign?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo?: string;
  notes: string;
  tags: string[];
  lastContact?: Date;
  conversionDate?: Date;
  conversionValue?: number;
  interests: string[];
  urgency: 'low' | 'medium' | 'high';
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface Campaign extends FirebaseDocument {
  name: string;
  type: 'google_ads' | 'facebook' | 'email' | 'referral' | 'content';
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  dateRange: {
    start: Date;
    end: Date;
  };
  targeting: {
    demographics: string[];
    interests: string[];
    locations: string[];
    ageRange?: { min: number; max: number };
  };
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpa: number;
    roas: number;
  };
  creatives: {
    headlines: string[];
    descriptions: string[];
    images: string[];
    videos: string[];
  };
}

export interface MarketingMetrics extends FirebaseDocument {
  period: string; // YYYY-MM format
  channels: {
    [channel: string]: {
      leads: number;
      conversions: number;
      spent: number;
      revenue: number;
      cac: number;
      roas: number;
    };
  };
  totalLeads: number;
  totalConversions: number;
  totalSpent: number;
  totalRevenue: number;
  overallCAC: number;
  overallROAS: number;
  conversionRate: number;
  ltv: number;
}

export interface CommercialSummary {
  totalLeads: number;
  totalConversions: number;
  conversionRate: number;
  averageCAC: number;
  averageLTV: number;
  ltvCacRatio: number;
  channelPerformance: ChannelPerformance[];
  campaignPerformance: CampaignPerformance[];
  monthlyTrends: MonthlyTrend[];
  topSources: SourcePerformance[];
}

export interface ChannelPerformance {
  channel: string;
  leads: number;
  conversions: number;
  rate: number;
  spent: number;
  cac: number;
  roas: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface CampaignPerformance {
  id: string;
  name: string;
  status: Campaign['status'];
  spent: number;
  leads: number;
  conversions: number;
  cac: number;
  roas: number;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

export interface MonthlyTrend {
  month: string;
  leads: number;
  conversions: number;
  cac: number;
  ltv: number;
  roas: number;
  spent: number;
  revenue: number;
}

export interface SourcePerformance {
  source: string;
  leads: number;
  conversions: number;
  rate: number;
  revenue: number;
}

// Servicios especializados
class LeadService extends BaseFirebaseService<Lead> {
  constructor() {
    super(COLLECTIONS.LEADS);
  }

  async getLeadsBySource(centerId: string, source: Lead['source']): Promise<Lead[]> {
    return this.getAll(centerId, {
      where: [{ field: 'source', operator: '==', value: source }],
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  }

  async getLeadsByStatus(centerId: string, status: Lead['status']): Promise<Lead[]> {
    return this.getAll(centerId, {
      where: [{ field: 'status', operator: '==', value: status }],
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  }

  async getConvertedLeads(centerId: string, startDate?: Date, endDate?: Date): Promise<Lead[]> {
    type WhereFilterOp = '<' | '<=' | '==' | '>=' | '>' | '!=' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';
    const whereConditions: { field: string; operator: WhereFilterOp; value: unknown }[] = [
      { field: 'status', operator: '==', value: 'converted' }
    ];
    
    if (startDate) {
      whereConditions.push({ field: 'conversionDate', operator: '>=', value: startDate.toISOString() });
    }
    
    if (endDate) {
      whereConditions.push({ field: 'conversionDate', operator: '<=', value: endDate.toISOString() });
    }

    return this.getAll(centerId, {
      where: whereConditions,
      orderBy: { field: 'conversionDate', direction: 'desc' }
    });
  }

  async getLeadsByDateRange(centerId: string, startDate: Date, endDate: Date): Promise<Lead[]> {
    return this.getAll(centerId, {
      where: [
        { field: 'createdAt', operator: '>=', value: startDate },
        { field: 'createdAt', operator: '<=', value: endDate }
      ],
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  }

  async updateLeadStatus(centerId: string, leadId: string, status: Lead['status'], notes?: string): Promise<void> {
    const updateData: Partial<Lead> = { status };
    
    if (status === 'converted') {
      updateData.conversionDate = new Date();
    }
    
    if (notes) {
      updateData.notes = notes;
    }

    await this.update(centerId, leadId, updateData);
  }
}

class CampaignService extends BaseFirebaseService<Campaign> {
  constructor() {
    super(COLLECTIONS.CAMPAIGNS);
  }

  async getActiveCampaigns(centerId: string): Promise<Campaign[]> {
    return this.getAll(centerId, {
      where: [{ field: 'status', operator: '==', value: 'active' }],
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  }

  async getCampaignsByType(centerId: string, type: Campaign['type']): Promise<Campaign[]> {
    return this.getAll(centerId, {
      where: [{ field: 'type', operator: '==', value: type }],
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
  }

  async updateCampaignMetrics(centerId: string, campaignId: string, metrics: Partial<Campaign['metrics']>): Promise<void> {
    const campaign = await this.getById(centerId, campaignId);
    if (!campaign) throw new Error('Campaign not found');

    const updatedMetrics = { ...campaign.metrics, ...metrics };
    await this.update(centerId, campaignId, { metrics: updatedMetrics });
  }

  async pauseCampaign(centerId: string, campaignId: string): Promise<void> {
    await this.update(centerId, campaignId, { status: 'paused' });
  }

  async resumeCampaign(centerId: string, campaignId: string): Promise<void> {
    await this.update(centerId, campaignId, { status: 'active' });
  }
}

class MarketingMetricsService extends BaseFirebaseService<MarketingMetrics> {
  constructor() {
    super('marketing_metrics');
  }

  async getMetricsByPeriod(centerId: string, period: string): Promise<MarketingMetrics | null> {
    const metrics = await this.getAll(centerId, {
      where: [{ field: 'period', operator: '==', value: period }],
      limit: 1
    });

    return metrics.length > 0 ? metrics[0] : null;
  }

  async getMetricsByDateRange(centerId: string, startPeriod: string, endPeriod: string): Promise<MarketingMetrics[]> {
    return this.getAll(centerId, {
      where: [
        { field: 'period', operator: '>=', value: startPeriod },
        { field: 'period', operator: '<=', value: endPeriod }
      ],
      orderBy: { field: 'period', direction: 'asc' }
    });
  }
}

// Servicio principal para datos comerciales
export class CommercialService {
  private leadService = new LeadService();
  private campaignService = new CampaignService();
  private metricsService = new MarketingMetricsService();

  async getCommercialSummary(centerId: string, months: number = 6): Promise<CommercialSummary> {
    try {
      // Calcular fechas
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      // Obtener datos en paralelo
      const [leads, campaigns, convertedLeads] = await Promise.all([
        this.leadService.getLeadsByDateRange(centerId, startDate, endDate),
        this.campaignService.getAll(centerId, { 
          orderBy: { field: 'createdAt', direction: 'desc' },
          limit: 20 
        }),
        this.leadService.getConvertedLeads(centerId, startDate, endDate)
      ]);

      // Procesar datos
      const totalLeads = leads.length;
      const totalConversions = convertedLeads.length;
      const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;

      const channelPerformance = this.calculateChannelPerformance(leads, convertedLeads);
      const campaignPerformance = this.calculateCampaignPerformance(campaigns);
      const monthlyTrends = this.calculateMonthlyTrends(leads, convertedLeads);
      const topSources = this.calculateTopSources(leads, convertedLeads);

      // Calcular CAC y LTV promedio
      const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.budget.spent, 0);
      const averageCAC = totalConversions > 0 ? totalSpent / totalConversions : 0;
      const averageLTV = convertedLeads.reduce((sum, lead) => sum + (lead.conversionValue || 0), 0) / Math.max(totalConversions, 1);
      const ltvCacRatio = averageCAC > 0 ? averageLTV / averageCAC : 0;

      return {
        totalLeads,
        totalConversions,
        conversionRate,
        averageCAC,
        averageLTV,
        ltvCacRatio,
        channelPerformance,
        campaignPerformance,
        monthlyTrends,
        topSources
      };
    } catch (error) {
      console.error('Error getting commercial summary:', error);
      throw error;
    }
  }

  private calculateChannelPerformance(leads: Lead[], convertedLeads: Lead[]): ChannelPerformance[] {
    const channels = ['google_ads', 'facebook', 'referral', 'organic', 'email', 'direct'];
    const colors = ['#3B82F6', '#1877F2', '#10B981', '#84CC16', '#F59E0B', '#6B7280'];

    return channels.map((channel, index) => {
      const channelLeads = leads.filter(lead => lead.source === channel);
      const channelConversions = convertedLeads.filter(lead => lead.source === channel);
      const rate = channelLeads.length > 0 ? (channelConversions.length / channelLeads.length) * 100 : 0;

      // Simular datos de gasto y CAC (en un caso real vendrían de las campañas)
      const spent = this.getChannelSpent(channel);
      const cac = channelConversions.length > 0 ? spent / channelConversions.length : 0;
      const revenue = channelConversions.reduce((sum, lead) => sum + (lead.conversionValue || 0), 0);
      const roas = spent > 0 ? revenue / spent : 0;

      return {
        channel: this.getChannelDisplayName(channel),
        leads: channelLeads.length,
        conversions: channelConversions.length,
        rate,
        spent,
        cac,
        roas,
        trend: this.calculateTrend(channel), // Simplificado
        color: colors[index]
      };
    });
  }

  private calculateCampaignPerformance(campaigns: Campaign[]): CampaignPerformance[] {
    return campaigns.map(campaign => {
      const cac = campaign.metrics.conversions > 0 
        ? campaign.budget.spent / campaign.metrics.conversions 
        : 0;
      
      const roas = campaign.budget.spent > 0 
        ? (campaign.metrics.conversions * 200) / campaign.budget.spent // Asumiendo valor promedio de conversión
        : 0;

      let performance: CampaignPerformance['performance'];
      if (roas >= 4) performance = 'excellent';
      else if (roas >= 3) performance = 'good';
      else if (roas >= 2) performance = 'average';
      else performance = 'poor';

      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        spent: campaign.budget.spent,
        leads: campaign.metrics.clicks, // Simplificado
        conversions: campaign.metrics.conversions,
        cac,
        roas,
        performance
      };
    });
  }

  private calculateMonthlyTrends(leads: Lead[], convertedLeads: Lead[]): MonthlyTrend[] {
    const monthlyMap = new Map<string, MonthlyTrend>();

    // Procesar leads por mes
    leads.forEach(lead => {
      const monthKey = `${lead.createdAt.getFullYear()}-${String(lead.createdAt.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: monthKey,
          leads: 0,
          conversions: 0,
          cac: 0,
          ltv: 0,
          roas: 0,
          spent: 0,
          revenue: 0
        });
      }
      
      const monthData = monthlyMap.get(monthKey)!;
      monthData.leads += 1;
    });

    // Procesar conversiones por mes
    convertedLeads.forEach(lead => {
      if (!lead.conversionDate) return;
      
      const monthKey = `${lead.conversionDate.getFullYear()}-${String(lead.conversionDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: monthKey,
          leads: 0,
          conversions: 0,
          cac: 0,
          ltv: 0,
          roas: 0,
          spent: 0,
          revenue: 0
        });
      }
      
      const monthData = monthlyMap.get(monthKey)!;
      monthData.conversions += 1;
      monthData.revenue += lead.conversionValue || 0;
    });

    // Calcular métricas adicionales
    return Array.from(monthlyMap.values()).map(monthData => {
      monthData.spent = monthData.leads * 15; // Simulado
      monthData.cac = monthData.conversions > 0 ? monthData.spent / monthData.conversions : 0;
      monthData.ltv = monthData.conversions > 0 ? monthData.revenue / monthData.conversions : 0;
      monthData.roas = monthData.spent > 0 ? monthData.revenue / monthData.spent : 0;
      return monthData;
    }).sort((a, b) => a.month.localeCompare(b.month));
  }

  private calculateTopSources(leads: Lead[], convertedLeads: Lead[]): SourcePerformance[] {
    const sourceMap = new Map<string, SourcePerformance>();

    leads.forEach(lead => {
      if (!sourceMap.has(lead.source)) {
        sourceMap.set(lead.source, {
          source: this.getChannelDisplayName(lead.source),
          leads: 0,
          conversions: 0,
          rate: 0,
          revenue: 0
        });
      }
      sourceMap.get(lead.source)!.leads += 1;
    });

    convertedLeads.forEach(lead => {
      if (sourceMap.has(lead.source)) {
        const sourceData = sourceMap.get(lead.source)!;
        sourceData.conversions += 1;
        sourceData.revenue += lead.conversionValue || 0;
      }
    });

    // Calcular tasas de conversión
    Array.from(sourceMap.values()).forEach(source => {
      source.rate = source.leads > 0 ? (source.conversions / source.leads) * 100 : 0;
    });

    return Array.from(sourceMap.values())
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 5);
  }

  private getChannelDisplayName(channel: string): string {
    const names: { [key: string]: string } = {
      'google_ads': 'Google Ads',
      'facebook': 'Facebook',
      'referral': 'Referidos',
      'organic': 'Orgánico',
      'email': 'Email',
      'direct': 'Directo'
    };
    return names[channel] || channel;
  }

  private getChannelSpent(channel: string): number {
    // Simulado - en un caso real vendría de las campañas
    const spentMap: { [key: string]: number } = {
      'google_ads': 3200,
      'facebook': 1800,
      'referral': 0,
      'organic': 0,
      'email': 450,
      'direct': 0
    };
    return spentMap[channel] || 0;
  }

  private calculateTrend(channel: string): 'up' | 'down' | 'stable' {
    // Simplificado - en un caso real se calcularía comparando períodos
    const trends: { [key: string]: 'up' | 'down' | 'stable' } = {
      'google_ads': 'up',
      'facebook': 'up',
      'referral': 'up',
      'organic': 'stable',
      'email': 'down',
      'direct': 'stable'
    };
    return trends[channel] || 'stable';
  }

  // Métodos para suscripciones en tiempo real
  subscribeToLeads(centerId: string, callback: (leads: Lead[]) => void): () => void {
    return this.leadService.subscribeToChanges(centerId, callback, {
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit: 100
    });
  }

  subscribeToCampaigns(centerId: string, callback: (campaigns: Campaign[]) => void): () => void {
    return this.campaignService.subscribeToChanges(centerId, callback, {
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit: 20
    });
  }

  // Métodos para gestión de leads
  async convertLead(centerId: string, leadId: string, conversionValue: number, notes?: string): Promise<void> {
    await this.leadService.updateLeadStatus(centerId, leadId, 'converted', notes);
    await this.leadService.update(centerId, leadId, {
      conversionValue,
      conversionDate: new Date()
    });
  }

  async assignLead(centerId: string, leadId: string, assignedTo: string): Promise<void> {
    await this.leadService.update(centerId, leadId, { assignedTo });
  }
}

// Exportar instancia del servicio
export const commercialService = new CommercialService();
export { LeadService, CampaignService, MarketingMetricsService };
