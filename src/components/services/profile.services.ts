import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase-config';
import { ProfileData } from '@/hooks/profile';

export class ProfileService {
  /**
   * Obtiene el perfil de un usuario
   * @param userId ID del usuario
   * @returns Datos del perfil o null si no existe
   */
  static async getProfile(userId: string): Promise<ProfileData | null> {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      
      if (!profileDoc.exists()) {
        return null;
      }
      
      return profileDoc.data() as ProfileData;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }
  
  /**
   * Crea un nuevo perfil para un usuario
   * @param userId ID del usuario
   * @param data Datos del perfil
   * @returns Datos del perfil creado
   */
  static async createProfile(userId: string, data: Partial<ProfileData>): Promise<ProfileData> {
    try {
      const now = new Date();
      
      const profileData: ProfileData = {
        id: userId,
        displayName: data.displayName || '',
        email: data.email || '',
        bio: data.bio || '',
        location: data.location || '',
        company: data.company || '',
        website: data.website || '',
        avatarUrl: data.avatarUrl || '',
        coverPhotoUrl: data.coverPhotoUrl || '',
        statistics: {
          totalClients: data.statistics?.totalClients || 0,
          activePolicies: data.statistics?.activePolicies || 0,
          successRate: data.statistics?.successRate || 0,
          lastUpdated: data.statistics?.lastUpdated || now
        },
        socialLinks: {
          linkedin: data.socialLinks?.linkedin || '',
          twitter: data.socialLinks?.twitter || '',
          facebook: data.socialLinks?.facebook || ''
        },
        createdAt: now,
        updatedAt: now
      };
      
      await setDoc(doc(db, 'profiles', userId), {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return profileData;
    } catch (error) {
      console.error('Error al crear perfil:', error);
      throw error;
    }
  }
  
  /**
   * Actualiza un perfil existente
   * @param userId ID del usuario
   * @param data Datos a actualizar
   * @returns Datos actualizados
   */
  static async updateProfile(userId: string, data: Partial<ProfileData>): Promise<Partial<ProfileData>> {
    try {
      const profileRef = doc(db, 'profiles', userId);
      
      // Eliminar campos que no queremos actualizar
      const { ...updateData } = data as Partial<ProfileData>;
      
      await updateDoc(profileRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      return data;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }
  
  /**
   * Sube una imagen de avatar y actualiza el perfil
   * @param userId ID del usuario
   * @param file Archivo de imagen
   * @returns URL de la imagen subida
   */
  static async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      // Crear referencia en Storage
      const storageRef = ref(storage, `avatars/${userId}`);
      
      // Subir archivo
      await uploadBytes(storageRef, file);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      
      // Actualizar perfil con la nueva URL
      await this.updateProfile(userId, { avatarUrl: downloadURL });
      
      return downloadURL;
    } catch (error) {
      console.error('Error al subir avatar:', error);
      throw error;
    }
  }
  
  /**
   * Sube una imagen de portada y actualiza el perfil
   * @param userId ID del usuario
   * @param file Archivo de imagen
   * @returns URL de la imagen subida
   */
  static async uploadCoverPhoto(userId: string, file: File): Promise<string> {
    try {
      // Crear referencia en Storage
      const storageRef = ref(storage, `covers/${userId}`);
      
      // Subir archivo
      await uploadBytes(storageRef, file);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      
      // Actualizar perfil con la nueva URL
      await this.updateProfile(userId, { coverPhotoUrl: downloadURL });
      
      return downloadURL;
    } catch (error) {
      console.error('Error al subir foto de portada:', error);
      throw error;
    }
  }
  
  /**
   * Actualiza las estadísticas del perfil
   * @param userId ID del usuario
   * @param statistics Estadísticas a actualizar
   * @returns Estadísticas actualizadas
   */
  static async updateStatistics(
    userId: string, 
    statistics: Partial<ProfileData['statistics']>
  ): Promise<ProfileData['statistics']> {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const profileDoc = await getDoc(profileRef);
      
      if (!profileDoc.exists()) {
        throw new Error('El perfil no existe');
      }
      
      const currentStats = (profileDoc.data() as ProfileData).statistics;
      
      const updatedStats = {
        ...currentStats,
        ...statistics,
        lastUpdated: new Date()
      };
      
      await updateDoc(profileRef, {
        statistics: updatedStats,
        updatedAt: serverTimestamp()
      });
      
      return updatedStats;
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
      throw error;
    }
  }
}