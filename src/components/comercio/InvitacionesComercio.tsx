import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Check,
  X,
  Clock,
  Building2,
  AlertCircle,
  MessageSquare,
  Calendar,
  Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { adhesionService, InvitacionComercio } from '@/services/adhesion.service';

interface InvitacionesComercioProps {
  comercioId: string;
}

export const InvitacionesComercio: React.FC<InvitacionesComercioProps> = ({ comercioId }) => {
  const [invitaciones, setInvitaciones] = useState<InvitacionComercio[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingInvitation, setProcessingInvitation] = useState<string | null>(null);

  // Cargar invitaciones pendientes
  useEffect(() => {
    const loadInvitaciones = async () => {
      if (!comercioId) return;

      setLoading(true);
      try {
        // Aquí necesitarías implementar un método en el servicio para obtener invitaciones por comercio
        // const invitacionesPendientes = await adhesionService.getInvitacionesPorComercio(comercioId);
        // setInvitaciones(invitacionesPendientes);
      } catch (error) {
        console.error('Error cargando invitaciones:', error);
        toast.error('Error al cargar las invitaciones');
      } finally {
        setLoading(false);
      }
    };

    loadInvitaciones();
  }, [comercioId]);

  const handleAprobarInvitacion = async (invitacionId: string) => {
    if (!comercioId) return;

    setProcessingInvitation(invitacionId);
    try {
      const success = await adhesionService.aprobarVinculacionComercio(invitacionId, comercioId);
      
      if (success) {
        toast.success('¡Invitación aprobada! Ahora formas parte de la asociación.');
        // Remover la invitación de la lista
        setInvitaciones(prev => prev.filter(inv => inv.id !== invitacionId));
      } else {
        toast.error('Error al aprobar la invitación');
      }
    } catch (error) {
      console.error('Error aprobando invitación:', error);
      toast.error('Error al aprobar la invitación');
    } finally {
      setProcessingInvitation(null);
    }
  };

  const handleRechazarInvitacion = async (invitacionId: string, motivo?: string) => {
    if (!comercioId) return;

    setProcessingInvitation(invitacionId);
    try {
      const success = await adhesionService.rechazarVinculacionComercio(
        invitacionId, 
        comercioId, 
        motivo || 'Rechazado por el comercio'
      );
      
      if (success) {
        toast.success('Invitación rechazada');
        // Remover la invitación de la lista
        setInvitaciones(prev => prev.filter(inv => inv.id !== invitacionId));
      } else {
        toast.error('Error al rechazar la invitación');
      }
    } catch (error) {
      console.error('Error rechazando invitación:', error);
      toast.error('Error al rechazar la invitación');
    } finally {
      setProcessingInvitation(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Cargando invitaciones...</span>
      </div>
    );
  }

  if (invitaciones.length === 0) {
    return (
      <div className="text-center py-8">
        <Mail className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No tienes invitaciones pendientes
        </h3>
        <p className="text-slate-500">
          Las invitaciones de asociaciones aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          Invitaciones Pendientes
        </h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {invitaciones.length} pendiente{invitaciones.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {invitaciones.map((invitacion) => (
          <motion.div
            key={invitacion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {invitacion.asociacionNombre}
                  </h3>
                  
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    Invitación recibida el {invitacion.fechaInvitacion.toDate().toLocaleDateString()}
                  </div>

                  {invitacion.mensaje && (
                    <div className="bg-slate-50 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
                        <p className="text-sm text-slate-700">{invitacion.mensaje}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Estado: Pendiente
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      Asociación
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRechazarInvitacion(invitacion.id)}
                  disabled={processingInvitation === invitacion.id}
                  className="inline-flex items-center px-3 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
                >
                  {processingInvitation === invitacion.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Rechazar
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAprobarInvitacion(invitacion.id)}
                  disabled={processingInvitation === invitacion.id}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
                >
                  {processingInvitation === invitacion.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Aceptar
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Warning for new comercios created by association */}
            {invitacion.comercioId && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Importante:</p>
                    <p>
                      Al aceptar esta invitación, confirmas que quieres formar parte de esta asociación. 
                      Una vez aceptada, tendrás control total sobre tu perfil y configuración.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
