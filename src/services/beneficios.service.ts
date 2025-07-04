import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Beneficio, BeneficioUso, BeneficioStats } from '@/types/beneficio';

export class BeneficiosService {
  private static readonly COLLECTION = 'beneficios';
  private static readonly USOS_COLLECTION = 'beneficio_usos';

  static async getBeneficiosDisponibles(socioId: string, asociacionId: string): Promise<Beneficio[]> {
    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, this.COLLECTION),
        where('estado', '==', 'activo'),
        where('asociacionesDisponibles', 'array-contains', asociacionId),
        where('fechaFin', '>', now),
        orderBy('fechaFin'),
        orderBy('creadoEn', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Beneficio));
    } catch (error) {
      console.error('Error fetching beneficios disponibles:', error);
      throw new Error('Error al cargar beneficios disponibles');
    }
  }

  static async getBeneficiosUsados(socioId: string): Promise<BeneficioUso[]> {
    try {
      const q = query(
        collection(db, this.USOS_COLLECTION),
        where('socioId', '==', socioId),
        orderBy('fechaUso', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BeneficioUso));
    } catch (error) {
      console.error('Error fetching beneficios usados:', error);
      throw new Error('Error al cargar historial de beneficios');
    }
  }

  static async getBeneficioById(beneficioId: string): Promise<Beneficio | null> {
    try {
      const docRef = doc(db, this.COLLECTION, beneficioId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Beneficio;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching beneficio:', error);
      throw new Error('Error al cargar beneficio');
    }
  }

  static async usarBeneficio(
    beneficioId: string, 
    socioId: string, 
    comercioId: string, 
    asociacionId: string
  ): Promise<BeneficioUso> {
    try {
      const beneficio = await this.getBeneficioById(beneficioId);
      if (!beneficio) {
        throw new Error('Beneficio no encontrado');
      }

      // Verificar límites
      const usosActuales = await this.getUsosCount(beneficioId, socioId);
      if (beneficio.limitePorSocio && usosActuales >= beneficio.limitePorSocio) {
        throw new Error('Has alcanzado el límite de usos para este beneficio');
      }

      // Crear registro de uso
      const usoData = {
        beneficioId,
        socioId,
        comercioId,
        asociacionId,
        fechaUso: Timestamp.now(),
        montoDescuento: this.calcularDescuento(beneficio, 0), // Monto base, se puede ajustar
        estado: 'usado' as const,
      };

      const docRef = await addDoc(collection(db, this.USOS_COLLECTION), usoData);

      // Actualizar contador de usos del beneficio
      await updateDoc(doc(db, this.COLLECTION, beneficioId), {
        usosActuales: beneficio.usosActuales + 1
      });

      return {
        id: docRef.id,
        ...usoData,
        creadoEn: Timestamp.now(),
        actualizadoEn: Timestamp.now()
      };
    } catch (error) {
      console.error('Error usando beneficio:', error);
      throw error;
    }
  }

  static async getStats(socioId: string): Promise<BeneficioStats> {
    try {
      // Obtener beneficios usados
      const usados = await this.getBeneficiosUsados(socioId);
      
      // Calcular estadísticas
      const ahorroTotal = usados.reduce((total, uso) => total + uso.montoDescuento, 0);
      
      const porCategoria: Record<string, number> = {};
      // Aquí se podría hacer una consulta más compleja para obtener categorías
      
      return {
        total: 0, // Se calcularía con beneficios disponibles
        disponibles: 0,
        usados: usados.length,
        vencidos: 0,
        porCategoria,
        ahorroTotal,
      };
    } catch (error) {
      console.error('Error getting beneficios stats:', error);
      throw new Error('Error al cargar estadísticas de beneficios');
    }
  }

  private static async getUsosCount(beneficioId: string, socioId: string): Promise<number> {
    const q = query(
      collection(db, this.USOS_COLLECTION),
      where('beneficioId', '==', beneficioId),
      where('socioId', '==', socioId),
      where('estado', '==', 'usado')
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  private static calcularDescuento(beneficio: Beneficio, montoBase: number): number {
    switch (beneficio.tipo) {
      case 'porcentaje':
        return montoBase * (beneficio.descuento / 100);
      case 'monto_fijo':
        return beneficio.descuento;
      case 'producto_gratis':
        return montoBase;
      default:
        return 0;
    }
  }
}
