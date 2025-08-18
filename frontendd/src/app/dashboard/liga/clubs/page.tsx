'use client';

import { useAuth } from '@/contexts/AuthContext';
import LeagueLayout from '@/components/leagues/LeagueLayout';
import { useEffect, useState } from 'react';
import {
  BuildingOfficeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon,
  TrophyIcon,
  PaperAirplaneIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Club, League, Member } from '@/types';
import ClubModal from '@/components/clubs/ClubModal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import axios from '@/lib/axios';

interface ClubWithStats extends Club {
  members_count: number;
  active_members: number;
  tournaments_count?: number;
  last_activity?: string;
}

interface InvitationModalData {
  club_id: number;
  club_name: string;
  message: string;
}

function LigaClubsPage() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<ClubWithStats[]>([]);
  const [currentLeague, setCurrentLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<ClubWithStats | null>(null);
  const [invitationData, setInvitationData] = useState<InvitationModalData>({
    club_id: 0,
    club_name: '',
    message: ''
  });

  const fetchData = async () => {
    try {
      console.log('Liga Clubs - fetchData - User:', user);

      if (!user) return;

      if (user.role === 'liga') {
        // Find the league that belongs to this user
        const leaguesResponse = await axios.get('/api/leagues');
        const allLeagues = leaguesResponse.data.data;
        const leaguesData = Array.isArray(allLeagues.data) ? allLeagues.data : allLeagues;
        const userLeague = leaguesData.find((league: League) => league.user_id === user.id);
        
        if (userLeague) {
          setCurrentLeague(userLeague);
          
          // Fetch clubs for this league
          const clubsResponse = await axios.get(`/api/clubs?league_id=${userLeague.id}`);
          const allClubs = clubsResponse.data.data;
          const leagueClubs = Array.isArray(allClubs.data) ? allClubs.data : Array.isArray(allClubs) ? allClubs : [];
          
          // Fetch members for each club to get stats
          const clubsWithStats = await Promise.all(
            leagueClubs.map(async (club: Club) => {
              try {
                const membersResponse = await axios.get(`/api/members?club_id=${club.id}`);
                const clubMembers = membersResponse.data.data;
                const members = Array.isArray(clubMembers.data) ? clubMembers.data : Array.isArray(clubMembers) ? clubMembers : [];
                
                return {
                  ...club,
                  members_count: members.length,
                  active_members: members.filter((m: Member) => m.status === 'active').length,
                  tournaments_count: 0,
                  last_activity: new Date().toISOString()
                };
              } catch (error) {
                console.error(`Error fetching members for club ${club.id}:`, error);
                return {
                  ...club,
                  members_count: 0,
                  active_members: 0,
                  tournaments_count: 0,
                  last_activity: club.updated_at
                };
              }
            })
          );
          
          setClubs(clubsWithStats);
        }
      } else if (user.role === 'super_admin') {
        // Super admin can see all clubs
        const clubsResponse = await axios.get('/api/clubs');
        const allClubs = clubsResponse.data.data;
        const allClubsData = Array.isArray(allClubs.data) ? allClubs.data : allClubs;
        
        // Fetch members for each club to get stats
        const clubsWithStats = await Promise.all(
          allClubsData.map(async (club: Club) => {
            try {
              const membersResponse = await axios.get(`/api/members?club_id=${club.id}`);
              const clubMembers = membersResponse.data.data;
              const members = Array.isArray(clubMembers.data) ? clubMembers.data : Array.isArray(clubMembers) ? clubMembers : [];
              
              return {
                ...club,
                members_count: members.length,
                active_members: members.filter((m: Member) => m.status === 'active').length,
                tournaments_count: 0,
                last_activity: new Date().toISOString()
              };
            } catch (error) {
              return {
                ...club,
                members_count: 0,
                active_members: 0,
                tournaments_count: 0,
                last_activity: club.updated_at
              };
            }
          })
        );
        
        setClubs(clubsWithStats);
      }
    } catch (error) {
      console.error('Liga Clubs - Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = 
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && club.status === 'active') ||
      (statusFilter === 'inactive' && club.status === 'inactive');
    
    const matchesCity = cityFilter === 'all' || club.city === cityFilter;
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  // Get unique cities for filter
  const cities = Array.from(new Set(clubs.map(club => club.city).filter(Boolean)));

  const stats = {
    total: clubs.length,
    active: clubs.filter(c => c.status === 'active').length,
    inactive: clubs.filter(c => c.status === 'inactive').length,
    total_members: clubs.reduce((sum, club) => sum + club.members_count, 0),
    avg_members: clubs.length > 0 ? Math.round(clubs.reduce((sum, club) => sum + club.members_count, 0) / clubs.length) : 0,
  };

  const openCreateModal = () => {
    setSelectedClub(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (club: ClubWithStats) => {
    setSelectedClub(club);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (club: ClubWithStats) => {
    setSelectedClub(club);
    setIsDeleteModalOpen(true);
  };

  const openInviteModal = (club: ClubWithStats) => {
    setInvitationData({
      club_id: club.id,
      club_name: club.name,
      message: `¡Hola! Te invitamos a unirte a nuestra liga ${currentLeague?.name}. Creemos que sería una excelente oportunidad para tu club ${club.name}.`
    });
    setIsInviteModalOpen(true);
  };

  const handleCreateClub = async (clubData: any) => {
    try {
      const clubDataWithLeague = {
        ...clubData,
        league_id: currentLeague?.id
      };
      const response = await axios.post('/api/clubs', clubDataWithLeague);
      console.log('Club created successfully:', response.data);
      await fetchData();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating club:', error);
      throw error;
    }
  };

  const handleUpdateClub = async (clubData: any) => {
    try {
      if (!selectedClub) return;
      
      const response = await axios.put(`/api/clubs/${selectedClub.id}`, clubData);
      console.log('Club updated successfully:', response.data);
      await fetchData();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating club:', error);
      throw error;
    }
  };

  const handleDeleteClub = async () => {
    try {
      if (!selectedClub) return;
      
      await axios.delete(`/api/clubs/${selectedClub.id}`);
      await fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting club:', error);
    }
  };

  const handleSendInvitation = async () => {
    try {
      console.log('Sending invitation:', invitationData);
      setIsInviteModalOpen(false);
      alert('Invitación enviada exitosamente');
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  if (loading) {
    return (
      <LeagueLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
        </div>
      </LeagueLayout>
    );
  }

  if (!user || (user.role !== 'liga' && user.role !== 'super_admin')) {
    return (
      <LeagueLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Acceso Denegado</h2>
          <p className="text-gray-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </LeagueLayout>
    );
  }

  return (
    <LeagueLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {currentLeague ? `Clubes de ${currentLeague.name}` : 'Gestión de Clubes'}
              </h1>
              <p className="text-yellow-100 mt-2">
                {currentLeague ? `${currentLeague.province} • ${stats.total} clubes afiliados` : 'Administra los clubes del sistema'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors duration-200 flex items-center space-x-2 backdrop-blur-sm"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
                <span>Invitar Club</span>
              </button>
              <button
                onClick={openCreateModal}
                className="bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Nuevo Club</span>
              </button>
            </div>
          </div>
        </div>

        {/* League Info Banner */}
        {currentLeague && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <TrophyIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{currentLeague.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{currentLeague.province}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BuildingOfficeIcon className="h-4 w-4" />
                    <span>{stats.total} clubes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UsersIcon className="h-4 w-4" />
                    <span>{stats.total_members} miembros totales</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Desde: {new Date(currentLeague.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clubes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactivos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Miembros</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_members}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <StarIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avg_members}</p>
                <p className="text-xs text-gray-500">miembros/club</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, ciudad o dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
              
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="all">Todas las ciudades</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredClubs.length === 0 ? (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm || statusFilter !== 'all' || cityFilter !== 'all' 
                  ? 'No se encontraron clubes' 
                  : 'No hay clubes registrados'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || cityFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : 'Comienza agregando el primer club a tu liga.'}
              </p>
              {(!searchTerm && statusFilter === 'all' && cityFilter === 'all') && (
                <div className="mt-6 space-x-3">
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Agregar Club
                  </button>
                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5" />
                    Invitar Club
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredClubs.map((club) => (
                <div key={club.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{club.name}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            club.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {club.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {club.city && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {club.city}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        {club.members_count} miembros ({club.active_members} activos)
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Creado: {new Date(club.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(club)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100 transition-colors duration-150"
                          title="Editar club"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(club)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors duration-150"
                          title="Eliminar club"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => openInviteModal(club)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-yellow-700 bg-yellow-100 hover:bg-yellow-200 transition-colors duration-150"
                      >
                        <PaperAirplaneIcon className="h-3 w-3 mr-1" />
                        Invitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ClubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClub}
        leagues={currentLeague ? [currentLeague] : []}
        title="Crear Nuevo Club"
        submitText="Crear Club"
      />

      <ClubModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateClub}
        leagues={currentLeague ? [currentLeague] : []}
        club={selectedClub}
        title="Editar Club"
        submitText="Actualizar Club"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteClub}
        title="Eliminar Club"
        message={`¿Estás seguro de que deseas eliminar el club ${selectedClub?.name}? Esta acción no se puede deshacer y eliminará todos los miembros asociados.`}
      />

      {/* Invitation Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {invitationData.club_name ? `Invitar a ${invitationData.club_name}` : 'Enviar Invitación'}
                </h3>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {!invitationData.club_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Club
                    </label>
                    <input
                      type="text"
                      value={invitationData.club_name}
                      onChange={(e) => setInvitationData(prev => ({ ...prev, club_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Ej: Club Deportivo Central"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje de Invitación
                  </label>
                  <textarea
                    value={invitationData.message}
                    onChange={(e) => setInvitationData(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Escribe un mensaje personalizado para la invitación..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSendInvitation}
                  className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Enviar Invitación
                </button>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LeagueLayout>
  );
}

export default LigaClubsPage;