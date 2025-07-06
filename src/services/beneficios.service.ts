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
      console.log('🎁 Cargando beneficios para asociación:', asociacionId);
      
      // Simplificar la consulta para evitar problemas de índices
      const q = query(
        collection(db, this.COLLECTION),
        where('estado', '==', 'activo'),
        where('asociacionesDisponibles', 'array-contains', asociacionId),
        limit(50) // Limitar resultados para mejorar rendimiento
      );

      const snapshot = await getDocs(q);
      const beneficios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Beneficio));

      // Filtrar por fecha en el cliente para evitar problemas de índices complejos
      const now = new Date();
      const beneficiosValidos = beneficios.filter(beneficio => {
        if (!beneficio.fechaFin) return true;
        
        const fechaFin = beneficio.fechaFin instanceof Date 
          ? beneficio.fechaFin 
          : beneficio.fechaFin.toDate();
        
        return fechaFin > now;
      });

      console.log(`✅ Se encontraron ${beneficiosValidos.length} beneficios válidos`);
      return beneficiosValidos;
    } catch (error) {
      console.error('❌ Error fetching beneficios disponibles:', error);
      
      // Si hay error de índices, intentar consulta más simple
      if (error instanceof Error && error.message.includes('index')) {
        console.log('⚠️ Error de índices, intentando consulta simplificada...');
        try {
          const simpleQuery = query(
            collection(db, this.COLLECTION),
            where('estado', '==', 'activo'),
            limit(20)
          );
          
          const snapshot = await getDocs(simpleQuery);
          const allBeneficios = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Beneficio));

          // Filtrar manualmente por asociación
          const beneficiosFiltrados = allBeneficios.filter(beneficio => 
            beneficio.asociacionesDisponibles?.includes(asociacionId)
          );

          console.log(`✅ Consulta simplificada: ${beneficiosFiltrados.length} beneficios encontrados`);
          return beneficiosFiltrados;
        } catch (fallbackError) {
          console.error('❌ Error en consulta de respaldo:', fallbackError);
          return [];
        }
      }
      
      throw new Error('Error al cargar beneficios disponibles');
    }
  }

  static async getBeneficiosUsados(socioId: string): Promise<BeneficioUso[]> {
    try {
      console.log('📋 Cargando beneficios usados para:', socioId);
      
      const q = query(
        collection(db, this.USOS_COLLECTION),
        where('socioId', '==', socioId),
        orderBy('fechaUso', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      const usos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BeneficioUso));

      console.log(`✅ Se encontraron ${usos.length} usos de beneficios`);
      return usos;
    } catch (error) {
      console.error('❌ Error fetching beneficios usados:', error);
      
      // Si hay error de índices, devolver array vacío
      if (error instanceof Error && error.message.includes('index')) {
        console.log('⚠️ Error de índices en beneficios usados, devolviendo array vacío');
        return [];
      }
      
      throw new Error('Error al cargar historial de beneficios');
    }
  }

  static async getBeneficioById(beneficioId: string): Promise<Beneficio | null> {
    try {
      console.log('🔍 Buscando beneficio:', beneficioId);
      
      const docRef = doc(db, this.COLLECTION, beneficioId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const beneficio = {
          id: docSnap.id,
          ...docSnap.data()
        } as Beneficio;
        
        console.log('✅ Beneficio encontrado:', beneficio.titulo);
        return beneficio;
      }
      
      console.log('❌ Beneficio no encontrado');
      return null;
    } catch (error) {
      console.error('❌ Error fetching beneficio:', error);
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
      console.log('🎯 Usando beneficio:', { beneficioId, socioId, comercioId });
      
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

      console.log('✅ Beneficio usado exitosamente');
      return {
        id: docRef.id,
        ...usoData,
        creadoEn: Timestamp.now(),
        actualizadoEn: Timestamp.now()
      };
    } catch (error) {
      console.error('❌ Error usando beneficio:', error);
      throw error;
    }
  }

  static async getStats(socioId: string): Promise<BeneficioStats> {
    try {
      console.log('📊 Calculando estadísticas para:', socioId);
      
      // Obtener beneficios usados
      const usados = await this.getBeneficiosUsados(socioId);
      
      // Calcular estadísticas
      const ahorroTotal = usados.reduce((total, uso) => total + uso.montoDescuento, 0);
      
      const porCategoria: Record<string, number> = {};
      // Aquí se podría hacer una consulta más compleja para obtener categorías
      
      const stats = {
        total: 0, // Se calcularía con beneficios disponibles
        disponibles: 0,
        usados: usados.length,
        vencidos: 0,
        porCategoria,
        ahorroTotal,
      };

      console.log('✅ Estadísticas calculadas:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error getting beneficios stats:', error);
      
      // Devolver estadísticas por defecto en caso de error
      return {
        total: 0,
        disponibles: 0,
        usados: 0,
        vencidos: 0,
        porCategoria: {},
        ahorroTotal: 0,
      };
    }
  }

  private static async getUsosCount(beneficioId: string, socioId: string): Promise<number> {
    try {
      const q = query(
        collection(db, this.USOS_COLLECTION),
        where('beneficioId', '==', beneficioId),
        where('socioId', '==', socioId),
        where('estado', '==', 'usado')
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('❌ Error getting usos count:', error);
      return 0;
    }
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