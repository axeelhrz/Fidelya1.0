import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import { handleError } from '@/lib/error-handler';
import { Socio } from '@/types/socio';

class SocioAsociacionService {
  private readonly sociosCollection = COLLECTIONS.SOCIOS;
  private readonly asociacionesCollection = COLLECTIONS.ASOCIACIONES;

  /**
   * Vincula un socio a una asociación (actualiza ambas partes)
   */
  async vincularSocioAsociacion(socioId: string, asociacionId: string): Promise<boolean> {
    try {
      console.log(`🔄 Vinculando socio ${socioId} con asociación ${asociacionId}`);
      
      // Verificar que el socio existe
      const socioRef = doc(db, this.sociosCollection, socioId);
      const socioDoc = await getDoc(socioRef);
      
      if (!socioDoc.exists()) {
        throw new Error('El socio no existe');
      }
      
      // Verificar que la asociación existe
      const asociacionRef = doc(db, this.asociacionesCollection, asociacionId);
      const asociacionDoc = await getDoc(asociacionRef);
      
      if (!asociacionDoc.exists()) {
        throw new Error('La asociación no existe');
      }
      
      // Obtener datos actuales
      const socioData = socioDoc.data();
      const asociacionData = asociacionDoc.data();
      
      // Verificar si ya está vinculado
      if (socioData.asociacionId === asociacionId) {
        console.log('⚠️ El socio ya está vinculado a esta asociación');
        return true; // Ya está vinculado, consideramos éxito
      }
      
      // Usar batch para actualizar ambos documentos de forma atómica
      const batch = writeBatch(db);
      
      // 1. Actualizar socio con la asociación
      batch.update(socioRef, {
        asociacionId: asociacionId,
        asociacion: asociacionData.nombre || 'Asociación',
        actualizadoEn: serverTimestamp(),
      });
      
      // 2. Actualizar asociación con el socio (si mantiene lista de socios)
      // Si la asociación tiene un campo 'socios' que es un array de IDs
      if (Array.isArray(asociacionData.socios)) {
        if (!asociacionData.socios.includes(socioId)) {
          batch.update(asociacionRef, {
            socios: [...asociacionData.socios, socioId],
            actualizadoEn: serverTimestamp(),
          });
        }
      } else {
        // Si no existe el campo socios, lo creamos
        batch.update(asociacionRef, {
          socios: [socioId],
          actualizadoEn: serverTimestamp(),
        });
      }
      
      // Ejecutar las actualizaciones
      await batch.commit();
      
      console.log('✅ Socio vinculado exitosamente a la asociación');
      return true;
    } catch (error) {
      handleError(error, 'Vincular Socio Asociación');
      return false;
    }
  }

  /**
   * Desvincular un socio de una asociación
   */
  async desvincularSocioAsociacion(socioId: string, asociacionId: string): Promise<boolean> {
    try {
      console.log(`🔄 Desvinculando socio ${socioId} de asociación ${asociacionId}`);
      
      // Verificar que el socio existe
      const socioRef = doc(db, this.sociosCollection, socioId);
      const socioDoc = await getDoc(socioRef);
      
      if (!socioDoc.exists()) {
        throw new Error('El socio no existe');
      }
      
      // Verificar que la asociación existe
      const asociacionRef = doc(db, this.asociacionesCollection, asociacionId);
      const asociacionDoc = await getDoc(asociacionRef);
      
      if (!asociacionDoc.exists()) {
        throw new Error('La asociación no existe');
      }
      
      // Obtener datos actuales
      const socioData = socioDoc.data();
      const asociacionData = asociacionDoc.data();
      
      // Verificar si está vinculado a esta asociación
      if (socioData.asociacionId !== asociacionId) {
        console.log('⚠️ El socio no está vinculado a esta asociación');
        return true; // Ya no está vinculado, consideramos éxito
      }
      
      // Usar batch para actualizar ambos documentos de forma atómica
      const batch = writeBatch(db);
      
      // 1. Actualizar socio para quitar la asociación
      batch.update(socioRef, {
        asociacionId: null, // Eliminar la asociación
        asociacion: null,
        actualizadoEn: serverTimestamp(),
      });
      
      // 2. Actualizar asociación para quitar el socio
      if (Array.isArray(asociacionData.socios) && asociacionData.socios.includes(socioId)) {
        batch.update(asociacionRef, {
          socios: asociacionData.socios.filter(id => id !== socioId),
          actualizadoEn: serverTimestamp(),
        });
      }
      
      // Ejecutar las actualizaciones
      await batch.commit();
      
      console.log('✅ Socio desvinculado exitosamente de la asociación');
      return true;
    } catch (error) {
      handleError(error, 'Desvincular Socio Asociación');
      return false;
    }
  }

  /**
   * Obtener socios de una asociación
   */
  async getSociosByAsociacion(
    asociacionId: string,
  ): Promise<Socio[]> {
    try {
      const q = query(
        collection(db, this.sociosCollection),
        where('asociacionId', '==', asociacionId),
        where('estado', '==', 'activo')
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: doc.id,
          ...data,
          fechaNacimiento: data.fechaNacimiento?.toDate() ? Timestamp.fromDate(data.fechaNacimiento.toDate()) : undefined,
          fechaIngreso: data.fechaIngreso?.toDate() ? Timestamp.fromDate(data.fechaIngreso.toDate()) : Timestamp.now(),
          fechaVencimiento: data.fechaVencimiento?.toDate() ? Timestamp.fromDate(data.fechaVencimiento.toDate()) : undefined,
          ultimoPago: data.ultimoPago?.toDate() ? Timestamp.fromDate(data.ultimoPago.toDate()) : undefined,
          ultimoAcceso: data.ultimoAcceso?.toDate() ? Timestamp.fromDate(data.ultimoAcceso.toDate()) : undefined,
          creadoEn: data.creadoEn?.toDate() ? Timestamp.fromDate(data.creadoEn.toDate()) : Timestamp.now(),
          actualizadoEn: data.actualizadoEn?.toDate() ? Timestamp.fromDate(data.actualizadoEn.toDate()) : Timestamp.now(),
          asociacion: data.asociacion || 'Asociación',
        } as Socio;
      });
    } catch (error) {
      handleError(error, 'Get Socios By Asociacion');
      return [];
    }
  }

  /**
   * Obtener asociaciones de un socio
   */
  async getAsociacionesBySocio(socioId: string): Promise<string[]> {
    try {
      const socioRef = doc(db, this.sociosCollection, socioId);
      const socioDoc = await getDoc(socioRef);
      
      if (!socioDoc.exists()) {
        return [];
      }
      
      const socioData = socioDoc.data();
      
      // Si el socio tiene una asociación asignada, la devolvemos
      if (socioData.asociacionId) {
        return [socioData.asociacionId];
      }
      
      return [];
    } catch (error) {
      handleError(error, 'Get Asociaciones By Socio');
      return [];
    }
  }

  /**
   * Verificar si un socio está vinculado a una asociación
   */
  async isSocioVinculado(socioId: string, asociacionId: string): Promise<boolean> {
    try {
      const socioRef = doc(db, this.sociosCollection, socioId);
      const socioDoc = await getDoc(socioRef);
      
      if (!socioDoc.exists()) {
        return false;
      }
      
      const socioData = socioDoc.data();
      
      return socioData.asociacionId === asociacionId;
    } catch (error) {
      handleError(error, 'Is Socio Vinculado');
      return false;
    }
  }
}

// Exportar instancia singleton
export const socioAsociacionService = new SocioAsociacionService();
export default socioAsociacionService;