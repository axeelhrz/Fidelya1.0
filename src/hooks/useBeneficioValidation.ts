'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { membershipSyncService } from '@/services/membership-sync.service';

interface BeneficioValidationState {
  canUseBeneficios: boolean;
  isValidating: boolean;
  membershipStatus: string;
  error: string | null;
  lastCheck: Date | null;
}

export function useBeneficioValidation() {
  const { user, refreshUser } = useAuth();
  const [validationState, setValidationState] = useState<BeneficioValidationState>({
    canUseBeneficios: false,
    isValidating: false,
    membershipStatus: 'unknown',
    error: null,
    lastCheck: null,
  });

  const validateMembershipForBeneficios = useCallback(async () => {
    if (!user || user.role !== 'socio') {
      setValidationState(prev => ({
        ...prev,
        canUseBeneficios: false,
        membershipStatus: 'not_socio',
        error: 'Usuario no es socio',
      }));
      return false;
    }

    setValidationState(prev => ({ ...prev, isValidating: true, error: null }));

    try {
      console.log('🔍 Validando membresía para uso de beneficios...');
      
      // Verificar estado actual
      const membershipStatus = await membershipSyncService.checkMembershipStatus(user.uid);
      
      if (!membershipStatus) {
        throw new Error('No se pudo verificar el estado de membresía');
      }

      console.log('📊 Estado de membresía:', membershipStatus);

      // Si el estado no es consistente, intentar corregirlo
      if (!membershipStatus.isConsistent) {
        console.log('🔧 Estado inconsistente, corrigiendo...');
        
        const fixed = await membershipSyncService.syncMembershipStatus(user.uid);
        
        if (fixed) {
          console.log('✅ Estado corregido, refrescando usuario...');
          await refreshUser();
          
          // Verificar nuevamente después de la corrección
          const updatedStatus = await membershipSyncService.checkMembershipStatus(user.uid);
          if (updatedStatus) {
            membershipStatus.membershipStatus = updatedStatus.membershipStatus;
            membershipStatus.isConsistent = updatedStatus.isConsistent;
          }
        }
      }

      // Determinar si puede usar beneficios
            const canUseBeneficios = !!membershipStatus.asociacionId &&
                                    (membershipStatus.membershipStatus === 'al_dia' || 
                                     membershipStatus.membershipStatus === 'activo');
      
            setValidationState({
        canUseBeneficios,
        isValidating: false,
        membershipStatus: membershipStatus.membershipStatus,
        error: null,
        lastCheck: new Date(),
      });

      if (!canUseBeneficios) {
        let errorMessage = 'No puedes usar beneficios en este momento.';
        
        if (!membershipStatus.asociacionId) {
          errorMessage = 'No estás vinculado a ninguna asociación.';
        } else if (membershipStatus.membershipStatus === 'pendiente') {
          errorMessage = 'Tu membresía está pendiente de activación.';
        } else if (membershipStatus.membershipStatus === 'vencido') {
          errorMessage = 'Tu membresía está vencida. Renueva tu cuota.';
        }

        setValidationState(prev => ({ ...prev, error: errorMessage }));
      }

      return canUseBeneficios;
    } catch (error) {
      console.error('❌ Error validando membresía:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al validar membresía';
      
      setValidationState({
        canUseBeneficios: false,
        isValidating: false,
        membershipStatus: 'error',
        error: errorMessage,
        lastCheck: new Date(),
      });

      return false;
    }
  }, [user, refreshUser]);

  // Validar automáticamente cuando cambie el usuario
  useEffect(() => {
    if (user) {
      validateMembershipForBeneficios();
    }
  }, [user, validateMembershipForBeneficios]);

  const forceValidation = useCallback(async () => {
    return await validateMembershipForBeneficios();
  }, [validateMembershipForBeneficios]);

  return {
    ...validationState,
    validateMembership: validateMembershipForBeneficios,
    forceValidation,
  };
}

export default useBeneficioValidation;
