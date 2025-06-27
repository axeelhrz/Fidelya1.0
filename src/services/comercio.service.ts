import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  increment,
  writeBatch,
  orderBy,
  limit
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage, COLLECTIONS, STORAGE_PATHS, handleFirebaseError } from '@/lib/firebase';
import { Comercio, ComercioFormData, ComercioStats } from '@/types/comercio';

export interface ComercioFilters {
  categoria?: string;
  estado?: string;
  asociacionId?: string;
  visible?: boolean;
}

export interface ComercioResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class ComercioService {
  /**
   * Get comercio by ID
   */
  async getComercio(uid: string): Promise<Comercio | null> {
    try {
      const comercioDoc = await getDoc(doc(db, COLLECTIONS.COMERCIOS, uid));
      
      if (!comercioDoc.exists()) {
        return null;
      }

      const data = comercioDoc.data();
      return {
        uid: comercioDoc.id,
        ...data,
        creadoEn: data.creadoEn?.toDate() || new Date(),
        actualizadoEn: data.actualizadoEn?.toDate() || new Date()
      } as Comercio;
    } catch (error) {
      console.error('Error getting comercio:', error);
      throw new Error(handleFirebaseError(error));
    }
  }

  /**
   * Update comercio profile
   */
  async updateProfile(uid: string, data: ComercioFormData): Promise<ComercioResponse> {
    try {
      const comercioRef = doc(db, COLLECTIONS.COMERCIOS, uid);
      
      // Validate data
      const validationErrors = this.validateComercioData(data);
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: validationErrors.join(', ')
        };
      }

      await updateDoc(comercioRef, {
        ...data,
        actualizadoEn: serverTimestamp()
      });

      return {
        success: true,
        data: { message: 'Perfil actualizado correctamente' }
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirebaseError(error)
      };
    }
  }

  /**
   * Upload image (logo or main image)
   */
  async uploadImage(
    uid: string, 
    file: File, 
    type: 'logo' | 'imagen'
  ): Promise<ComercioResponse> {
    try {
      // Validate file
      const validation = this.validateImageFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      const fileExtension = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExtension}`;
      const storageRef = ref(
        storage, 
        `${STORAGE_PATHS.COMERCIOS}/${uid}/${fileName}`
      );

      // Get current comercio data to delete old image
      const comercio = await this.getComercio(uid);
      const oldImageUrl = type === 'logo' ? comercio?.logoUrl : comercio?.imagenPrincipalUrl;

      // Upload new image
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update comercio document
      const updateData = type === 'logo' 
        ? { logoUrl: downloadURL }
        : { imagenPrincipalUrl: downloadURL };

      await updateDoc(doc(db, COLLECTIONS.COMERCIOS, uid), {
        ...updateData,
        actualizadoEn: serverTimestamp()
      });

      // Delete old image if exists
      if (oldImageUrl && oldImageUrl !== downloadURL) {
        try {
          const oldImageRef = ref(storage, oldImageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.log('Old image not found or already deleted');
        }
      }

      return {
        success: true,
        data: { url: downloadURL }
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirebaseError(error)
      };
    }
  }

  /**
   * Get comercios with filters
   */
  async getComercios(filters: ComercioFilters = {}): Promise<Comercio[]> {
    try {
      let comerciosQuery = collection(db, COLLECTIONS.COMERCIOS);
      const constraints = [];

      if (filters.categoria) {
        constraints.push(where('categoria', '==', filters.categoria));
      }
      if (filters.estado) {
        constraints.push(where('estado', '==', filters.estado));
      }
      if (filters.visible !== undefined) {
        constraints.push(where('visible', '==', filters.visible));
      }
      if (filters.asociacionId) {
        constraints.push(where('asociacionesVinculadas', 'array-contains', filters.asociacionId));
      }

      if (constraints.length > 0) {
        comerciosQuery = query(comerciosQuery, ...constraints);
      }

      const snapshot = await getDocs(comerciosQuery);
      const comercios: Comercio[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        comercios.push({
          uid: doc.id,
          ...data,
          creadoEn: data.creadoEn?.toDate() || new Date(),
          actualizadoEn: data.actualizadoEn?.toDate() || new Date()
        } as Comercio);
      });

      return comercios;
    } catch (error) {
      console.error('Error getting comercios:', error);
      throw new Error(handleFirebaseError(error));
    }
  }

  /**
   * Get comercio statistics
   */
  async getStats(uid: string): Promise<ComercioStats> {
    try {
      const batch = db.batch ? writeBatch(db) : null;
      
      // Get basic comercio data
      const comercio = await this.getComercio(uid);
      if (!comercio) {
        throw new Error('Comercio no encontrado');
      }

      // Get validaciones count
      const validacionesQuery = query(
        collection(db, COLLECTIONS.VALIDACIONES),
        where('comercioId', '==', uid)
      );
      const validacionesSnapshot = await getDocs(validacionesQuery);
      const validaciones = validacionesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get beneficios count
      const beneficiosQuery = query(
        collection(db, COLLECTIONS.BENEFICIOS),
        where('comercioId', '==', uid)
      );
      const beneficiosSnapshot = await getDocs(beneficiosQuery);
      const beneficios = beneficiosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate statistics
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const validacionesHoy = validaciones.filter(v => 
        v.fechaHora?.toDate() >= startOfDay
      ).length;

      const validacionesMes = validaciones.filter(v => 
        v.fechaHora?.toDate() >= startOfMonth
      ).length;

      const beneficiosActivos = beneficios.filter(b => 
        b.estado === 'activo'
      ).length;

      const beneficiosVencidos = beneficios.filter(b => 
        b.estado === 'vencido'
      ).length;

      const validacionesExitosas = validaciones.filter(v => 
        v.resultado === 'valido'
      ).length;

      // Find most used benefit
      const beneficioUsos: Record<string, { titulo: string; usos: number }> = {};
      validaciones.forEach(v => {
        if (v.beneficioId) {
          const beneficio = beneficios.find(b => b.id === v.beneficioId);
          if (beneficio) {
            if (!beneficioUsos[v.beneficioId]) {
              beneficioUsos[v.beneficioId] = {
                titulo: beneficio.titulo,
                usos: 0
              };
            }
            beneficioUsos[v.beneficioId].usos++;
          }
        }
      });

      const beneficioMasUsado = Object.entries(beneficioUsos)
        .sort(([,a], [,b]) => b.usos - a.usos)[0];

      const stats: ComercioStats = {
        totalValidaciones: validaciones.length,
        validacionesHoy,
        validacionesMes,
        beneficiosActivos,
        beneficiosVencidos,
        asociacionesVinculadas: comercio.asociacionesVinculadas?.length || 0,
        sociosAlcanzados: new Set(validaciones.map(v => v.socioId)).size,
        ingresosPotenciales: validaciones.reduce((sum, v) => 
          sum + (v.montoTransaccion || 0), 0
        ),
        tasaConversion: validaciones.length > 0 ? 
          (validacionesExitosas / validaciones.length) * 100 : 0,
        beneficioMasUsado: beneficioMasUsado ? {
          id: beneficioMasUsado[0],
          titulo: beneficioMasUsado[1].titulo,
          usos: beneficioMasUsado[1].usos
        } : undefined
      };

      return stats;
    } catch (error) {
      console.error('Error getting comercio stats:', error);
      throw new Error(handleFirebaseError(error));
    }
  }

  /**
   * Toggle comercio visibility
   */
  async toggleVisibility(uid: string, visible: boolean): Promise<ComercioResponse> {
    try {
      await updateDoc(doc(db, COLLECTIONS.COMERCIOS, uid), {
        visible,
        actualizadoEn: serverTimestamp()
      });

      return {
        success: true,
        data: { visible }
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirebaseError(error)
      };
    }
  }

  /**
   * Update comercio configuration
   */
  async updateConfiguration(
    uid: string, 
    config: Record<string, any>
  ): Promise<ComercioResponse> {
    try {
      await updateDoc(doc(db, COLLECTIONS.COMERCIOS, uid), {
        configuracion: config,
        actualizadoEn: serverTimestamp()
      });

      return {
        success: true,
        data: { configuracion: config }
      };
    } catch (error) {
      return {
        success: false,
        error: handleFirebaseError(error)
      };
    }
  }

  /**
   * Generate QR validation URL
   */
  generateQRUrl(comercioId: string): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/validar-beneficio?comercio=${comercioId}`;
  }

  /**
   * Subscribe to comercio changes
   */
  subscribeToComercio(uid: string, callback: (comercio: Comercio | null) => void) {
    return onSnapshot(
      doc(db, COLLECTIONS.COMERCIOS, uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          callback({
            uid: doc.id,
            ...data,
            creadoEn: data.creadoEn?.toDate() || new Date(),
            actualizadoEn: data.actualizadoEn?.toDate() || new Date()
          } as Comercio);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error in comercio subscription:', error);
        callback(null);
      }
    );
  }

  /**
   * Validate comercio data
   */
  private validateComercioData(data: Partial<ComercioFormData>): string[] {
    const errors: string[] = [];
    
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('El formato del email no es válido');
    }
    
    if (data.telefono && data.telefono.length < 8) {
      errors.push('El teléfono debe tener al menos 8 dígitos');
    }
    
    if (data.sitioWeb && !data.sitioWeb.startsWith('http')) {
      errors.push('El sitio web debe comenzar con http:// o https://');
    }

    if (data.cuit && !/^\d{2}-\d{8}-\d{1}$/.test(data.cuit)) {
      errors.push('El formato del CUIT debe ser XX-XXXXXXXX-X');
    }
    
    return errors;
  }

  /**
   * Validate image file
   */
  private validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo debe ser menor a 5MB'
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Solo se permiten archivos JPG, PNG o WebP'
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const comercioService = new ComercioService();
export default comercioService;
