import { 
  doc, 
  updateDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { dbs } from '@/lib/firebase';
import { Comercio, ComercioFormData, ComercioStats, Validacion } from '@/types/comercio';
import { uploadImage, deleteImage, generateImagePath } from '@/utils/storage/uploadImage';

export class ComercioService {
  // Update comercio profile
  static async updateProfile(userId: string, data: ComercioFormData): Promise<void> {
    try {
      const comercioRef = doc(db, 'comercios', userId);
      
      await updateDoc(comercioRef, {
        ...data,
        actualizadoEn: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating comercio profile:', error);
      throw new Error('Error al actualizar el perfil del comercio');
    }
  }

  // Upload comercio image (logo or portada)
  static async uploadComercioImage(
    userId: string, 
    file: File, 
    type: 'logo' | 'imagen'
  ): Promise<string> {
    try {
      // Generate unique path
      const imagePath = generateImagePath(userId, type === 'logo' ? 'logo' : 'portada');
      
      // Get current comercio data to delete old image
      const comercioRef = doc(db, 'comercios', userId);
      const comercioDoc = await getDoc(comercioRef);
      
      if (comercioDoc.exists()) {
        const comercioData = comercioDoc.data() as Comercio;
        const oldImageUrl = type === 'logo' ? comercioData.logoUrl : comercioData.imagenPrincipalUrl;
        
        // Delete old image if exists
        if (oldImageUrl) {
          try {
            await deleteImage(oldImageUrl);
          } catch (error) {
            console.log('Old image not found or already deleted:', error);
          }
        }
      }

      // Upload new image
      const downloadURL = await uploadImage(file, imagePath, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        quality: 0.8
      });

      // Update comercio document
      const updateData = type === 'logo' 
        ? { logoUrl: downloadURL }
        : { imagenPrincipalUrl: downloadURL };

      await updateDoc(comercioRef, {
        ...updateData,
        actualizadoEn: Timestamp.now()
      });

      return downloadURL;
    } catch (error) {
      console.error('Error uploading comercio image:', error);
      throw error;
    }
  }

  // Get comercio statistics
  static async getComercioStats(userId: string): Promise<ComercioStats> {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get validaciones
      const validacionesRef = collection(db, 'validaciones');
      
      // Total validaciones
      const totalQuery = query(validacionesRef, where('comercioId', '==', userId));
      const totalSnapshot = await getDocs(totalQuery);
      const totalValidaciones = totalSnapshot.size;

      // Validaciones hoy
      const todayQuery = query(
        validacionesRef, 
        where('comercioId', '==', userId),
        where('fechaHora', '>=', Timestamp.fromDate(startOfDay))
      );
      const todaySnapshot = await getDocs(todayQuery);
      const validacionesHoy = todaySnapshot.size;

      // Validaciones este mes
      const monthQuery = query(
        validacionesRef, 
        where('comercioId', '==', userId),
        where('fechaHora', '>=', Timestamp.fromDate(startOfMonth))
      );
      const monthSnapshot = await getDocs(monthQuery);
      const validacionesMes = monthSnapshot.size;

      // Get beneficios activos
      const beneficiosRef = collection(db, 'beneficios');
      const beneficiosQuery = query(
        beneficiosRef, 
        where('comercioId', '==', userId),
        where('estado', '==', 'activo')
      );
      const beneficiosSnapshot = await getDocs(beneficiosQuery);
      const beneficiosActivos = beneficiosSnapshot.size;

      // Get comercio data for asociaciones
      const comercioRef = doc(db, 'comercios', userId);
      const comercioDoc = await getDoc(comercioRef);
      const comercioData = comercioDoc.data() as Comercio;

      // Calculate additional stats
      const validacionesExitosas = totalSnapshot.docs.filter(
        doc => doc.data().resultado === 'habilitado'
      ).length;

      const tasaConversion = totalValidaciones > 0 
        ? (validacionesExitosas / totalValidaciones) * 100 
        : 0;

      // Get most used benefit
      const beneficioMasUsado = await this.getMostUsedBenefit(userId);

      return {
        totalValidaciones,
        validacionesHoy,
        validacionesMes,
        beneficiosActivos,
        beneficiosVencidos: 0, // Would need additional query
        asociacionesVinculadas: comercioData?.asociacionesVinculadas?.length || 0,
        sociosAlcanzados: 0, // Would need additional calculation
        ingresosPotenciales: 0, // Would need transaction data
        tasaConversion,
        beneficioMasUsado
      };
    } catch (error) {
      console.error('Error getting comercio stats:', error);
      throw new Error('Error al obtener estadísticas del comercio');
    }
  }

  // Get most used benefit - FIXED: Handle empty array case
  private static async getMostUsedBenefit(userId: string) {
    try {
      const validacionesRef = collection(db, 'validaciones');
      const query_ = query(
        validacionesRef,
        where('comercioId', '==', userId),
        where('resultado', '==', 'habilitado'),
        orderBy('fechaHora', 'desc'),
        limit(100)
      );
      
      const snapshot = await getDocs(query_);
      const beneficioCount: Record<string, number> = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const beneficioId = data.beneficioId;
        if (beneficioId) {
          beneficioCount[beneficioId] = (beneficioCount[beneficioId] || 0) + 1;
        }
      });

      // FIXED: Check if there are any benefits before using reduce
      const beneficioIds = Object.keys(beneficioCount);
      if (beneficioIds.length === 0) {
        return undefined;
      }

      const mostUsedId = beneficioIds.reduce((a, b) => 
        beneficioCount[a] > beneficioCount[b] ? a : b
      );

      if (mostUsedId) {
        const beneficioRef = doc(db, 'beneficios', mostUsedId);
        const beneficioDoc = await getDoc(beneficioRef);
        
        if (beneficioDoc.exists()) {
          const beneficioData = beneficioDoc.data();
          return {
            id: mostUsedId,
            titulo: beneficioData.titulo,
            usos: beneficioCount[mostUsedId]
          };
        }
      }

      return undefined;
    } catch (error) {
      console.error('Error getting most used benefit:', error);
      return undefined;
    }
  }

  // Generate QR validation URL
  static generateQRValidationURL(comercioId: string, beneficioId?: string): string {
    const timestamp = Date.now();
    const baseUrl = `fidelya://comercio/${comercioId}?t=${timestamp}`;
    return beneficioId ? `${baseUrl}&beneficio=${beneficioId}` : baseUrl;
  }

  // Generate web validation URL for fallback
  static generateWebValidationURL(comercioId: string, beneficioId?: string): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({ comercio: comercioId });
    if (beneficioId) {
      params.append('beneficio', beneficioId);
    }
    return `${baseUrl}/validar-beneficio?${params.toString()}`;
  }

  // Validate comercio exists and is active
  static async validateComercio(comercioId: string): Promise<boolean> {
    try {
      const comercioRef = doc(db, 'comercios', comercioId);
      const comercioDoc = await getDoc(comercioRef);
      
      if (!comercioDoc.exists()) {
        return false;
      }

      const comercioData = comercioDoc.data() as Comercio;
      return comercioData.estado === 'activo';
    } catch (error) {
      console.error('Error validating comercio:', error);
      return false;
    }
  }

  // Get recent validaciones
  static async getRecentValidaciones(userId: string, limit_: number = 10): Promise<Validacion[]> {
    try {
      const validacionesRef = collection(db, 'validaciones');
      const query_ = query(
        validacionesRef,
        where('comercioId', '==', userId),
        orderBy('fechaHora', 'desc'),
        limit(limit_)
      );

      const snapshot = await getDocs(query_);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Validacion[];
    } catch (error) {
      console.error('Error getting recent validaciones:', error);
      throw new Error('Error al obtener validaciones recientes');
    }
  }

  // Update comercio visibility
  static async updateVisibility(userId: string, visible: boolean): Promise<void> {
    try {
      const comercioRef = doc(db, 'comercios', userId);
      await updateDoc(comercioRef, {
        visible,
        actualizadoEn: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating comercio visibility:', error);
      throw new Error('Error al actualizar la visibilidad del comercio');
    }
  }

  // Batch update comercio data
  static async batchUpdateComercio(userId: string, updates: Partial<Comercio>): Promise<void> {
    try {
      const batch = writeBatch(db);
      const comercioRef = doc(db, 'comercios', userId);
      
      batch.update(comercioRef, {
        ...updates,
        actualizadoEn: Timestamp.now()
      });

      await batch.commit();
    } catch (error) {
      console.error('Error batch updating comercio:', error);
      throw new Error('Error al actualizar los datos del comercio');
    }
  }
}