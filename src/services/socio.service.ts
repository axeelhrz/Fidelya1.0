import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import { handleError } from '@/lib/error-handler';
import { SocioStats, SocioActivity } from '@/types/socio';

export interface Socio {
  id: string;
  nombre: string;
  email: string;
  dni: string;
  telefono?: string;
  fechaNacimiento: Date;
  direccion?: string;
  asociacionId: string;
  numeroSocio?: string;
  estado: 'activo' | 'inactivo' | 'pendiente' | 'suspendido' | 'vencido';
  estadoMembresia: 'al_dia' | 'vencido' | 'pendiente';
  fechaIngreso: Date;
  fechaVencimiento?: Date;
  ultimoPago?: Date;
  montoCuota: number;
  beneficiosUsados: number;
  validacionesRealizadas: number;
  creadoEn: Date;
  actualizadoEn: Date;
  metadata?: Record<string, unknown>;
  avatar?: string;
  configuracion?: Record<string, unknown>;
  ultimoAcceso?: Date;
  uid: string;
}

export interface SocioFormData {
  nombre: string;
  email: string;
  dni: string;
  telefono?: string;
  fechaNacimiento: Date | Timestamp;
  direccion?: string;
  numeroSocio?: string;
  montoCuota: number;
  fechaVencimiento?: Date | Timestamp;
  estado: 'activo' | 'inactivo' | 'pendiente' | 'suspendido' | 'vencido';
}

export interface SocioFilters {
  estado?: string;
  estadoMembresia?: string;
  search?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: Array<{ row: number; error: string; data: Record<string, unknown> }>;
  duplicates: number;
}

class SocioService {
  private readonly collection = COLLECTIONS.SOCIOS;

  /**
   * Get socio by ID
   */
  async getSocioById(id: string): Promise<Socio | null> {
    try {
      const socioDoc = await getDoc(doc(db, this.collection, id));
      
      if (!socioDoc.exists()) {
        return null;
      }

      const data = socioDoc.data();
      return {
        id: socioDoc.id,
        uid: socioDoc.id,
        ...data,
        fechaNacimiento: data.fechaNacimiento?.toDate() || new Date(),
        fechaIngreso: data.fechaIngreso?.toDate() || new Date(),
        fechaVencimiento: data.fechaVencimiento?.toDate(),
        ultimoPago: data.ultimoPago?.toDate(),
        ultimoAcceso: data.ultimoAcceso?.toDate(),
        creadoEn: data.creadoEn?.toDate() || new Date(),
        actualizadoEn: data.actualizadoEn?.toDate() || new Date(),
      } as Socio;
    } catch (error) {
      handleError(error, 'Get Socio By ID');
      return null;
    }
  }

  /**
   * Get socios by association with filters and pagination
   */
  async getSociosByAsociacion(
    asociacionId: string,
    filters: SocioFilters = {},
    pageSize = 20,
    lastDoc?: import('firebase/firestore').QueryDocumentSnapshot<import('firebase/firestore').DocumentData> | null
  ): Promise<{ socios: Socio[]; hasMore: boolean; lastDoc: import('firebase/firestore').QueryDocumentSnapshot<import('firebase/firestore').DocumentData> | null }> {
    try {
      let q = query(
        collection(db, this.collection),
        where('asociacionId', '==', asociacionId),
        orderBy('creadoEn', 'desc')
      );

      // Apply filters
      if (filters.estado) {
        q = query(q, where('estado', '==', filters.estado));
      }

      if (filters.estadoMembresia) {
        q = query(q, where('estadoMembresia', '==', filters.estadoMembresia));
      }

      // Add pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(pageSize + 1)); // Get one extra to check if there are more

      const snapshot = await getDocs(q);
      const docs = snapshot.docs;
      const hasMore = docs.length > pageSize;

      if (hasMore) {
        docs.pop(); // Remove the extra document
      }

      let socios = docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: doc.id,
          ...data,
          fechaNacimiento: data.fechaNacimiento?.toDate() || new Date(),
          fechaIngreso: data.fechaIngreso?.toDate() || new Date(),
          fechaVencimiento: data.fechaVencimiento?.toDate(),
          ultimoPago: data.ultimoPago?.toDate(),
          ultimoAcceso: data.ultimoAcceso?.toDate(),
          creadoEn: data.creadoEn?.toDate() || new Date(),
          actualizadoEn: data.actualizadoEn?.toDate() || new Date(),
        } as Socio;
      });

      // Apply client-side filters for complex queries
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        socios = socios.filter(socio =>
          socio.nombre.toLowerCase().includes(searchTerm) ||
          socio.email.toLowerCase().includes(searchTerm) ||
          socio.dni.includes(searchTerm) ||
          socio.numeroSocio?.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.fechaDesde || filters.fechaHasta) {
        socios = socios.filter(socio => {
          const fechaIngreso = socio.fechaIngreso;
          if (filters.fechaDesde && fechaIngreso < filters.fechaDesde) return false;
          if (filters.fechaHasta && fechaIngreso > filters.fechaHasta) return false;
          return true;
        });
      }

      return {
        socios,
        hasMore,
        lastDoc: docs.length > 0 ? docs[docs.length - 1] : null
      };
    } catch (error) {
      handleError(error, 'Get Socios By Asociacion');
      return { socios: [], hasMore: false, lastDoc: null };
    }
  }

  /**
   * Create new socio
   */
  async createSocio(asociacionId: string, data: SocioFormData): Promise<string | null> {
    try {
      // Check if DNI already exists
      const existingDni = await this.checkDniExists(data.dni);
      if (existingDni) {
        throw new Error('Ya existe un socio con este DNI');
      }

      // Check if email already exists
      const existingEmail = await this.checkEmailExists(data.email);
      if (existingEmail) {
        throw new Error('Ya existe un socio con este email');
      }

      // Generate numero de socio if not provided
      let numeroSocio = data.numeroSocio;
      if (!numeroSocio) {
        numeroSocio = await this.generateNumeroSocio(asociacionId);
      } else {
        // Check if numero socio already exists
        const existingNumero = await this.checkNumeroSocioExists(asociacionId, numeroSocio);
        if (existingNumero) {
          throw new Error('Ya existe un socio con este número');
        }
      }

      const socioId = doc(collection(db, this.collection)).id;
      
      // Clean data to remove undefined values
      const socioData: Record<string, unknown> = {
        nombre: data.nombre,
        email: data.email.toLowerCase(),
        dni: data.dni,
        asociacionId,
        numeroSocio,
        estado: data.estado || 'activo',
        estadoMembresia: data.fechaVencimiento && data.fechaVencimiento > new Date() ? 'al_dia' : 'pendiente',
        fechaIngreso: serverTimestamp(),
        montoCuota: data.montoCuota || 0,
        beneficiosUsados: 0,
        validacionesRealizadas: 0,
        creadoEn: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
      };

      // Only add optional fields if they have values
      if (data.telefono) {
        socioData.telefono = data.telefono;
      }

      if (data.direccion) {
        socioData.direccion = data.direccion;
      }

      // Handle fechaNacimiento
      if (data.fechaNacimiento) {
        socioData.fechaNacimiento = Timestamp.fromDate(
          data.fechaNacimiento instanceof Date
            ? data.fechaNacimiento
            : data.fechaNacimiento.toDate()
        );
      }

      // Handle fechaVencimiento
      if (data.fechaVencimiento) {
        socioData.fechaVencimiento = Timestamp.fromDate(
          data.fechaVencimiento instanceof Date
            ? data.fechaVencimiento
            : data.fechaVencimiento.toDate()
        );
      }

      await setDoc(doc(db, this.collection, socioId), socioData);

      console.log('✅ Socio created successfully:', socioId);
      return socioId;
    } catch (error) {
      handleError(error, 'Create Socio');
      return null;
    }
  }

  /**
   * Update socio
   */
  async updateSocio(id: string, data: Partial<SocioFormData>): Promise<boolean> {
    try {
      const updateData: Record<string, unknown> = {
        actualizadoEn: serverTimestamp(),
      };

      // Only add fields that have values
      if (data.nombre) updateData.nombre = data.nombre;
      if (data.dni) updateData.dni = data.dni;
      if (data.telefono) updateData.telefono = data.telefono;
      if (data.direccion) updateData.direccion = data.direccion;
      if (data.numeroSocio) updateData.numeroSocio = data.numeroSocio;
      if (data.montoCuota !== undefined) updateData.montoCuota = data.montoCuota;
      if (data.estado) updateData.estado = data.estado;

      // Convert dates to Timestamps
      if (data.fechaNacimiento) {
        updateData.fechaNacimiento = Timestamp.fromDate(
          data.fechaNacimiento instanceof Date
            ? data.fechaNacimiento
            : data.fechaNacimiento.toDate()
        );
      }

      if (data.fechaVencimiento) {
        updateData.fechaVencimiento = Timestamp.fromDate(
          data.fechaVencimiento instanceof Date
            ? data.fechaVencimiento
            : data.fechaVencimiento.toDate()
        );
        // Update membership status based on expiration date
        updateData.estadoMembresia = (data.fechaVencimiento instanceof Date
          ? data.fechaVencimiento
          : data.fechaVencimiento.toDate()) > new Date() ? 'al_dia' : 'vencido';
      }

      if (data.email) {
        updateData.email = data.email.toLowerCase();
      }

      await updateDoc(
        doc(db, this.collection, id),
        updateData as Partial<SocioFormData> & { actualizadoEn: import('firebase/firestore').FieldValue; estadoMembresia?: string }
      );

      console.log('✅ Socio updated successfully:', id);
      return true;
    } catch (error) {
      handleError(error, 'Update Socio');
      return false;
    }
  }

  /**
   * Delete socio (soft delete)
   */
  async deleteSocio(id: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        estado: 'inactivo',
        actualizadoEn: serverTimestamp(),
      });

      console.log('✅ Socio deleted successfully:', id);
      return true;
    } catch (error) {
      handleError(error, 'Delete Socio');
      return false;
    }
  }

  /**
   * Get socio statistics
   */
  async getSocioStats(socioId: string): Promise<SocioStats | null> {
    try {
      // This would typically aggregate data from validaciones and other collections
      // For now, return mock data structure
      const socio = await this.getSocioById(socioId);
      if (!socio) return null;

      const stats: SocioStats = {
        total: 1,
        activos: socio.estado === 'activo' ? 1 : 0,
        vencidos: socio.estadoMembresia === 'vencido' ? 1 : 0,
        inactivos: socio.estado === 'inactivo' ? 1 : 0,
        beneficiosUsados: socio.beneficiosUsados || 0,
        ahorroTotal: 0, // Would be calculated from validaciones
        comerciosVisitados: 0, // Would be calculated from validaciones
        racha: 0, // Would be calculated based on activity
        tiempoComoSocio: Math.floor((new Date().getTime() - socio.fechaIngreso.getTime()) / (1000 * 60 * 60 * 24)),
      };

      return stats;
    } catch (error) {
      handleError(error, 'Get Socio Stats');
      return null;
    }
  }

  /**
   * Get socio activity
   */
  async getSocioActivity(): Promise<SocioActivity[]> {
    try {
      // This would typically query from an activities collection using socioId and options
      // For now, return empty array as placeholder
      return [];
    } catch (error) {
      handleError(error, 'Get Socio Activity');
      return [];
    }
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(socioId: string, file: File): Promise<string | null> {
    try {
      // This would typically upload to Firebase Storage
      // For now, return placeholder URL
      console.log('Upload profile image for socio:', socioId, file.name);
      return 'https://placeholder-image-url.com';
    } catch (error) {
      handleError(error, 'Upload Profile Image');
      return null;
    }
  }

  /**
   * Export socio data
   */
  async exportSocioData(socioId: string): Promise<{
    perfil: Socio | null;
    estadisticas: SocioStats | null;
    actividad: SocioActivity[];
    fechaExportacion: string;
  } | null> {
    try {
      const socio = await this.getSocioById(socioId);
      const stats = await this.getSocioStats(socioId);
      const activity = await this.getSocioActivity();

      return {
        perfil: socio,
        estadisticas: stats,
        actividad: activity,
        fechaExportacion: new Date().toISOString(),
      };
    } catch (error) {
      handleError(error, 'Export Socio Data');
      return null;
    }
  }

  /**
   * Bulk import socios from CSV data
   */
  async importSocios(asociacionId: string, csvData: Record<string, unknown>[]): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      imported: 0,
      errors: [],
      duplicates: 0,
    };

    try {
      const batch = writeBatch(db);
      let batchCount = 0;
      const maxBatchSize = 500;

      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        const rowNumber = i + 1;

        try {
          // Validate required fields
          if (!row.nombre || !row.email || !row.dni) {
            result.errors.push({
              row: rowNumber,
              error: 'Campos requeridos faltantes (nombre, email, dni)',
              data: row
            });
            continue;
          }

          // Check for duplicates
          const existingDni = await this.checkDniExists(String(row.dni));
          const existingEmail = await this.checkEmailExists(String(row.email));
          
          if (existingDni || existingEmail) {
            result.duplicates++;
            continue;
          }

          // Generate numero de socio
          const numeroSocio = row.numeroSocio || await this.generateNumeroSocio(asociacionId);

          // Prepare socio data - clean to avoid undefined values
          const socioId = doc(collection(db, this.collection)).id;
          const socioData: Record<string, unknown> = {
            nombre: row.nombre,
            email: typeof row.email === 'string' ? row.email.toLowerCase() : '',
            dni: row.dni,
            asociacionId,
            numeroSocio,
            estado: 'activo',
            estadoMembresia: 'pendiente',
            fechaIngreso: serverTimestamp(),
            montoCuota: parseFloat(String(row.montoCuota)) || 0,
            beneficiosUsados: 0,
            validacionesRealizadas: 0,
            creadoEn: serverTimestamp(),
            actualizadoEn: serverTimestamp(),
          };

          // Only add optional fields if they have values
          if (row.telefono) {
            socioData.telefono = row.telefono;
          }

          if (row.direccion) {
            socioData.direccion = row.direccion;
          }

          if (row.fechaNacimiento) {
            socioData.fechaNacimiento = Timestamp.fromDate(
              typeof row.fechaNacimiento === 'string' || typeof row.fechaNacimiento === 'number'
                ? new Date(row.fechaNacimiento)
                : row.fechaNacimiento instanceof Date
                  ? row.fechaNacimiento
                  : new Date()
            );
          }

          batch.set(doc(db, this.collection, socioId), socioData);
          batchCount++;
          result.imported++;

          // Commit batch if it reaches max size
          if (batchCount >= maxBatchSize) {
            await batch.commit();
            batchCount = 0;
          }

        } catch (error) {
          result.errors.push({
            row: rowNumber,
            error: error instanceof Error ? error.message : 'Error desconocido',
            data: row
          });
        }
      }

      // Commit remaining batch
      if (batchCount > 0) {
        await batch.commit();
      }

      result.success = true;
      console.log('✅ Socios imported successfully:', result.imported);
      
    } catch (error) {
      handleError(error, 'Import Socios');
      result.errors.push({
        row: 0,
        error: 'Error general en la importación',
        data: {}
      });
    }

    return result;
  }

  /**
   * Get association statistics
   */
  async getAsociacionStats(asociacionId: string): Promise<SocioStats> {
    try {
      const q = query(
        collection(db, this.collection),
        where('asociacionId', '==', asociacionId)
      );

      const snapshot = await getDocs(q);
      const socios = snapshot.docs.map(doc => doc.data());

      const stats: SocioStats = {
        total: socios.length,
        activos: socios.filter(s => s.estado === 'activo').length,
        inactivos: socios.filter(s => s.estado === 'inactivo').length,
        alDia: socios.filter(s => s.estadoMembresia === 'al_dia').length,
        vencidos: socios.filter(s => s.estadoMembresia === 'vencido').length,
        pendientes: socios.filter(s => s.estadoMembresia === 'pendiente').length,
        ingresosMensuales: socios.reduce((total, s) => total + (s.montoCuota || 0), 0),
        beneficiosUsados: socios.reduce((total, s) => total + (s.beneficiosUsados || 0), 0),
      };

      return stats;
    } catch (error) {
      handleError(error, 'Get Asociacion Stats');
      return {
        total: 0,
        activos: 0,
        inactivos: 0,
        alDia: 0,
        vencidos: 0,
        pendientes: 0,
        ingresosMensuales: 0,
        beneficiosUsados: 0,
      };
    }
  }

  /**
   * Update membership status for expired members
   */
  async updateMembershipStatus(asociacionId: string): Promise<number> {
    try {
      const q = query(
        collection(db, this.collection),
        where('asociacionId', '==', asociacionId),
        where('estado', '==', 'activo')
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      let updatedCount = 0;

      const now = new Date();

      snapshot.docs.forEach(docSnapshot => {
        const data = docSnapshot.data();
        const fechaVencimiento = data.fechaVencimiento?.toDate();

        if (fechaVencimiento && fechaVencimiento < now && data.estadoMembresia !== 'vencido') {
          batch.update(docSnapshot.ref, {
            estadoMembresia: 'vencido',
            actualizadoEn: serverTimestamp(),
          });
          updatedCount++;
        }
      });

      if (updatedCount > 0) {
        await batch.commit();
        console.log('✅ Updated membership status for', updatedCount, 'socios');
      }

      return updatedCount;
    } catch (error) {
      handleError(error, 'Update Membership Status');
      return 0;
    }
  }

  /**
   * Register payment for socio
   */
  async registerPayment(socioId: string, amount: number, months: number = 1): Promise<boolean> {
    try {
      const socioRef = doc(db, this.collection, socioId);
      const socioDoc = await getDoc(socioRef);

      if (!socioDoc.exists()) {
        throw new Error('Socio no encontrado');
      }

      const socioData = socioDoc.data();
      const now = new Date();
      
      // Calculate new expiration date
      let fechaVencimiento = socioData.fechaVencimiento?.toDate() || now;
      if (fechaVencimiento < now) {
        fechaVencimiento = now;
      }
      
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + months);

      await updateDoc(socioRef, {
        ultimoPago: serverTimestamp(),
        fechaVencimiento: Timestamp.fromDate(fechaVencimiento),
        estadoMembresia: 'al_dia',
        actualizadoEn: serverTimestamp(),
      });

      console.log('✅ Payment registered successfully for socio:', socioId);
      return true;
    } catch (error) {
      handleError(error, 'Register Payment');
      return false;
    }
  }

  /**
   * Helper methods
   */
  private async checkDniExists(dni: string): Promise<boolean> {
    try {
      const q = query(collection(db, this.collection), where('dni', '==', dni));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch {
      return false;
    }
  }

  private async checkEmailExists(email: string): Promise<boolean> {
    try {
      const q = query(collection(db, this.collection), where('email', '==', email.toLowerCase()));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch {
      return false;
    }
  }

  private async checkNumeroSocioExists(asociacionId: string, numeroSocio: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.collection),
        where('asociacionId', '==', asociacionId),
        where('numeroSocio', '==', numeroSocio)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch {
      return false;
    }
  }

  private async generateNumeroSocio(asociacionId: string): Promise<string> {
    try {
      const q = query(
        collection(db, this.collection),
        where('asociacionId', '==', asociacionId),
        orderBy('numeroSocio', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return '001';
      }

      const lastSocio = snapshot.docs[0].data();
      const lastNumber = parseInt(lastSocio.numeroSocio || '0');
      const newNumber = lastNumber + 1;
      
      return newNumber.toString().padStart(3, '0');
    } catch {
      // Fallback to timestamp-based number
      return Date.now().toString().slice(-6);
    }
  }
}

// Export singleton instance
export const socioService = new SocioService();
export default socioService;
