import { 
  doc, 
  updateDoc, 
  getDoc, 
  Timestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Comercio, ComercioFormData } from '@/types/comercio';

export const updateComercioProfile = async (
  userId: string, 
  data: ComercioFormData
): Promise<void> => {
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
};

export const getComercioById = async (userId: string): Promise<Comercio | null> => {
  try {
    const comercioRef = doc(db, 'comercios', userId);
    const comercioSnap = await getDoc(comercioRef);
    
    if (comercioSnap.exists()) {
      return { uid: comercioSnap.id, ...comercioSnap.data() } as Comercio;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting comercio:', error);
    throw new Error('Error al obtener los datos del comercio');
  }
};

export const updateComercioImage = async (
  userId: string,
  imageUrl: string,
  type: 'logo' | 'imagen'
): Promise<void> => {
  try {
    const comercioRef = doc(db, 'comercios', userId);
    const updateData = type === 'logo' 
      ? { logoUrl: imageUrl }
      : { imagenPrincipalUrl: imageUrl };
    
    await updateDoc(comercioRef, {
      ...updateData,
      actualizadoEn: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating comercio image:', error);
    throw new Error('Error al actualizar la imagen del comercio');
  }
};

export const toggleComercioVisibility = async (
  userId: string,
  visible: boolean
): Promise<void> => {
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
};

export const searchComerciosByCategory = async (categoria: string): Promise<Comercio[]> => {
  try {
    const comerciosRef = collection(db, 'comercios');
    const q = query(
      comerciosRef,
      where('categoria', '==', categoria),
      where('visible', '==', true),
      where('estado', '==', 'activo')
    );
    
    const querySnapshot = await getDocs(q);
    const comercios: Comercio[] = [];
    
    querySnapshot.forEach((doc) => {
      comercios.push({ uid: doc.id, ...doc.data() } as Comercio);
    });
    
    return comercios;
  } catch (error) {
    console.error('Error searching comercios by category:', error);
    throw new Error('Error al buscar comercios por categoría');
  }
};

export const getComerciosStats = async (userId: string) => {
  try {
    // This would typically involve multiple queries to get comprehensive stats
    // For now, we'll return a basic structure that can be expanded
    
    const comercioRef = doc(db, 'comercios', userId);
    const comercioSnap = await getDoc(comercioRef);
    
    if (!comercioSnap.exists()) {
      throw new Error('Comercio no encontrado');
    }
    
    // Here you would add queries for:
    // - Total validaciones
    // - Beneficios activos
    // - Socios alcanzados
    // - etc.
    
    return {
      totalValidaciones: 0,
      validacionesHoy: 0,
      validacionesMes: 0,
      beneficiosActivos: 0,
      beneficiosVencidos: 0,
      asociacionesVinculadas: comercioSnap.data()?.asociacionesVinculadas?.length || 0,
      sociosAlcanzados: 0,
      ingresosPotenciales: 0,
      tasaConversion: 0
    };
  } catch (error) {
    console.error('Error getting comercio stats:', error);
    throw new Error('Error al obtener las estadísticas del comercio');
  }
};

export const generateQRValidationUrl = (comercioId: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/validar-beneficio?comercio=${comercioId}`;
};

export const validateComercioData = (data: Partial<ComercioFormData>): string[] => {
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
  
  return errors;
};
