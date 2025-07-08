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
  Timestamp,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Beneficio, BeneficioUso, BeneficioStats } from '@/types/beneficio';

export class BeneficiosService {
  private static readonly COLLECTION = 'beneficios';
  private static readonly USOS_COLLECTION = 'beneficio_usos';
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  
  // Cache simple para evitar consultas repetidas
  private static cache = new Map<string, { data: unknown; timestamp: number }>();

  private static getCacheKey(socioId: string, asociacionId: string): string {
    return `beneficios_${socioId}_${asociacionId}`;
  }

  private static isValidCache(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.timestamp) < this.CACHE_DURATION;
  }

  private static setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private static getCache(key: string): unknown {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  static async getBeneficiosDisponibles(
    socioId: string, 
    asociacionId: string,
    useCache: boolean = true
  ): Promise<Beneficio[]> {
    try {
      console.log('🎁 Cargando beneficios para asociación:', asociacionId);
      
      // Verificar cache si está habilitado
      const cacheKey = this.getCacheKey(socioId, asociacionId);
      if (useCache && this.isValidCache(cacheKey)) {
        console.log('📦 Usando beneficios desde cache');
        return this.getCache(cacheKey) as Beneficio[];
      }

      // Consulta optimizada con límite
      const q = query(
        collection(db, this.COLLECTION),
        where('estado', '==', 'activo'),
        where('asociacionesDisponibles', 'array-contains', asociacionId),
        orderBy('creadoEn', 'desc'),
        limit(100) // Aumentar límite pero mantener control
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

      // Guardar en cache
      if (useCache) {
        this.setCache(cacheKey, beneficiosValidos);
      }

      console.log(`✅ Se encontraron ${beneficiosValidos.length} beneficios válidos`);
      return beneficiosValidos;
    } catch (error) {
      console.error('❌ Error fetching beneficios disponibles:', error);
      
      // Si hay error de índices, intentar consulta más simple
      if (error instanceof Error && error.message.includes('index')) {
        console.log('⚠️ Error de índices, intentando consulta simplificada...');
        return await this.getBeneficiosDisponiblesFallback(socioId, asociacionId);
      }
      
      throw new Error('Error al cargar beneficios disponibles');
    }
  }

  private static async getBeneficiosDisponiblesFallback(
    socioId: string, 
    asociacionId: string
  ): Promise<Beneficio[]> {
    try {
      const simpleQuery = query(
        collection(db, this.COLLECTION),
        where('estado', '==', 'activo'),
        limit(50)
      );
      
      const snapshot = await getDocs(simpleQuery);
      const allBeneficios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Beneficio));

      // Filtrar manualmente por asociación y fecha
      const now = new Date();
      const beneficiosFiltrados = allBeneficios.filter(beneficio => {
        const tieneAsociacion = beneficio.asociacionesDisponibles?.includes(asociacionId);
        
        let fechaValida = true;
        if (beneficio.fechaFin) {
          const fechaFin = beneficio.fechaFin instanceof Date 
            ? beneficio.fechaFin 
            : beneficio.fechaFin.toDate();
          fechaValida = fechaFin > now;
        }
        
        return tieneAsociacion && fechaValida;
      });

      console.log(`✅ Consulta simplificada: ${beneficiosFiltrados.length} beneficios encontrados`);
      return beneficiosFiltrados;
    } catch (fallbackError) {
      console.error('❌ Error en consulta de respaldo:', fallbackError);
      return [];
    }
  }

  static async getBeneficiosUsados(
    socioId: string,
    useCache: boolean = true
  ): Promise<BeneficioUso[]> {
    try {
      console.log('📋 Cargando beneficios usados para:', socioId);
      
      // Verificar cache
      const cacheKey = `usos_${socioId}`;
      if (useCache && this.isValidCache(cacheKey)) {
        console.log('📦 Usando beneficios usados desde cache');
        return this.getCache(cacheKey) as BeneficioUso[];
      }
      
      const q = query(
        collection(db, this.USOS_COLLECTION),
        where('socioId', '==', socioId),
        orderBy('fechaUso', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);
      const usos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BeneficioUso));

      // Guardar en cache
      if (useCache) {
        this.setCache(cacheKey, usos);
      }

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

      // Verificar que el beneficio esté activo
      if (beneficio.estado !== 'activo') {
        throw new Error('El beneficio no está disponible');
      }

      // Verificar fecha de validez
      if (beneficio.fechaFin) {
        const fechaFin = beneficio.fechaFin instanceof Date 
          ? beneficio.fechaFin 
          : beneficio.fechaFin.toDate();
        
        if (fechaFin <= new Date()) {
          throw new Error('El beneficio ha expirado');
        }
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
        creadoEn: Timestamp.now(),
        actualizadoEn: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.USOS_COLLECTION), usoData);

      // Actualizar contador de usos del beneficio
      await updateDoc(doc(db, this.COLLECTION, beneficioId), {
        usosActuales: beneficio.usosActuales + 1,
        actualizadoEn: Timestamp.now()
      });

      // Limpiar cache relacionado
      this.clearRelatedCache(socioId, asociacionId);

      console.log('✅ Beneficio usado exitosamente');
      return {
        id: docRef.id,
        ...usoData
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
      const ahorroTotal = usados.reduce((total, uso) => total + (uso.montoDescuento || 0), 0);
      
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

  // Método para limpiar cache relacionado
  private static clearRelatedCache(socioId: string, asociacionId: string): void {
    const keys = [
      this.getCacheKey(socioId, asociacionId),
      `usos_${socioId}`
    ];
    
    keys.forEach(key => {
      this.cache.delete(key);
    });
    
    console.log('🧹 Cache limpiado para:', socioId);
  }

  // Método para limpiar todo el cache
  static clearAllCache(): void {
    this.cache.clear();
    console.log('🧹 Todo el cache ha sido limpiado');
  }

  // Método para obtener beneficios con paginación
  static async getBeneficiosPaginated(
    asociacionId: string,
    pageSize: number = 20,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ beneficios: Beneficio[]; lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
    try {
      let q = query(
        collection(db, this.COLLECTION),
        where('estado', '==', 'activo'),
        where('asociacionesDisponibles', 'array-contains', asociacionId),
        orderBy('creadoEn', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const beneficios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Beneficio));

      const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

      return {
        beneficios,
        lastDoc: newLastDoc
      };
    } catch (error) {
      console.error('❌ Error fetching paginated beneficios:', error);
      return { beneficios: [] };
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

