import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import { handleFirebaseError } from '@/lib/firebase-errors';
import { Socio } from '@/types/socio';

export interface SocioProfileData {
  nombre: string;
  telefono?: string;
  dni?: string;
  direccion?: string;
  fechaNacimiento?: Date;
  configuracion?: {
    notificaciones: boolean;
    tema: 'light' | 'dark' | 'auto';
    privacidad: {
      perfilPublico: boolean;
      mostrarEstadisticas: boolean;
    };
  };
}

export interface SocioStats {
  beneficiosUsados: number;
  ahorroTotal: number;
  beneficiosEsteMes: number;
  asociacionesActivas: number;
  ultimaActividad?: Date;
  beneficioMasUsado?: {
    nombre: string;
    usos: number;
  };
}

class SocioService {
  /**
   * Obtiene los datos del perfil de un socio
   */
  async getSocioProfile(socioId: string): Promise<Socio | null> {
    try {
      const socioRef = doc(db, COLLECTIONS.SOCIOS, socioId);
      const socioSnap = await getDoc(socioRef);
      
      if (socioSnap.exists()) {
        const data = socioSnap.data();
        return {
          uid: socioSnap.id,
          ...data,
          creadoEn: data.creadoEn || Timestamp.now(),
        } as Socio;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting socio profile:', error);
      throw new Error(handleFirebaseError(error as Error));
    }
  }

  /**
   * Actualiza el perfil de un socio
   */
  async updateSocioProfile(
    socioId: string, 
    profileData: Partial<SocioProfileData>
  ): Promise<void> {
    try {
      const socioRef = doc(db, COLLECTIONS.SOCIOS, socioId);
      
      await updateDoc(socioRef, {
        ...profileData,
        actualizadoEn: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating socio profile:', error);
      throw new Error(handleFirebaseError(error as Error));
    }
  }

  /**
   * Obtiene las estadísticas de un socio
   */
  async getSocioStats(socioId: string): Promise<SocioStats> {
    try {
      // Obtener beneficios usados
      const beneficiosUsadosRef = collection(db, 'beneficioUsos');
      const beneficiosQuery = query(
        beneficiosUsadosRef,
        where('socioId', '==', socioId),
        orderBy('fechaUso', 'desc')
      );
      
      const beneficiosSnapshot = await getDocs(beneficiosQuery);
      const beneficiosUsados = beneficiosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calcular estadísticas
      const totalBeneficios = beneficiosUsados.length;
      const ahorroTotal = beneficiosUsados.reduce((total, beneficio) => 
        total + (beneficio.montoDescuento || 0), 0
      );

      // Beneficios de este mes
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);
      
      const beneficiosEsteMes = beneficiosUsados.filter(beneficio => {
        const fechaUso = beneficio.fechaUso?.toDate();
        return fechaUso && fechaUso >= inicioMes;
      }).length;

      // Obtener asociaciones del socio
      const socio = await this.getSocioProfile(socioId);
      const asociacionesActivas = socio?.asociacionId ? 1 : 0;

      // Última actividad
      const ultimaActividad = beneficiosUsados.length > 0 
        ? beneficiosUsados[0].fechaUso?.toDate() 
        : undefined;

      // Beneficio más usado (simulado por ahora)
      const beneficioMasUsado = beneficiosUsados.length > 0 
        ? {
            nombre: 'Descuento en Restaurante',
            usos: Math.floor(totalBeneficios * 0.3)
          }
        : undefined;

      return {
        beneficiosUsados: totalBeneficios,
        ahorroTotal,
        beneficiosEsteMes,
        asociacionesActivas,
        ultimaActividad,
        beneficioMasUsado
      };
    } catch (error) {
      console.error('Error getting socio stats:', error);
      // Retornar estadísticas por defecto en caso de error
      return {
        beneficiosUsados: 0,
        ahorroTotal: 0,
        beneficiosEsteMes: 0,
        asociacionesActivas: 0
      };
    }
  }

  /**
   * Obtiene las asociaciones de un socio
   */
  async getSocioAsociaciones(socioId: string) {
    try {
      const socio = await this.getSocioProfile(socioId);
      if (!socio?.asociacionId) {
        return [];
      }

      const asociacionRef = doc(db, COLLECTIONS.ASOCIACIONES, socio.asociacionId);
      const asociacionSnap = await getDoc(asociacionRef);
      
      if (asociacionSnap.exists()) {
        const asociacionData = asociacionSnap.data();
        return [{
          id: asociacionSnap.id,
          nombre: asociacionData.nombre || 'Asociación',
          estado: socio.estado,
          fechaVencimiento: asociacionData.fechaVencimiento?.toDate(),
          logo: asociacionData.logo
        }];
      }

      return [];
    } catch (error) {
      console.error('Error getting socio asociaciones:', error);
      return [];
    }
  }

  /**
   * Valida los datos del perfil antes de actualizar
   */
  validateProfileData(data: Partial<SocioProfileData>): string[] {
    const errors: string[] = [];

    if (data.nombre && data.nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (data.telefono && data.telefono.length < 8) {
      errors.push('El teléfono debe tener al menos 8 dígitos');
    }

    if (data.dni && data.dni.length < 7) {
      errors.push('El DNI debe tener al menos 7 caracteres');
    }

    return errors;
  }
}

// Export singleton instance
export const socioService = new SocioService();
export default socioService;
