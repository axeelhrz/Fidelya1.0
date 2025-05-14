import { collection, query, where, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Policy } from '@/types/policy';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';

// Configurar dayjs con plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.locale('es');
dayjs.tz.setDefault('Europe/Madrid');

// Interfaz para los datos del gráfico de evolución de pólizas
export interface PolicyChartData {
  name: string;
  nuevas: number;
  renovadas: number;
  canceladas: number;
}

/**
 * Genera datos de tendencias mensuales para pólizas (nuevas, renovadas, canceladas)
 * @param userId ID del usuario autenticado
 * @returns Promise<boolean> - true si la generación fue exitosa, false en caso contrario
 */
export const generatePolicyTrends = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Generando tendencias de pólizas para el usuario: ${userId}`);
    
    // Obtener todas las pólizas del usuario
    const policiesRef = collection(db, 'policies');
    const policiesQuery = query(policiesRef, where('userId', '==', userId));
    const policiesSnapshot = await getDocs(policiesQuery);
    
    const policies: Policy[] = [];
    policiesSnapshot.forEach(doc => {
      policies.push({ id: doc.id, ...doc.data() } as Policy);
    });
    
    // Obtener fecha actual y calcular el rango de 12 meses hacia atrás
    const now = dayjs();
    const monthsData: Record<string, PolicyChartData> = {};
    
    // Inicializar los datos para los últimos 12 meses
    for (let i = 0; i < 12; i++) {
      const date = now.subtract(i, 'month');
      const monthKey = date.format('YYYY-MM');
      const monthName = date.format('MMM').charAt(0).toUpperCase() + date.format('MMM').slice(1, 3);
      
      monthsData[monthKey] = {
        name: monthName,
        nuevas: 0,
        renovadas: 0,
        canceladas: 0
      };
    }
    
    // Procesar cada póliza y clasificarla según su estado y fecha
    policies.forEach(policy => {
      if (!policy.createdAt) return;
      
      const createdAt = policy.createdAt.toDate();
      const monthKey = dayjs(createdAt).format('YYYY-MM');
      
      // Solo procesar pólizas de los últimos 12 meses
      if (monthsData[monthKey]) {
        // Pólizas nuevas (todas las creadas en ese mes)
        monthsData[monthKey].nuevas += 1;
        
        // Pólizas renovadas
        if (policy.isRenewal === true) {
          monthsData[monthKey].renovadas += 1;
        }
        
        // Pólizas canceladas
        if (policy.status === 'cancelled') {
          monthsData[monthKey].canceladas += 1;
        }
      }
    });
    
    // Convertir el objeto a un array ordenado por fecha
    const monthByMonth = Object.entries(monthsData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, data]) => data);
    
    // Guardar los datos en Firestore
    const trendsDocRef = doc(db, `users/${userId}/dashboard/trends`);
    await setDoc(trendsDocRef, { 
      monthByMonth,
      lastUpdated: Timestamp.now()
    });
    
    console.log(`Tendencias de pólizas guardadas para el usuario ${userId}`);
    return true;
  } catch (error) {
    console.error('Error al generar tendencias de pólizas:', error);
    return false;
  }
};