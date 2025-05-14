import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { Contact } from '@/types/contact';
import { User } from '@/types/user';
import {
  getContacts,
  getContactsByStatus,
  getFavoriteContacts,
  getPendingRequests,
  getBlockedContacts,
  sendContactRequest,
  acceptContactRequest,
  rejectContactRequest,
  blockContact,
  unblockContact,
  toggleFavoriteContact,
  searchUsersByEmail,
  canAddMoreContacts,
  checkPlanLimits
} from '@/components/services/contacts.services';

export const useContacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [acceptedContacts, setAcceptedContacts] = useState<Contact[]>([]);
  const [pendingContacts, setPendingContacts] = useState<Contact[]>([]);
  const [favoriteContacts, setFavoriteContacts] = useState<Contact[]>([]);
  const [blockedContacts, setBlockedContacts] = useState<Contact[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [canAddMore, setCanAddMore] = useState<boolean>(true);
  const [planLimits, setPlanLimits] = useState<{
    maxContacts: number;
    messageHistory: number;
    realTimeStatus: boolean;
    fileAttachments: boolean;
    shareItems: boolean;
    pushNotifications: boolean;
    contactMetrics: boolean;
  }>({
    maxContacts: 10,
    messageHistory: 30,
    realTimeStatus: false,
    fileAttachments: false,
    shareItems: false,
    pushNotifications: false,
    contactMetrics: false
  });

  // Cargar todos los contactos
  useEffect(() => {
    if (!user) return;

    const unsubscribe = getContacts(user.uid, (data) => {
      setContacts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Cargar contactos aceptados
  useEffect(() => {
    if (!user) return;

    const unsubscribe = getContactsByStatus(user.uid, 'accepted', (data) => {
      setAcceptedContacts(data);
    });

    return () => unsubscribe();
  }, [user]);

  // Cargar contactos pendientes enviados
  useEffect(() => {
    if (!user) return;

    const unsubscribe = getContactsByStatus(user.uid, 'pending', (data) => {
      setPendingContacts(data);
    });

    return () => unsubscribe();
  }, [user]);

  // Cargar contactos favoritos
  useEffect(() => {
    if (!user) return;

    const unsubscribe = getFavoriteContacts(user.uid, (data) => {
      setFavoriteContacts(data);
    });

    return () => unsubscribe();
  }, [user]);

  // Cargar contactos bloqueados
  useEffect(() => {
    if (!user) return;

    const unsubscribe = getBlockedContacts(user.uid, (data) => {
      setBlockedContacts(data);
    });

    return () => unsubscribe();
  }, [user]);

  // Cargar solicitudes pendientes recibidas
  useEffect(() => {
    if (!user) return;

    const unsubscribe = getPendingRequests(user.uid, (data) => {
      setPendingRequests(data);
    });

    return () => unsubscribe();
  }, [user]);

  // Verificar límites del plan
  useEffect(() => {
    if (!user) return;

    const checkLimits = async () => {
      try {
        const canAdd = await canAddMoreContacts(user.uid);
        setCanAddMore(canAdd);

        // Verificar límites específicos del plan
        const maxContacts = Number(await checkPlanLimits(user.uid, 'maxContacts')) || 0;
        const messageHistory = Number(await checkPlanLimits(user.uid, 'messageHistory')) || 0;
        const realTimeStatus = Boolean(await checkPlanLimits(user.uid, 'realTimeStatus'));
        const fileAttachments = Boolean(await checkPlanLimits(user.uid, 'fileAttachments'));
        const shareItems = Boolean(await checkPlanLimits(user.uid, 'shareItems'));
        const pushNotifications = Boolean(await checkPlanLimits(user.uid, 'pushNotifications'));
        const contactMetrics = Boolean(await checkPlanLimits(user.uid, 'contactMetrics'));

        setPlanLimits({
          maxContacts,
          messageHistory,
          realTimeStatus,
          fileAttachments,
          shareItems,
          pushNotifications,
          contactMetrics
        });
      } catch (err) {
        console.error('Error al verificar límites:', err);
      }
    };

    checkLimits();
  }, [user, contacts.length]);

  // Enviar solicitud de contacto
  const sendRequest = useCallback(async (email: string) => {
    if (!user) return { success: false, message: 'No has iniciado sesión' };
    
    try {
      setError(null);
      return await sendContactRequest(user.email!, email);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar solicitud';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user]);

  // Aceptar solicitud
  const acceptRequest = useCallback(async (contactId: string) => {
    if (!user) return { success: false, message: 'No has iniciado sesión' };
    
    try {
      setError(null);
      return await acceptContactRequest(contactId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aceptar solicitud';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user]);

  // Rechazar solicitud
  const rejectRequest = useCallback(async (contactId: string) => {
    if (!user) return { success: false, message: 'No has iniciado sesión' };
    
    try {
      setError(null);
      return await rejectContactRequest(contactId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al rechazar solicitud';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user]);

  // Bloquear contacto
  const blockContactById = useCallback(async (contactId: string) => {
    if (!user) return { success: false, message: 'No has iniciado sesión' };
    
    try {
      setError(null);
      return await blockContact(contactId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al bloquear contacto';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user]);

  // Desbloquear contacto
  const unblockContactById = useCallback(async (contactId: string) => {
    if (!user) return { success: false, message: 'No has iniciado sesión' };
    
    try {
      setError(null);
      return await unblockContact(contactId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al desbloquear contacto';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user]);

  // Marcar/desmarcar como favorito
  const toggleFavorite = useCallback(async (contactId: string, isFavorite: boolean) => {
    if (!user) return { success: false, message: 'No has iniciado sesión' };
    
    try {
      setError(null);
      return await toggleFavoriteContact(contactId, isFavorite);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar favorito';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [user]);

  // Buscar usuarios por email
  const searchUsers = useCallback(async (query: string) => {
    if (!user) return;
    
    try {
      setError(null);
      const results = await searchUsersByEmail(query);
      setSearchResults(results);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar usuarios';
      setError(errorMessage);
      setSearchResults([]);
    }
  }, [user]);

  return {
    contacts,
    acceptedContacts,
    pendingContacts,
    favoriteContacts,
    blockedContacts,
    pendingRequests,
    loading,
    error,
    searchResults,
    canAddMore,
    planLimits,
    sendRequest,
    acceptRequest,
    rejectRequest,
    blockContactById,
    unblockContactById,
    toggleFavorite,
    searchUsers
  };
};