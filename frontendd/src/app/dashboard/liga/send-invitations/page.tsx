'use client';

import { useAuth } from '@/contexts/AuthContext';
import LeagueLayout from '@/components/leagues/LeagueLayout';
import { useEffect, useState } from 'react';
import { 
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserGroupIcon,
  PlusIcon,
  CheckCircleIcon,
  XMarkIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import type { Club, League, InvitationForm, SendInvitationForm, PaginatedResponse, ApiResponse, AvailableEntitiesResponse } from '@/types';

export default function SendInvitationsPage() {
  const { user, loading } = useAuth();
  const [availableEntities, setAvailableEntities] = useState<(Club | League)[]>([]);
  const [entityType, setEntityType] = useState<'clubs' | 'leagues'>('clubs');
  const [loadingEntities, setLoadingEntities] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<Club | League | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitationForm, setInvitationForm] = useState<SendInvitationForm>({
    message: '',
    expires_at: ''
  });
  const [sendingInvitation, setSendingInvitation] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  useEffect(() => {
    if (user && (user.role === 'liga' || user.role === 'club' || user.role === 'super_admin')) {
      fetchAvailableEntities();
    }
  }, [user, searchTerm]);

  const fetchAvailableEntities = async (page = 1) => {
    try {
      setLoadingEntities(true);
      const params = new URLSearchParams({
        page: page.toString(),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await axios.get<ApiResponse<AvailableEntitiesResponse>>(`/api/invitations/available-entities?${params}`);
      
      if (response.data.status === 'success') {
        const entitiesResponse = response.data.data;
        setAvailableEntities(entitiesResponse.data.data);
        setEntityType(entitiesResponse.entity_type);
        setPagination({
          current_page: entitiesResponse.data.current_page,
          last_page: entitiesResponse.data.last_page,
          total: entitiesResponse.data.total
        });
      }
    } catch (error) {
      console.error('Error fetching available entities:', error);
    } finally {
      setLoadingEntities(false);
    }
  };

  const openInviteModal = (entity: Club | League) => {
    setSelectedEntity(entity);
    
    const isClub = 'city' in entity;
    const isLeague = 'province' in entity;
    
    let defaultMessage = '';
    if (user?.role === 'liga' && isClub) {
      defaultMessage = `¡Hola! Te invitamos a unirte a nuestra liga. Creemos que sería una excelente oportunidad para ${entity.name} formar parte de nuestra comunidad deportiva.`;
    } else if (user?.role === 'club' && isLeague) {
      defaultMessage = `¡Hola! Nos gustaría solicitar la afiliación de nuestro club a ${entity.name}. Creemos que podemos contribuir positivamente a su liga.`;
    }
    
    setInvitationForm({
      ...(isClub && { club_id: entity.id, club_name: entity.name }),
      ...(isLeague && { league_id: entity.id, league_name: entity.name }),
      message: defaultMessage,
      expires_at: ''
    });
    setIsInviteModalOpen(true);
  };

  const handleSendInvitation = async () => {
    if (!selectedEntity) return;

    try {
      setSendingInvitation(true);
      
      const isClub = 'city' in selectedEntity;
      const isLeague = 'province' in selectedEntity;
      
      let invitationData: InvitationForm;
      
      if (user?.role === 'liga' && isClub) {
        // Liga inviting club
        invitationData = {
          receiver_id: selectedEntity.id,
          receiver_type: 'App\\Models\\Club',
          message: invitationForm.message,
          type: 'league_to_club',
          ...(invitationForm.expires_at && { expires_at: invitationForm.expires_at })
        };
      } else if (user?.role === 'club' && isLeague) {
        // Club requesting to join league
        invitationData = {
          receiver_id: selectedEntity.id,
          receiver_type: 'App\\Models\\League',
          message: invitationForm.message,
          type: 'club_to_league',
          ...(invitationForm.expires_at && { expires_at: invitationForm.expires_at })
        };
      } else {
        throw new Error('Invalid combination of user role and entity type');
      }

      const response = await axios.post('/api/invitations', invitationData);
      
      if (response.data.status === 'success') {
        alert('Invitación enviada exitosamente');
        setIsInviteModalOpen(false);
        // Remove the entity from available entities list
        setAvailableEntities(prev => prev.filter(entity => entity.id !== selectedEntity.id));
        // Reset form
        setInvitationForm({
          message: '',
          expires_at: ''
        });
        setSelectedEntity(null);
      }
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      const errorMessage = error.response?.data?.message || 'Error al enviar la invitación';
      alert(errorMessage);
    } finally {
      setSendingInvitation(false);
    }
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
    setSelectedEntity(null);
    setInvitationForm({
      message: '',
      expires_at: ''
    });
  };

  const getEntityIcon = (entity: Club | League) => {
    return 'city' in entity ? BuildingOfficeIcon : TrophyIcon;
  };

  const getEntityLocation = (entity: Club | League) => {
    return 'city' in entity ? entity.city : entity.province;
  };

  const getEntityType = (entity: Club | League) => {
    return 'city' in entity ? 'Club' : 'Liga';
  };

  if (loading || loadingEntities) {
    return (
      <LeagueLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
        </div>
      </LeagueLayout>
    );
  }

  if (!user || (user.role !== 'liga' && user.role !== 'club' && user.role !== 'super_admin')) {
    return (
      <LeagueLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-800">Acceso Denegado</h1>
          <p className="text-red-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </LeagueLayout>
    );
  }

  const pageTitle = user.role === 'liga' ? 'Invitar Clubes' : 'Solicitar Unirse a Liga';
  const pageDescription = user.role === 'liga' 
    ? 'Invita clubes para que se unan a tu liga deportiva'
    : 'Solicita la afiliación de tu club a una liga deportiva';

  return (
    <LeagueLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-gray-600 mt-1">
                {pageDescription}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-50 rounded-lg p-3">
                <PaperAirplaneIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Buscar ${entityType === 'clubs' ? 'clubes por nombre o ciudad' : 'ligas por nombre o provincia'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Available Entities */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {entityType === 'clubs' ? 'Clubes Disponibles' : 'Ligas Disponibles'} ({pagination.total})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {entityType === 'clubs' 
                ? 'Clubes que no están afiliados a ninguna liga y pueden recibir invitaciones'
                : 'Ligas deportivas disponibles para solicitar afiliación'
              }
            </p>
          </div>

          {availableEntities.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {availableEntities.map((entity) => {
                const IconComponent = getEntityIcon(entity);
                const isClub = 'city' in entity;
                
                return (
                  <div key={entity.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isClub ? 'bg-blue-100' : 'bg-yellow-100'
                        }`}>
                          <IconComponent className={`h-6 w-6 ${
                            isClub ? 'text-blue-600' : 'text-yellow-600'
                          }`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {entity.name}
                          </h3>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              <span>{getEntityLocation(entity)}</span>
                            </div>
                            {isClub && entity.address && (
                              <div className="flex items-center">
                                <span>{entity.address}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                isClub 
                                  ? (entity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {isClub 
                                  ? (entity.status === 'active' ? 'Activo' : 'Inactivo')
                                  : getEntityType(entity)
                                }
                              </span>
                            </div>
                            {/* Show league affiliation for clubs */}
                            {isClub && entity.league && (
                              <div className="flex items-center">
                                <span className="px-2 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800">
                                  Liga: {entity.league.name}
                                </span>
                              </div>
                            )}
                            {isClub && !entity.league && (
                              <div className="flex items-center">
                                <span className="px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-800">
                                  Sin Liga
                                </span>
                              </div>
                            )}
                          </div>

                          {isClub && (entity.phone || entity.email) && (
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              {entity.phone && <span>📞 {entity.phone}</span>}
                              {entity.email && <span>✉️ {entity.email}</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openInviteModal(entity)}
                          className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                          {user.role === 'liga' ? 'Enviar Invitación' : 'Solicitar Unirse'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              {entityType === 'clubs' ? (
                <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              ) : (
                <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No hay {entityType === 'clubs' ? 'clubes' : 'ligas'} disponibles
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? `No se encontraron ${entityType === 'clubs' ? 'clubes' : 'ligas'} que coincidan con tu búsqueda.`
                  : entityType === 'clubs'
                  ? 'Todos los clubes ya están afiliados a una liga o no hay clubes registrados.'
                  : 'No hay ligas disponibles en este momento.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => fetchAvailableEntities(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => fetchAvailableEntities(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando página <span className="font-medium">{pagination.current_page}</span> de{' '}
                  <span className="font-medium">{pagination.last_page}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => fetchAvailableEntities(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => fetchAvailableEntities(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invitation Modal */}
      {isInviteModalOpen && selectedEntity && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {user.role === 'liga' 
                    ? `Enviar Invitación a ${selectedEntity.name}`
                    : `Solicitar Unirse a ${selectedEntity.name}`
                  }
                </h3>
                <button
                  onClick={closeInviteModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Entity Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      'city' in selectedEntity ? 'bg-blue-100' : 'bg-yellow-100'
                    }`}>
                      {React.createElement(getEntityIcon(selectedEntity), {
                        className: `h-5 w-5 ${'city' in selectedEntity ? 'text-blue-600' : 'text-yellow-600'}`
                      })}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedEntity.name}</h4>
                      <p className="text-sm text-gray-600">{getEntityLocation(selectedEntity)}</p>
                      {'address' in selectedEntity && selectedEntity.address && (
                        <p className="text-sm text-gray-500">{selectedEntity.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {user.role === 'liga' ? 'Mensaje de Invitación *' : 'Mensaje de Solicitud *'}
                  </label>
                  <textarea
                    value={invitationForm.message}
                    onChange={(e) => setInvitationForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder={user.role === 'liga' 
                      ? "Escribe un mensaje personalizado para la invitación..."
                      : "Escribe un mensaje explicando por qué quieres unirte a esta liga..."
                    }
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {user.role === 'liga' 
                      ? 'Este mensaje será visible para el club cuando reciba la invitación.'
                      : 'Este mensaje será visible para la liga cuando reciba tu solicitud.'
                    }
                  </p>
                </div>

                {/* Expiration Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Expiración (Opcional)
                  </label>
                  <input
                    type="datetime-local"
                    value={invitationForm.expires_at}
                    onChange={(e) => setInvitationForm(prev => ({ ...prev, expires_at: e.target.value }))}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Si no se especifica, la {user.role === 'liga' ? 'invitación' : 'solicitud'} no tendrá fecha de expiración.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={closeInviteModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSendInvitation}
                    disabled={sendingInvitation || !invitationForm.message.trim()}
                    className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sendingInvitation ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                        {user.role === 'liga' ? 'Enviar Invitación' : 'Enviar Solicitud'}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </LeagueLayout>
  );
}