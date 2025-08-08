import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  Timestamp,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NotificationDelivery } from '@/types/notification';

export interface NotificationAnalytics {
  // Delivery metrics
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  failureRate: number;
  
  // Channel performance
  channelStats: {
    email: ChannelStats;
    sms: ChannelStats;
    push: ChannelStats;
    app: ChannelStats;
  };
  
  // Time-based metrics
  hourlyDistribution: HourlyStats[];
  dailyTrends: DailyStats[];
  weeklyTrends: WeeklyStats[];
  monthlyTrends: MonthlyStats[];
  
  // Performance metrics
  averageDeliveryTime: number;
  peakHours: number[];
  bestPerformingDays: string[];
  
  // User engagement
  clickThroughRate: number;
  openRate: number;
  unsubscribeRate: number;
  
  // Error analysis
  topErrors: ErrorStats[];
  errorTrends: ErrorTrend[];
  
  // Template performance
  templatePerformance: TemplateStats[];
  
  // Geographic distribution (if available)
  geographicStats?: GeographicStats[];
}

export interface ChannelStats {
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  averageDeliveryTime: number;
  cost?: number;
  engagement?: {
    opens: number;
    clicks: number;
    conversions: number;
  };
}

export interface HourlyStats {
  hour: number;
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
}

export interface DailyStats {
  date: string;
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  uniqueRecipients: number;
}

export interface WeeklyStats {
  week: string;
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  growth: number;
}

export interface MonthlyStats {
  month: string;
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  growth: number;
  revenue?: number;
}

export interface ErrorStats {
  error: string;
  count: number;
  percentage: number;
  channels: string[];
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface ErrorTrend {
  date: string;
  errorCount: number;
  totalAttempts: number;
  errorRate: number;
}

export interface TemplateStats {
  templateId: string;
  templateName: string;
  sent: number;
  delivered: number;
  deliveryRate: number;
  engagement: {
    opens: number;
    clicks: number;
    conversions: number;
  };
  revenue?: number;
}

export interface GeographicStats {
  country: string;
  region?: string;
  sent: number;
  delivered: number;
  deliveryRate: number;
}

export interface CampaignAnalytics {
  campaignId: string;
  campaignName: string;
  startDate: Date;
  endDate?: Date;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'cancelled';
  
  // Targeting
  targetAudience: {
    total: number;
    segments: string[];
    filters: Record<string, any>;
  };
  
  // Performance
  performance: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    unsubscribed: number;
    
    // Rates
    deliveryRate: number;
    openRate: number;
    clickThroughRate: number;
    conversionRate: number;
    unsubscribeRate: number;
  };
  
  // Financial
  costs: {
    email: number;
    sms: number;
    push: number;
    total: number;
  };
  
  revenue?: number;
  roi?: number;
  
  // A/B Testing
  variants?: {
    variantId: string;
    name: string;
    percentage: number;
    performance: CampaignAnalytics['performance'];
  }[];
}

class NotificationAnalyticsService {
  private readonly DELIVERIES_COLLECTION = 'notificationDeliveries';
  private readonly ANALYTICS_COLLECTION = 'notificationAnalytics';
  private readonly CAMPAIGNS_COLLECTION = 'notificationCampaigns';
  private readonly EVENTS_COLLECTION = 'notificationEvents';

  // Get comprehensive analytics for a date range
  async getAnalytics(
    startDate: Date,
    endDate: Date,
    filters?: {
      channels?: string[];
      types?: string[];
      priorities?: string[];
      templateIds?: string[];
    }
  ): Promise<NotificationAnalytics> {
    try {
      console.log(`📊 Generating analytics from ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      // Build query constraints
      const constraints = [
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate)),
        orderBy('createdAt', 'desc')
      ];
      
      // Apply filters
      if (filters?.channels && filters.channels.length > 0) {
        constraints.push(where('channel', 'in', filters.channels));
      }
      
      const q = query(collection(db, this.DELIVERIES_COLLECTION), ...constraints);
      const snapshot = await getDocs(q);
      
      const deliveries: NotificationDelivery[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        sentAt: doc.data().sentAt?.toDate(),
        deliveredAt: doc.data().deliveredAt?.toDate(),
      })) as NotificationDelivery[];
      
      console.log(`📈 Processing ${deliveries.length} delivery records`);
      
      // Calculate analytics
      const analytics = await this.calculateAnalytics(deliveries, startDate, endDate);
      
      // Cache results for performance
      await this.cacheAnalytics(analytics, startDate, endDate, filters);
      
      return analytics;
    } catch (error) {
      console.error('❌ Error generating analytics:', error);
      throw error;
    }
  }

  // Calculate analytics from delivery data
  private async calculateAnalytics(
    deliveries: NotificationDelivery[],
    startDate: Date,
    endDate: Date
  ): Promise<NotificationAnalytics> {
    const totalSent = deliveries.filter(d => d.status === 'sent' || d.status === 'delivered').length;
    const totalDelivered = deliveries.filter(d => d.status === 'delivered').length;
    const totalFailed = deliveries.filter(d => d.status === 'failed').length;
    
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const failureRate = totalSent > 0 ? (totalFailed / totalSent) * 100 : 0;
    
    // Channel statistics
    const channelStats = this.calculateChannelStats(deliveries);
    
    // Time-based metrics
    const hourlyDistribution = this.calculateHourlyDistribution(deliveries);
    const dailyTrends = this.calculateDailyTrends(deliveries, startDate, endDate);
    const weeklyTrends = this.calculateWeeklyTrends(deliveries);
    const monthlyTrends = this.calculateMonthlyTrends(deliveries);
    
    // Performance metrics
    const averageDeliveryTime = this.calculateAverageDeliveryTime(deliveries);
    const peakHours = this.calculatePeakHours(hourlyDistribution);
    const bestPerformingDays = this.calculateBestPerformingDays(dailyTrends);
    
    // Error analysis
    const topErrors = this.calculateTopErrors(deliveries);
    const errorTrends = this.calculateErrorTrends(deliveries, startDate, endDate);
    
    // Template performance
    const templatePerformance = await this.calculateTemplatePerformance(deliveries);
    
    return {
      totalSent,
      totalDelivered,
      totalFailed,
      deliveryRate,
      failureRate,
      channelStats,
      hourlyDistribution,
      dailyTrends,
      weeklyTrends,
      monthlyTrends,
      averageDeliveryTime,
      peakHours,
      bestPerformingDays,
      clickThroughRate: 0, // TODO: Implement click tracking
      openRate: 0, // TODO: Implement open tracking
      unsubscribeRate: 0, // TODO: Implement unsubscribe tracking
      topErrors,
      errorTrends,
      templatePerformance,
    };
  }

  // Calculate channel-specific statistics
  private calculateChannelStats(deliveries: NotificationDelivery[]): NotificationAnalytics['channelStats'] {
    const channels = ['email', 'sms', 'push', 'app'];
    const stats: any = {};
    
    channels.forEach(channel => {
      const channelDeliveries = deliveries.filter(d => d.channel === channel);
      const sent = channelDeliveries.filter(d => d.status === 'sent' || d.status === 'delivered').length;
      const delivered = channelDeliveries.filter(d => d.status === 'delivered').length;
      const failed = channelDeliveries.filter(d => d.status === 'failed').length;
      
      const deliveryRate = sent > 0 ? (delivered / sent) * 100 : 0;
      
      // Calculate average delivery time
      const deliveredItems = channelDeliveries.filter(d => d.sentAt && d.deliveredAt);
      const averageDeliveryTime = deliveredItems.length > 0 
        ? deliveredItems.reduce((sum, d) => {
            const deliveryTime = d.deliveredAt!.getTime() - d.sentAt!.getTime();
            return sum + deliveryTime;
          }, 0) / deliveredItems.length
        : 0;
      
      stats[channel] = {
        sent,
        delivered,
        failed,
        deliveryRate,
        averageDeliveryTime,
      };
    });
    
    return stats;
  }

  // Calculate hourly distribution
  private calculateHourlyDistribution(deliveries: NotificationDelivery[]): HourlyStats[] {
    const hourlyStats: Record<number, { sent: number; delivered: number; failed: number }> = {};
    
    // Initialize all hours
    for (let hour = 0; hour < 24; hour++) {
      hourlyStats[hour] = { sent: 0, delivered: 0, failed: 0 };
    }
    
    deliveries.forEach(delivery => {
      const hour = delivery.createdAt.getHours();
      
      if (delivery.status === 'sent' || delivery.status === 'delivered') {
        hourlyStats[hour].sent++;
      }
      if (delivery.status === 'delivered') {
        hourlyStats[hour].delivered++;
      }
      if (delivery.status === 'failed') {
        hourlyStats[hour].failed++;
      }
    });
    
    return Object.entries(hourlyStats).map(([hour, stats]) => ({
      hour: parseInt(hour),
      ...stats,
      deliveryRate: stats.sent > 0 ? (stats.delivered / stats.sent) * 100 : 0,
    }));
  }

  // Calculate daily trends
  private calculateDailyTrends(
    deliveries: NotificationDelivery[],
    startDate: Date,
    endDate: Date
  ): DailyStats[] {
    const dailyStats: Record<string, { sent: number; delivered: number; failed: number; recipients: Set<string> }> = {};
    
    // Initialize all days in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      dailyStats[dateKey] = { sent: 0, delivered: 0, failed: 0, recipients: new Set() };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    deliveries.forEach(delivery => {
      const dateKey = delivery.createdAt.toISOString().split('T')[0];
      
      if (dailyStats[dateKey]) {
        dailyStats[dateKey].recipients.add(delivery.recipientId);
        
        if (delivery.status === 'sent' || delivery.status === 'delivered') {
          dailyStats[dateKey].sent++;
        }
        if (delivery.status === 'delivered') {
          dailyStats[dateKey].delivered++;
        }
        if (delivery.status === 'failed') {
          dailyStats[dateKey].failed++;
        }
      }
    });
    
    return Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      sent: stats.sent,
      delivered: stats.delivered,
      failed: stats.failed,
      deliveryRate: stats.sent > 0 ? (stats.delivered / stats.sent) * 100 : 0,
      uniqueRecipients: stats.recipients.size,
    }));
  }

  // Calculate weekly trends
  private calculateWeeklyTrends(deliveries: NotificationDelivery[]): WeeklyStats[] {
    const weeklyStats: Record<string, { sent: number; delivered: number; failed: number }> = {};
    
    deliveries.forEach(delivery => {
      const weekStart = this.getWeekStart(delivery.createdAt);
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyStats[weekKey]) {
        weeklyStats[weekKey] = { sent: 0, delivered: 0, failed: 0 };
      }
      
      if (delivery.status === 'sent' || delivery.status === 'delivered') {
        weeklyStats[weekKey].sent++;
      }
      if (delivery.status === 'delivered') {
        weeklyStats[weekKey].delivered++;
      }
      if (delivery.status === 'failed') {
        weeklyStats[weekKey].failed++;
      }
    });
    
    const weeks = Object.entries(weeklyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, stats], index, array) => {
        const prevWeek = index > 0 ? array[index - 1][1] : null;
        const growth = prevWeek && prevWeek.sent > 0 
          ? ((stats.sent - prevWeek.sent) / prevWeek.sent) * 100 
          : 0;
        
        return {
          week,
          ...stats,
          deliveryRate: stats.sent > 0 ? (stats.delivered / stats.sent) * 100 : 0,
          growth,
        };
      });
    
    return weeks;
  }

  // Calculate monthly trends
  private calculateMonthlyTrends(deliveries: NotificationDelivery[]): MonthlyStats[] {
    const monthlyStats: Record<string, { sent: number; delivered: number; failed: number }> = {};
    
    deliveries.forEach(delivery => {
      const monthKey = `${delivery.createdAt.getFullYear()}-${String(delivery.createdAt.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { sent: 0, delivered: 0, failed: 0 };
      }
      
      if (delivery.status === 'sent' || delivery.status === 'delivered') {
        monthlyStats[monthKey].sent++;
      }
      if (delivery.status === 'delivered') {
        monthlyStats[monthKey].delivered++;
      }
      if (delivery.status === 'failed') {
        monthlyStats[monthKey].failed++;
      }
    });
    
    const months = Object.entries(monthlyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, stats], index, array) => {
        const prevMonth = index > 0 ? array[index - 1][1] : null;
        const growth = prevMonth && prevMonth.sent > 0 
          ? ((stats.sent - prevMonth.sent) / prevMonth.sent) * 100 
          : 0;
        
        return {
          month,
          ...stats,
          deliveryRate: stats.sent > 0 ? (stats.delivered / stats.sent) * 100 : 0,
          growth,
        };
      });
    
    return months;
  }

  // Calculate average delivery time
  private calculateAverageDeliveryTime(deliveries: NotificationDelivery[]): number {
    const deliveredItems = deliveries.filter(d => d.sentAt && d.deliveredAt);
    
    if (deliveredItems.length === 0) return 0;
    
    const totalTime = deliveredItems.reduce((sum, delivery) => {
      const deliveryTime = delivery.deliveredAt!.getTime() - delivery.sentAt!.getTime();
      return sum + deliveryTime;
    }, 0);
    
    return totalTime / deliveredItems.length;
  }

  // Calculate peak hours
  private calculatePeakHours(hourlyStats: HourlyStats[]): number[] {
    const sortedHours = [...hourlyStats].sort((a, b) => b.sent - a.sent);
    return sortedHours.slice(0, 3).map(h => h.hour);
  }

  // Calculate best performing days
  private calculateBestPerformingDays(dailyStats: DailyStats[]): string[] {
    const sortedDays = [...dailyStats]
      .filter(d => d.sent > 0)
      .sort((a, b) => b.deliveryRate - a.deliveryRate);
    
    return sortedDays.slice(0, 5).map(d => d.date);
  }

  // Calculate top errors
  private calculateTopErrors(deliveries: NotificationDelivery[]): ErrorStats[] {
    const failedDeliveries = deliveries.filter(d => d.status === 'failed' && d.failureReason);
    const errorCounts: Record<string, { count: number; channels: Set<string> }> = {};
    
    failedDeliveries.forEach(delivery => {
      const error = delivery.failureReason!;
      if (!errorCounts[error]) {
        errorCounts[error] = { count: 0, channels: new Set() };
      }
      errorCounts[error].count++;
      errorCounts[error].channels.add(delivery.channel);
    });
    
    const totalFailed = failedDeliveries.length;
    
    return Object.entries(errorCounts)
      .map(([error, data]) => ({
        error,
        count: data.count,
        percentage: totalFailed > 0 ? (data.count / totalFailed) * 100 : 0,
        channels: Array.from(data.channels),
        trend: 'stable' as const, // TODO: Calculate actual trend
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Calculate error trends
  private calculateErrorTrends(
    deliveries: NotificationDelivery[],
    startDate: Date,
    endDate: Date
  ): ErrorTrend[] {
    const dailyErrors: Record<string, { errors: number; total: number }> = {};
    
    // Initialize all days
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      dailyErrors[dateKey] = { errors: 0, total: 0 };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    deliveries.forEach(delivery => {
      const dateKey = delivery.createdAt.toISOString().split('T')[0];
      
      if (dailyErrors[dateKey]) {
        dailyErrors[dateKey].total++;
        if (delivery.status === 'failed') {
          dailyErrors[dateKey].errors++;
        }
      }
    });
    
    return Object.entries(dailyErrors).map(([date, stats]) => ({
      date,
      errorCount: stats.errors,
      totalAttempts: stats.total,
      errorRate: stats.total > 0 ? (stats.errors / stats.total) * 100 : 0,
    }));
  }

  // Calculate template performance
  private async calculateTemplatePerformance(deliveries: NotificationDelivery[]): Promise<TemplateStats[]> {
    const templateStats: Record<string, { sent: number; delivered: number; failed: number }> = {};
    
    deliveries.forEach(delivery => {
      const templateId = delivery.metadata?.templateId as string;
      if (templateId) {
        if (!templateStats[templateId]) {
          templateStats[templateId] = { sent: 0, delivered: 0, failed: 0 };
        }
        
        if (delivery.status === 'sent' || delivery.status === 'delivered') {
          templateStats[templateId].sent++;
        }
        if (delivery.status === 'delivered') {
          templateStats[templateId].delivered++;
        }
        if (delivery.status === 'failed') {
          templateStats[templateId].failed++;
        }
      }
    });
    
    return Object.entries(templateStats).map(([templateId, stats]) => ({
      templateId,
      templateName: `Template ${templateId}`, // TODO: Get actual template name
      sent: stats.sent,
      delivered: stats.delivered,
      deliveryRate: stats.sent > 0 ? (stats.delivered / stats.sent) * 100 : 0,
      engagement: {
        opens: 0, // TODO: Implement
        clicks: 0, // TODO: Implement
        conversions: 0, // TODO: Implement
      },
    }));
  }

  // Helper function to get week start date
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  // Cache analytics results
  private async cacheAnalytics(
    analytics: NotificationAnalytics,
    startDate: Date,
    endDate: Date,
    filters?: any
  ): Promise<void> {
    try {
      await addDoc(collection(db, this.ANALYTICS_COLLECTION), {
        analytics,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        filters: filters || {},
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // 24 hours
      });
    } catch (error) {
      console.error('❌ Error caching analytics:', error);
    }
  }

  // Get real-time metrics
  async getRealTimeMetrics(): Promise<{
    activeNotifications: number;
    pendingDeliveries: number;
    recentFailures: number;
    currentThroughput: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
  }> {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      // Get recent deliveries
      const recentQuery = query(
        collection(db, this.DELIVERIES_COLLECTION),
        where('createdAt', '>=', Timestamp.fromDate(oneHourAgo)),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(recentQuery);
      const recentDeliveries = snapshot.docs.map(doc => doc.data());
      
      const activeNotifications = recentDeliveries.filter(d => d.status === 'processing').length;
      const pendingDeliveries = recentDeliveries.filter(d => d.status === 'pending').length;
      const recentFailures = recentDeliveries.filter(d => d.status === 'failed').length;
      const currentThroughput = recentDeliveries.filter(d => d.status === 'delivered').length;
      
      // Determine system health
      let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      const failureRate = recentDeliveries.length > 0 ? (recentFailures / recentDeliveries.length) * 100 : 0;
      
      if (failureRate > 20 || pendingDeliveries > 100) {
        systemHealth = 'critical';
      } else if (failureRate > 10 || pendingDeliveries > 50) {
        systemHealth = 'warning';
      }
      
      return {
        activeNotifications,
        pendingDeliveries,
        recentFailures,
        currentThroughput,
        systemHealth,
      };
    } catch (error) {
      console.error('❌ Error getting real-time metrics:', error);
      return {
        activeNotifications: 0,
        pendingDeliveries: 0,
        recentFailures: 0,
        currentThroughput: 0,
        systemHealth: 'critical',
      };
    }
  }

  // Generate performance report
  async generatePerformanceReport(
    startDate: Date,
    endDate: Date,
    format: 'summary' | 'detailed' = 'summary'
  ): Promise<{
    summary: string;
    recommendations: string[];
    metrics: NotificationAnalytics;
    insights: string[];
  }> {
    try {
      const analytics = await this.getAnalytics(startDate, endDate);
      
      const summary = this.generateSummaryText(analytics);
      const recommendations = this.generateRecommendations(analytics);
      const insights = this.generateInsights(analytics);
      
      return {
        summary,
        recommendations,
        metrics: analytics,
        insights,
      };
    } catch (error) {
      console.error('❌ Error generating performance report:', error);
      throw error;
    }
  }

  // Generate summary text
  private generateSummaryText(analytics: NotificationAnalytics): string {
    const { totalSent, deliveryRate, channelStats } = analytics;
    
    const bestChannel = Object.entries(channelStats)
      .sort(([,a], [,b]) => b.deliveryRate - a.deliveryRate)[0];
    
    return `
Durante el período analizado se enviaron ${totalSent.toLocaleString()} notificaciones con una tasa de entrega del ${deliveryRate.toFixed(1)}%.
El canal con mejor rendimiento fue ${bestChannel[0]} con una tasa de entrega del ${bestChannel[1].deliveryRate.toFixed(1)}%.
El tiempo promedio de entrega fue de ${(analytics.averageDeliveryTime / 1000).toFixed(1)} segundos.
    `.trim();
  }

  // Generate recommendations
  private generateRecommendations(analytics: NotificationAnalytics): string[] {
    const recommendations: string[] = [];
    
    // Delivery rate recommendations
    if (analytics.deliveryRate < 90) {
      recommendations.push('Mejorar la tasa de entrega optimizando las listas de destinatarios y validando direcciones de email');
    }
    
    // Channel optimization
    const worstChannel = Object.entries(analytics.channelStats)
      .sort(([,a], [,b]) => a.deliveryRate - b.deliveryRate)[0];
    
    if (worstChannel[1].deliveryRate < 80) {
      recommendations.push(`Revisar la configuración del canal ${worstChannel[0]} que tiene una tasa de entrega del ${worstChannel[1].deliveryRate.toFixed(1)}%`);
    }
    
    // Timing optimization
    if (analytics.peakHours.length > 0) {
      recommendations.push(`Programar más notificaciones durante las horas pico: ${analytics.peakHours.join(', ')}:00`);
    }
    
    // Error handling
    if (analytics.topErrors.length > 0) {
      recommendations.push(`Abordar los errores más frecuentes: ${analytics.topErrors[0].error}`);
    }
    
    return recommendations;
  }

  // Generate insights
  private generateInsights(analytics: NotificationAnalytics): string[] {
    const insights: string[] = [];
    
    // Growth insights
    const recentWeeks = analytics.weeklyTrends.slice(-2);
    if (recentWeeks.length === 2) {
      const growth = recentWeeks[1].growth;
      if (growth > 10) {
        insights.push(`El volumen de notificaciones creció un ${growth.toFixed(1)}% esta semana`);
      } else if (growth < -10) {
        insights.push(`El volumen de notificaciones disminuyó un ${Math.abs(growth).toFixed(1)}% esta semana`);
      }
    }
    
    // Performance insights
    const avgDeliveryTime = analytics.averageDeliveryTime / 1000;
    if (avgDeliveryTime < 5) {
      insights.push('Excelente tiempo de entrega promedio');
    } else if (avgDeliveryTime > 30) {
      insights.push('El tiempo de entrega podría mejorarse');
    }
    
    // Channel insights
    const emailStats = analytics.channelStats.email;
    const smsStats = analytics.channelStats.sms;
    
    if (emailStats.deliveryRate > smsStats.deliveryRate + 10) {
      insights.push('El email tiene mejor rendimiento que SMS, considera priorizar este canal');
    }
    
    return insights;
  }
}

// Export singleton instance
export const notificationAnalyticsService = new NotificationAnalyticsService();