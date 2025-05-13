'use client';

import { useState } from 'react';
import { useAuth } from './use-auth';

export function usePlanUpgrade() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Inicia el proceso de actualización a un plan de pago
   * @param planId ID del plan a actualizar (professional o enterprise)
   * @returns Objeto con la URL de aprobación de PayPal
   */
  const upgradeToPaidPlan = async (planId: string): Promise<{ success: boolean; approvalUrl?: string }> => {
    if (!user) {
      setError('No hay usuario autenticado');
      return { success: false };
    }

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/upgrade-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar la actualización');
      }
      
      const data = await response.json();
      
      if (!data.approvalUrl) {
        throw new Error('No se pudo obtener la URL de aprobación');
      }
      
      return {
        success: true,
        approvalUrl: data.approvalUrl
      };
    } catch (err) {
      console.error('Error al actualizar plan:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar el plan');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    upgradeToPaidPlan,
    loading,
    error
  };
}