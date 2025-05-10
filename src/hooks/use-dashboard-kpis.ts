import { useState, useEffect } from 'react';
import { generateKpis, getKpis, shouldUpdateKpis, DashboardKPIs } from '@/lib/generate-kpis';
import { useAuth } from '@/hooks/use-auth';

export const useDashboardKpis = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Cargar KPIs al iniciar
  useEffect(() => {
    const loadKpis = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Verificar si los KPIs existen y si necesitan ser actualizados
        const needsUpdate = await shouldUpdateKpis(user.uid);
        
        if (needsUpdate) {
          // Generar nuevos KPIs
          const newKpis = await generateKpis(user.uid);
          setKpis(newKpis);
        } else {
          // Obtener KPIs existentes
          const existingKpis = await getKpis(user.uid);
          setKpis(existingKpis);
        }
      } catch (err) {
        console.error('Error al cargar KPIs:', err);
        setError('No se pudieron cargar los KPIs del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadKpis();
  }, [user?.uid]);

  // Función para forzar la regeneración de KPIs
  const refreshKpis = async (): Promise<boolean> => {
    if (!user?.uid) {
      setError('Usuario no autenticado');
      return false;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const newKpis = await generateKpis(user.uid);
      setKpis(newKpis);
      
      return !!newKpis;
    } catch (err) {
      console.error('Error al regenerar KPIs:', err);
      setError('No se pudieron regenerar los KPIs del dashboard');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    kpis,
    loading,
    error,
    isGenerating,
    refreshKpis
  };
};