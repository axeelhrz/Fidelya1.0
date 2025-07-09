import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import { handleError } from '@/lib/error-handler';

export interface ComercioDisponible {
  id: string;
  nombreComercio: string;
  nombre: string;
  email: string;
  categoria: string;
  direccion?: string;
  telefono?: string;
  logoUrl?: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  asociacionesVinculadas: string[];
  creadoEn: Timestamp;
  verificado: boolean;
  puntuacion: number;
  totalReviews: number;
}

export interface SolicitudAdhesion {
  id: string;
  comercioId: string;
  asociacionId: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaSolicitud: Timestamp;
  fechaRespuesta?: Timestamp;
  motivo?: string;
  comercioData: {
    nombreComercio: string;
    categoria: string;
    email: string;
    telefono?: string;
  };
}

export interface AdhesionStats {
  totalComercios: number;
  comerciosActivos: number;
  solicitudesPendientes: number;
  adhesionesEsteMes: number;
  categorias: Record<string, number>;
}

class AdhesionService {
  private readonly comerciosCollection = COLLECTIONS.COMERCIOS;
  private readonly asociacionesCollection = COLLECTIONS.ASOCIACIONES;
  private readonly solicitudesCollection = 'solicitudes_adhesion';

  /**
   * Obtener comercios disponibles para vinculación
   */
  async getComerciossDisponibles(
    asociacionId: string,
    filtros: {
      categoria?: string;
      busqueda?: string;
      soloNoVinculados?: boolean;
    } = {}
  ): Promise<ComercioDisponible[]> {
    try {
      let q = query(
        collection(db, this.comerciosCollection),
        where('estado', '==', 'activo'),
        orderBy('nombreComercio', 'asc')
      );

      if (filtros.categoria) {
        q = query(q, where('categoria', '==', filtros.categoria));
      }

      const snapshot = await getDocs(q);
      let comercios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComercioDisponible[];

      // Filtrar por búsqueda
      if (filtros.busqueda) {
        const searchTerm = filtros.busqueda.toLowerCase();
        comercios = comercios.filter(comercio =>
          comercio.nombreComercio.toLowerCase().includes(searchTerm) ||
          comercio.nombre.toLowerCase().includes(searchTerm) ||
          comercio.email.toLowerCase().includes(searchTerm)
        );
      }

      // Filtrar solo no vinculados
      if (filtros.soloNoVinculados) {
        comercios = comercios.filter(comercio =>
          !comercio.asociacionesVinculadas.includes(asociacionId)
        );
      }

      return comercios;
    } catch (error) {
      handleError(error, 'Get Comercios Disponibles');
      return [];
    }
  }

  /**
   * Obtener comercios vinculados a una asociación
   */
  async getComerciossVinculados(asociacionId: string): Promise<ComercioDisponible[]> {
    try {
      const q = query(
        collection(db, this.comerciosCollection),
        where('asociacionesVinculadas', 'array-contains', asociacionId),
        orderBy('nombreComercio', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComercioDisponible[];
    } catch (error) {
      handleError(error, 'Get Comercios Vinculados');
      return [];
    }
  }

  /**
   * Vincular comercio a asociación
   */
  async vincularComercio(comercioId: string, asociacionId: string): Promise<boolean> {
    try {
      const batch = writeBatch(db);

      // Actualizar comercio
      const comercioRef = doc(db, this.comerciosCollection, comercioId);
      const comercioDoc = await getDoc(comercioRef);

      if (!comercioDoc.exists()) {
        throw new Error('Comercio no encontrado');
      }

      const comercioData = comercioDoc.data();
      const asociacionesVinculadas = comercioData.asociacionesVinculadas || [];

      if (asociacionesVinculadas.includes(asociacionId)) {
        throw new Error('El comercio ya está vinculado a esta asociación');
      }

      asociacionesVinculadas.push(asociacionId);

      batch.update(comercioRef, {
        asociacionesVinculadas,
        actualizadoEn: serverTimestamp(),
      });

      // Actualizar estadísticas de la asociación
      const asociacionRef = doc(db, this.asociacionesCollection, asociacionId);
      const asociacionDoc = await getDoc(asociacionRef);

      if (asociacionDoc.exists()) {
        const asociacionData = asociacionDoc.data();
        const comerciosVinculados = (asociacionData.comerciosVinculados || 0) + 1;

        batch.update(asociacionRef, {
          comerciosVinculados,
          actualizadoEn: serverTimestamp(),
        });
      }

      await batch.commit();

      console.log('✅ Comercio vinculado exitosamente');
      return true;
    } catch (error) {
      handleError(error, 'Vincular Comercio');
      return false;
    }
  }

  /**
   * Desvincular comercio de asociación
   */
  async desvincularComercio(comercioId: string, asociacionId: string): Promise<boolean> {
    try {
      const batch = writeBatch(db);

      // Actualizar comercio
      const comercioRef = doc(db, this.comerciosCollection, comercioId);
      const comercioDoc = await getDoc(comercioRef);

      if (!comercioDoc.exists()) {
        throw new Error('Comercio no encontrado');
      }

      const comercioData = comercioDoc.data();
      const asociacionesVinculadas = comercioData.asociacionesVinculadas || [];

      const updatedAsociaciones = asociacionesVinculadas.filter(
        (id: string) => id !== asociacionId
      );

      batch.update(comercioRef, {
        asociacionesVinculadas: updatedAsociaciones,
        actualizadoEn: serverTimestamp(),
      });

      // Actualizar estadísticas de la asociación
      const asociacionRef = doc(db, this.asociacionesCollection, asociacionId);
      const asociacionDoc = await getDoc(asociacionRef);

      if (asociacionDoc.exists()) {
        const asociacionData = asociacionDoc.data();
        const comerciosVinculados = Math.max((asociacionData.comerciosVinculados || 1) - 1, 0);

        batch.update(asociacionRef, {
          comerciosVinculados,
          actualizadoEn: serverTimestamp(),
        });
      }

      await batch.commit();

      console.log('✅ Comercio desvinculado exitosamente');
      return true;
    } catch (error) {
      handleError(error, 'Desvincular Comercio');
      return false;
    }
  }

  /**
   * Obtener estadísticas de adhesiones
   */
  async getAdhesionStats(asociacionId: string): Promise<AdhesionStats> {
    try {
      const comerciosVinculados = await this.getComerciossVinculados(asociacionId);
      
      const stats: AdhesionStats = {
        totalComercios: comerciosVinculados.length,
        comerciosActivos: comerciosVinculados.filter(c => c.estado === 'activo').length,
        solicitudesPendientes: 0,
        adhesionesEsteMes: 0,
        categorias: {}
      };

      // Contar por categorías
      comerciosVinculados.forEach(comercio => {
        stats.categorias[comercio.categoria] = (stats.categorias[comercio.categoria] || 0) + 1;
      });

      // Calcular adhesiones este mes
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      stats.adhesionesEsteMes = comerciosVinculados.filter(comercio => {
        const fechaCreacion = comercio.creadoEn.toDate();
        return fechaCreacion >= inicioMes;
      }).length;

      return stats;
    } catch (error) {
      handleError(error, 'Get Adhesion Stats');
      return {
        totalComercios: 0,
        comerciosActivos: 0,
        solicitudesPendientes: 0,
        adhesionesEsteMes: 0,
        categorias: {}
      };
    }
  }

  /**
   * Buscar comercios por término
   */
  async buscarComercios(
    termino: string,
    asociacionId: string,
    limite: number = 20
  ): Promise<ComercioDisponible[]> {
    try {
      const q = query(
        collection(db, this.comerciosCollection),
        where('estado', '==', 'activo'),
        limit(limite)
      );

      const snapshot = await getDocs(q);
      let comercios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComercioDisponible[];

      // Filtrar por término de búsqueda
      const searchTerm = termino.toLowerCase();
      comercios = comercios.filter(comercio =>
        comercio.nombreComercio.toLowerCase().includes(searchTerm) ||
        comercio.nombre.toLowerCase().includes(searchTerm) ||
        comercio.email.toLowerCase().includes(searchTerm) ||
        comercio.categoria.toLowerCase().includes(searchTerm)
      );

      return comercios;
    } catch (error) {
      handleError(error, 'Buscar Comercios');
      return [];
    }
  }

  /**
   * Validar si un comercio puede ser vinculado
   */
  async validarVinculacion(comercioId: string, asociacionId: string): Promise<{
    valido: boolean;
    motivo?: string;
  }> {
    try {
      const comercioDoc = await getDoc(doc(db, this.comerciosCollection, comercioId));
      
      if (!comercioDoc.exists()) {
        return { valido: false, motivo: 'Comercio no encontrado' };
      }

      const comercioData = comercioDoc.data();

      if (comercioData.estado !== 'activo') {
        return { valido: false, motivo: 'El comercio no está activo' };
      }

      if (comercioData.asociacionesVinculadas?.includes(asociacionId)) {
        return { valido: false, motivo: 'El comercio ya está vinculado a esta asociación' };
      }

      return { valido: true };
    } catch (error) {
      handleError(error, 'Validar Vinculacion');
      return { valido: false, motivo: 'Error al validar la vinculación' };
    }
  }
}

// Export singleton instance
export const adhesionService = new AdhesionService();
export default adhesionService;
