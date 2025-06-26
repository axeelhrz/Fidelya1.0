'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Comercio, ComercioFormData, ComercioStats } from '@/types/comercio';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useComercios = () => {
  const { user } = useAuth();
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch comercio data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const comercioRef = doc(db, 'comercios', user.uid);
    
    const unsubscribe = onSnapshot(comercioRef, (doc) => {
      if (doc.exists()) {
        setComercio({ uid: doc.id, ...doc.data() } as Comercio);
      } else {
        setComercio(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching comercio:', error);
      setError('Error al cargar los datos del comercio');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Update comercio profile
  const updateProfile = useCallback(async (data: ComercioFormData): Promise<boolean> => {
    if (!user || !comercio) return false;

    try {
      setLoading(true);
      const comercioRef = doc(db, 'comercios', user.uid);
      
      await updateDoc(comercioRef, {
        ...data,
        actualizadoEn: Timestamp.now()
      });

      toast.success('Perfil actualizado correctamente');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, comercio]);

  // Upload image (logo or main image)
  const uploadImage = useCallback(async (file: File, type: 'logo' | 'imagen'): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `comercios/${user.uid}/${fileName}`);

      // Delete old image if exists
      if (comercio) {
        const oldImageUrl = type === 'logo' ? comercio.logoUrl : comercio.imagenPrincipalUrl;
        if (oldImageUrl) {
          try {
            const oldImageRef = ref(storage, oldImageUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.log('Old image not found or already deleted');
          }
        }
      }

      // Upload new image
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update comercio document
      const comercioRef = doc(db, 'comercios', user.uid);
      const updateData = type === 'logo' 
        ? { logoUrl: downloadURL }
        : { imagenPrincipalUrl: downloadURL };

      await updateDoc(comercioRef, {
        ...updateData,
        actualizadoEn: Timestamp.now()
      });

      toast.success(`${type === 'logo' ? 'Logo' : 'Imagen'} actualizada correctamente`);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Error al subir ${type === 'logo' ? 'el logo' : 'la imagen'}`);
      return null;
    }
  }, [user, comercio]);

  // Get comercio statistics
  const getStats = useCallback(async (): Promise<ComercioStats | null> => {
    if (!user) return null;

    try {
      // This would typically involve multiple queries to get comprehensive stats
      // For now, we'll return mock data structure
      const stats: ComercioStats = {
        totalValidaciones: 0,
        validacionesHoy: 0,
        validacionesMes: 0,
        beneficiosActivos: 0,
        beneficiosVencidos: 0,
        asociacionesVinculadas: comercio?.asociacionesVinculadas?.length || 0,
        sociosAlcanzados: 0,
        ingresosPotenciales: 0,
        tasaConversion: 0
      };

      return stats;
    } catch (error) {
      console.error('Error getting stats:', error);
      return null;
    }
  }, [user, comercio]);

  return {
    comercio,
    loading,
    error,
    updateProfile,
    uploadImage,
    getStats
  };
};
