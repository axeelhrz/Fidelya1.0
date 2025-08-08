import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ABTest {
  id?: string;
  name: string;
  description: string;
  asociacionId: string;
  status: 'draft' | 'running' | 'completed' | 'paused' | 'cancelled';
  variants: ABTestVariant[];
  trafficSplit: number[]; // Porcentaje para cada variante
  targetSegmentId?: string;
  targetCriteria?: Record<string, unknown>;
  metrics: ABTestMetrics;
  startDate: Timestamp;
  endDate?: Timestamp;
  duration?: number; // en días
  minSampleSize: number;
  confidenceLevel: number; // 90, 95, 99
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ABTestVariant {
  id: string;
  name: string;
  templateId: string;
  subject?: string;
  content: string;
  variables?: Record<string, unknown>;
  isControl: boolean;
  color: string;
}

export interface ABTestMetrics {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  variants: Record<string, VariantMetrics>;
}

export interface VariantMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  confidence: number;
  isWinner?: boolean;
}

export interface ABTestResult {
  testId: string;
  winnerVariantId?: string;
  confidence: number;
  improvement: number;
  isSignificant: boolean;
  recommendation: string;
  metrics: ABTestMetrics;
}

class NotificationABTestingService {
  private readonly COLLECTION = 'ab_tests';
  private readonly RESULTS_COLLECTION = 'ab_test_results';

  // Crear nuevo test A/B
  async createABTest(testData: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): Promise<string> {
    try {
      // Validar que la suma de traffic split sea 100
      const totalSplit = testData.trafficSplit.reduce((sum, split) => sum + split, 0);
      if (Math.abs(totalSplit - 100) > 0.01) {
        throw new Error('La suma de traffic split debe ser 100%');
      }

      // Validar que haya al menos 2 variantes
      if (testData.variants.length < 2) {
        throw new Error('Se requieren al menos 2 variantes para el test A/B');
      }

      // Inicializar métricas vacías
      const initialMetrics: ABTestMetrics = {
        totalSent: 0,
        totalDelivered: 0,
        totalOpened: 0,
        totalClicked: 0,
        totalConverted: 0,
        variants: {}
      };

      testData.variants.forEach(variant => {
        initialMetrics.variants[variant.id] = {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          deliveryRate: 0,
          openRate: 0,
          clickRate: 0,
          conversionRate: 0,
          confidence: 0
        };
      });

      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...testData,
        metrics: initialMetrics,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating A/B test:', error);
      throw error;
    }
  }

  // Obtener tests A/B
  async getABTests(asociacionId: string, status?: ABTest['status']): Promise<ABTest[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION),
        where('asociacionId', '==', asociacionId),
        orderBy('createdAt', 'desc')
      );

      if (status) {
        q = query(q, where('status', '==', status));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ABTest));
    } catch (error) {
      console.error('Error getting A/B tests:', error);
      throw error;
    }
  }

  // Iniciar test A/B
  async startABTest(testId: string): Promise<void> {
    try {
      const testRef = doc(db, this.COLLECTION, testId);
      await updateDoc(testRef, {
        status: 'running',
        startDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error starting A/B test:', error);
      throw error;
    }
  }

  // Pausar test A/B
  async pauseABTest(testId: string): Promise<void> {
    try {
      const testRef = doc(db, this.COLLECTION, testId);
      await updateDoc(testRef, {
        status: 'paused',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error pausing A/B test:', error);
      throw error;
    }
  }

  // Completar test A/B
  async completeABTest(testId: string): Promise<ABTestResult> {
    try {
      const testRef = doc(db, this.COLLECTION, testId);
      
      // Obtener datos del test
      const testDoc = await getDocs(query(
        collection(db, this.COLLECTION),
        where('__name__', '==', testId)
      ));

      if (testDoc.empty) {
        throw new Error('Test A/B no encontrado');
      }

      const testData = testDoc.docs[0].data() as ABTest;
      
      // Calcular resultados
      const result = await this.calculateABTestResults(testData);
      
      // Actualizar estado del test
      await updateDoc(testRef, {
        status: 'completed',
        endDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Guardar resultados
      await addDoc(collection(db, this.RESULTS_COLLECTION), {
        ...result,
        createdAt: serverTimestamp()
      });

      return result;
    } catch (error) {
      console.error('Error completing A/B test:', error);
      throw error;
    }
  }

  // Registrar evento de notificación para A/B test
  async recordABTestEvent(
    testId: string,
    variantId: string,
    eventType: 'sent' | 'delivered' | 'opened' | 'clicked' | 'converted',
  ): Promise<void> {
    try {
      const testRef = doc(db, this.COLLECTION, testId);
      
      // Obtener datos actuales del test
      const testDoc = await getDocs(query(
        collection(db, this.COLLECTION),
        where('__name__', '==', testId)
      ));

      if (testDoc.empty) {
        throw new Error('Test A/B no encontrado');
      }

      const testData = testDoc.docs[0].data() as ABTest;
      
      // Actualizar métricas
      const updatedMetrics = { ...testData.metrics };
      const totalKeyMap: Record<typeof eventType, keyof ABTestMetrics> = {
        sent: 'totalSent',
        delivered: 'totalDelivered',
        opened: 'totalOpened',
        clicked: 'totalClicked',
        converted: 'totalConverted'
      };
      updatedMetrics[totalKeyMap[eventType]]++;
      updatedMetrics.variants[variantId][eventType]++;

      // Recalcular tasas
      const variantMetrics = updatedMetrics.variants[variantId];
      if (variantMetrics.sent > 0) {
        variantMetrics.deliveryRate = (variantMetrics.delivered / variantMetrics.sent) * 100;
        variantMetrics.openRate = (variantMetrics.opened / variantMetrics.delivered) * 100;
        variantMetrics.clickRate = (variantMetrics.clicked / variantMetrics.opened) * 100;
        variantMetrics.conversionRate = (variantMetrics.converted / variantMetrics.sent) * 100;
      }

      await updateDoc(testRef, {
        metrics: updatedMetrics,
        updatedAt: serverTimestamp()
      });

      // Verificar si el test debe completarse automáticamente
      await this.checkAutoCompletion(testId, testData);
    } catch (error) {
      console.error('Error recording A/B test event:', error);
      throw error;
    }
  }

  // Asignar variante a usuario
  async assignVariant(testId: string, userId: string): Promise<string> {
    try {
      // Obtener datos del test
      const testDoc = await getDocs(query(
        collection(db, this.COLLECTION),
        where('__name__', '==', testId)
      ));

      if (testDoc.empty) {
        throw new Error('Test A/B no encontrado');
      }

      const testData = testDoc.docs[0].data() as ABTest;

      if (testData.status !== 'running') {
        throw new Error('El test A/B no está activo');
      }

      // Generar hash consistente basado en userId y testId
      const hash = this.generateHash(userId + testId);
      const hashValue = parseInt(hash.substring(0, 8), 16) % 100;

      // Asignar variante basada en traffic split
      let cumulativePercentage = 0;
      for (let i = 0; i < testData.variants.length; i++) {
        cumulativePercentage += testData.trafficSplit[i];
        if (hashValue < cumulativePercentage) {
          return testData.variants[i].id;
        }
      }

      // Fallback a la primera variante
      return testData.variants[0].id;
    } catch (error) {
      console.error('Error assigning variant:', error);
      throw error;
    }
  }

  // Calcular resultados del test A/B
  private async calculateABTestResults(testData: ABTest): Promise<ABTestResult> {
    const metrics = testData.metrics;
    const variants = Object.entries(metrics.variants);
    
    if (variants.length < 2) {
      throw new Error('Se requieren al menos 2 variantes para calcular resultados');
    }

    // Encontrar variante de control
    const controlVariant = testData.variants.find(v => v.isControl);
    if (!controlVariant) {
      throw new Error('No se encontró variante de control');
    }

    const controlMetrics = metrics.variants[controlVariant.id];
    let winnerVariantId: string | undefined;
    let maxImprovement = 0;
    let maxConfidence = 0;

    // Comparar cada variante con el control
    for (const variant of testData.variants) {
      if (variant.isControl) continue;

      const variantMetrics = metrics.variants[variant.id];
      
      // Calcular significancia estadística usando test z
      const confidence = this.calculateStatisticalSignificance(
        controlMetrics,
        variantMetrics
      );

      const improvement = ((variantMetrics.conversionRate - controlMetrics.conversionRate) / controlMetrics.conversionRate) * 100;

      variantMetrics.confidence = confidence;

      if (confidence > maxConfidence && improvement > maxImprovement) {
        maxConfidence = confidence;
        maxImprovement = improvement;
        winnerVariantId = variant.id;
      }
    }

    // Marcar ganador
    if (winnerVariantId) {
      metrics.variants[winnerVariantId].isWinner = true;
    }

    const isSignificant = maxConfidence >= testData.confidenceLevel;
    
    let recommendation = '';
    if (isSignificant && winnerVariantId) {
      const winnerVariant = testData.variants.find(v => v.id === winnerVariantId);
      recommendation = `Se recomienda usar la variante "${winnerVariant?.name}" que mostró una mejora del ${maxImprovement.toFixed(1)}% con ${maxConfidence.toFixed(1)}% de confianza.`;
    } else {
      recommendation = 'No se encontraron diferencias estadísticamente significativas. Se recomienda continuar con la variante de control o ejecutar el test por más tiempo.';
    }

    return {
      testId: testData.id!,
      winnerVariantId,
      confidence: maxConfidence,
      improvement: maxImprovement,
      isSignificant,
      recommendation,
      metrics
    };
  }

  // Calcular significancia estadística
  private calculateStatisticalSignificance(
    controlMetrics: VariantMetrics,
    variantMetrics: VariantMetrics,
  ): number {
    const n1 = controlMetrics.sent;
    const n2 = variantMetrics.sent;
    const x1 = controlMetrics.converted;
    const x2 = variantMetrics.converted;

    if (n1 === 0 || n2 === 0) return 0;

    const p1 = x1 / n1;
    const p2 = x2 / n2;
    const p = (x1 + x2) / (n1 + n2);

    const se = Math.sqrt(p * (1 - p) * (1/n1 + 1/n2));
    
    if (se === 0) return 0;

    const z = Math.abs(p2 - p1) / se;
    
    // Convertir z-score a nivel de confianza
    const confidence = (1 - 2 * (1 - this.normalCDF(z))) * 100;
    
    return Math.min(confidence, 99.9);
  }

  // Función de distribución acumulativa normal
  private normalCDF(x: number): number {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  // Función de error
  private erf(x: number): number {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  // Generar hash consistente
  private generateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Verificar auto-completado
  private async checkAutoCompletion(testId: string, testData: ABTest): Promise<void> {
    // Verificar si se alcanzó el tamaño mínimo de muestra
    if (testData.metrics.totalSent < testData.minSampleSize) {
      return;
    }

    // Verificar si se alcanzó la duración máxima
    if (testData.duration) {
      const startDate = testData.startDate.toDate();
      const now = new Date();
      const daysPassed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysPassed >= testData.duration) {
        await this.completeABTest(testId);
      }
    }
  }

  // Obtener plantillas para A/B testing
  getABTestTemplates(): Partial<ABTest>[] {
    return [
      {
        name: 'Test de Asunto',
        description: 'Comparar diferentes líneas de asunto para mejorar la tasa de apertura',
        trafficSplit: [50, 50],
        minSampleSize: 1000,
        confidenceLevel: 95,
        duration: 7
      },
      {
        name: 'Test de Contenido',
        description: 'Comparar diferentes versiones del contenido para mejorar engagement',
        trafficSplit: [50, 50],
        minSampleSize: 500,
        confidenceLevel: 95,
        duration: 14
      },
      {
        name: 'Test de CTA',
        description: 'Comparar diferentes llamadas a la acción para mejorar conversiones',
        trafficSplit: [50, 50],
        minSampleSize: 2000,
        confidenceLevel: 99,
        duration: 10
      },
      {
        name: 'Test Multivariant',
        description: 'Comparar múltiples elementos simultáneamente',
        trafficSplit: [25, 25, 25, 25],
        minSampleSize: 2000,
        confidenceLevel: 95,
        duration: 21
      }
    ];
  }

  // Exportar resultados de A/B test
  async exportABTestResults(testId: string, format: 'csv' | 'json' = 'csv'): Promise<string> {
    try {
      const testDoc = await getDocs(query(
        collection(db, this.COLLECTION),
        where('__name__', '==', testId)
      ));

      if (testDoc.empty) {
        throw new Error('Test A/B no encontrado');
      }

      const testData = testDoc.docs[0].data() as ABTest;
      
      if (format === 'json') {
        return JSON.stringify(testData, null, 2);
      } else {
        // Formato CSV
        const headers = ['Variante', 'Enviadas', 'Entregadas', 'Abiertas', 'Clicks', 'Conversiones', 'Tasa Entrega %', 'Tasa Apertura %', 'Tasa Click %', 'Tasa Conversión %', 'Confianza %'];
        const csvRows = [
          headers.join(','),
          ...testData.variants.map(variant => {
            const metrics = testData.metrics.variants[variant.id];
            return [
              `"${variant.name}"`,
              metrics.sent,
              metrics.delivered,
              metrics.opened,
              metrics.clicked,
              metrics.converted,
              metrics.deliveryRate.toFixed(2),
              metrics.openRate.toFixed(2),
              metrics.clickRate.toFixed(2),
              metrics.conversionRate.toFixed(2),
              metrics.confidence.toFixed(2)
            ].join(',');
          })
        ];
        return csvRows.join('\n');
      }
    } catch (error) {
      console.error('Error exporting A/B test results:', error);
      throw error;
    }
  }
}

export const notificationABTestingService = new NotificationABTestingService();