'use client';

import { useAuth } from '@/contexts/AuthContext';
import LeagueLayout from '@/components/leagues/LeagueLayout';
import { useEffect, useState } from 'react';
import {
  TrophyIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  UserGroupIcon,
  CogIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Tournament, League, Sport, Club, Member } from '@/types';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import axios from '@/lib/axios';

interface TournamentWithStats extends Tournament {
  participants_count: number;
  registered_participants: number;
  clubs_participating: number;
  matches_played?: number;
  matches_total?: number;
}

interface TournamentForm {
  name: string;
  description: string;
  sport_id: number;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  max_participants: number;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  entry_fee: number;
  prize_pool: number;
  location: string;
  rules: string;
}

function LigaTournamentsPage() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<TournamentWithStats[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [currentLeague, setCurrentLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<TournamentWithStats | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Available sports for tournaments
  const availableSports = [
    { id: 1, name: 'Tenis', code: 'tennis', icon: '🎾' },
    { id: 2, name: 'Tenis de Mesa', code: 'table_tennis', icon: '🏓' },
    { id: 3, name: 'Padel', code: 'padel', icon: '🎾' },
    { id: 4, name: 'Pickleball', code: 'pickleball', icon: '🏓' },
    { id: 5, name: 'Badminton', code: 'badminton', icon: '🏸' },
    { id: 6, name: 'Handball', code: 'handball', icon: '🤾' },
    { id: 7, name: 'Raquetball', code: 'racquetball', icon: '🎾' }
  ];

  const [tournamentForm, setTournamentForm] = useState<TournamentForm>({
    name: '',
    description: '',
    sport_id: 0,
    start_date: '',
    end_date: '',
    registration_deadline: '',
    max_participants: 32,
    format: 'single_elimination',
    entry_fee: 0,
    prize_pool: 0,
    location: '',
    rules: ''
  });

  const fetchData = async () => {
    try {
      console.log('Liga Tournaments - fetchData - User:', user);

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
          setClubs(leagueClubs);

          // Mock tournaments data (replace with real API when available)
          const mockTournaments: TournamentWithStats[] = [
            {
              id: 1,
              league_id: userLeague.id,
              name: 'Torneo Regional de Tenis',
              description: 'Torneo anual de tenis para todos los clubes afiliados',
              sport: 'Tenis',
              sport_id: 1,
              start_date: '2024-03-15',
              end_date: '2024-03-18',
              registration_deadline: '2024-03-10',
              max_participants: 32,
              participants: 24,
              participants_count: 24,
              registered_participants: 24,
              clubs_participating: 6,
              status: 'upcoming',
              format: 'single_elimination',
              entry_fee: 25,
              prize_pool: 500,
              location: 'Centro Deportivo Municipal',
              rules: 'Formato eliminación simple, mejor de 3 sets',
              matches_played: 0,
              matches_total: 31,
              created_at: '2024-01-15T10:00:00Z',
              updated_at: '2024-01-20T15:30:00Z'
            },
            {
              id: 2,
              league_id: userLeague.id,
              name: 'Copa Padel Liga',
              description: 'Competencia de padel entre clubes',
              sport: 'Padel',
              sport_id: 3,
              start_date: '2024-02-20',
              end_date: '2024-02-22',
              registration_deadline: '2024-02-15',
              max_participants: 16,
              participants: 16,
              participants_count: 16,
              registered_participants: 16,
              clubs_participating: 4,
              status: 'active',
              format: 'double_elimination',
              entry_fee: 30,
              prize_pool: 400,
              location: 'Club Central',
              rules: 'Formato doble eliminación, partidos a 3 sets',
              matches_played: 8,
              matches_total: 30,
              created_at: '2024-01-10T09:00:00Z',
              updated_at: '2024-02-20T12:00:00Z'
            },
            {
              id: 3,
              league_id: userLeague.id,
              name: 'Torneo de Tenis de Mesa',
              description: 'Campeonato provincial de tenis de mesa',
              sport: 'Tenis de Mesa',
              sport_id: 2,
              start_date: '2024-01-10',
              end_date: '2024-01-12',
              registration_deadline: '2024-01-05',
              max_participants: 24,
              participants: 20,
              participants_count: 20,
              registered_participants: 20,
              clubs_participating: 5,
              status: 'completed',
              format: 'round_robin',
              entry_fee: 20,
              prize_pool: 300,
              location: 'Polideportivo Norte',
              rules: 'Sistema round robin, mejor de 5 sets en finales',
              matches_played: 45,
              matches_total: 45,
              created_at: '2023-12-15T14:00:00Z',
              updated_at: '2024-01-12T18:00:00Z'
            }
          ];

          setTournaments(mockTournaments);
        }
      } else if (user.role === 'super_admin') {
        // Super admin can see all tournaments
        const mockTournaments: TournamentWithStats[] = [
          {
            id: 1,
            name: 'Torneo Nacional de Tenis',
            description: 'Torneo nacional de tenis',
            sport: 'Tenis',
            sport_id: 1,
            start_date: '2024-04-15',
            end_date: '2024-04-18',
            registration_deadline: '2024-04-10',
            max_participants: 64,
            participants: 48,
            participants_count: 48,
            registered_participants: 48,
            clubs_participating: 12,
            status: 'upcoming',
            format: 'single_elimination',
            entry_fee: 50,
            prize_pool: 2000,
            location: 'Centro Nacional de Tenis',
            rules: 'Formato eliminación simple, mejor de 5 sets en finales',
            matches_played: 0,
            matches_total: 63,
            created_at: '2024-01-01T10:00:00Z',
            updated_at: '2024-01-25T16:00:00Z'
          }
        ];
        
        setTournaments(mockTournaments);
      }

      // Fetch sports
      try {
        const sportsResponse = await axios.get('/api/sports');
        const allSports = sportsResponse.data.data;
        const sportsData = Array.isArray(allSports.data) ? allSports.data : Array.isArray(allSports) ? allSports : [];
        setSports(sportsData);
      } catch (error) {
        console.error('Error fetching sports:', error);
        setSports([]);
      }

    } catch (error) {
      console.error('Liga Tournaments - Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = 
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter;
    const matchesSport = sportFilter === 'all' || tournament.sport === sportFilter;
    
    return matchesSearch && matchesStatus && matchesSport;
  });

  // Get unique sports for filter
  const sportsInTournaments = Array.from(new Set(tournaments.map(t => t.sport)));

  const stats = {
    total: tournaments.length,
    upcoming: tournaments.filter(t => t.status === 'upcoming').length,
    active: tournaments.filter(t => t.status === 'active').length,
    completed: tournaments.filter(t => t.status === 'completed').length,
    total_participants: tournaments.reduce((sum, t) => sum + t.participants_count, 0),
    total_prize_pool: tournaments.reduce((sum, t) => sum + (t.prize_pool || 0), 0),
  };

  const openCreateModal = () => {
    setTournamentForm({
      name: '',
      description: '',
      sport_id: 0,
      start_date: '',
      end_date: '',
      registration_deadline: '',
      max_participants: 32,
      format: 'single_elimination',
      entry_fee: 0,
      prize_pool: 0,
      location: '',
      rules: ''
    });
    setSelectedTournament(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (tournament: TournamentWithStats) => {
    setTournamentForm({
      name: tournament.name,
      description: tournament.description || '',
      sport_id: tournament.sport_id || 0,
      start_date: tournament.start_date,
      end_date: tournament.end_date,
      registration_deadline: tournament.registration_deadline || '',
      max_participants: tournament.max_participants || 32,
      format: tournament.format || 'single_elimination',
      entry_fee: tournament.entry_fee || 0,
      prize_pool: tournament.prize_pool || 0,
      location: tournament.location || '',
      rules: tournament.rules || ''
    });
    setSelectedTournament(tournament);
    setIsEditModalOpen(true);
  };

  const openViewModal = (tournament: TournamentWithStats) => {
    setSelectedTournament(tournament);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (tournament: TournamentWithStats) => {
    setSelectedTournament(tournament);
    setIsDeleteModalOpen(true);
  };

  const handleCreateTournament = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      console.log('Creating tournament:', tournamentForm);
      
      // Mock API call - replace with actual implementation
      const newTournament: TournamentWithStats = {
        id: Date.now(),
        league_id: currentLeague?.id,
        name: tournamentForm.name,
        description: tournamentForm.description,
        sport: availableSports.find(s => s.id === tournamentForm.sport_id)?.name || 'Deporte',
        sport_id: tournamentForm.sport_id,
        start_date: tournamentForm.start_date,
        end_date: tournamentForm.end_date,
        registration_deadline: tournamentForm.registration_deadline,
        max_participants: tournamentForm.max_participants,
        participants: 0,
        participants_count: 0,
        registered_participants: 0,
        clubs_participating: 0,
        status: 'upcoming',
        format: tournamentForm.format,
        entry_fee: tournamentForm.entry_fee,
        prize_pool: tournamentForm.prize_pool,
        location: tournamentForm.location,
        rules: tournamentForm.rules,
        matches_played: 0,
        matches_total: tournamentForm.max_participants - 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setTournaments(prev => [...prev, newTournament]);
      setIsCreateModalOpen(false);
      alert('Torneo creado exitosamente');
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Error al crear el torneo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateTournament = async () => {
    if (!selectedTournament || isProcessing) return;
    
    try {
      setIsProcessing(true);
      console.log('Updating tournament:', tournamentForm);
      
      // Mock API call - replace with actual implementation
      const updatedTournament: TournamentWithStats = {
        ...selectedTournament,
        name: tournamentForm.name,
        description: tournamentForm.description,
        sport: availableSports.find(s => s.id === tournamentForm.sport_id)?.name || selectedTournament.sport,
        sport_id: tournamentForm.sport_id,
        start_date: tournamentForm.start_date,
        end_date: tournamentForm.end_date,
        registration_deadline: tournamentForm.registration_deadline,
        max_participants: tournamentForm.max_participants,
        format: tournamentForm.format,
        entry_fee: tournamentForm.entry_fee,
        prize_pool: tournamentForm.prize_pool,
        location: tournamentForm.location,
        rules: tournamentForm.rules,
        updated_at: new Date().toISOString()
      };
      
      setTournaments(prev => prev.map(t => t.id === selectedTournament.id ? updatedTournament : t));
      setIsEditModalOpen(false);
      alert('Torneo actualizado exitosamente');
    } catch (error) {
      console.error('Error updating tournament:', error);
      alert('Error al actualizar el torneo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTournament = async () => {
    if (!selectedTournament || isProcessing) return;
    
    try {
      setIsProcessing(true);
      console.log('Deleting tournament:', selectedTournament.id);
      
      // Mock API call - replace with actual implementation
      setTournaments(prev => prev.filter(t => t.id !== selectedTournament.id));
      setIsDeleteModalOpen(false);
      alert('Torneo eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Error al eliminar el torneo');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <ClockIcon className="h-4 w-4" />;
      case 'active':
        return <PlayIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Próximo';
      case 'active':
        return 'Activo';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
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
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {currentLeague ? `Torneos de ${currentLeague.name}` : 'Gestión de Torneos'}
              </h1>
              <p className="text-purple-100 mt-2">
                {currentLeague ? `${currentLeague.province} • ${stats.total} torneos organizados` : 'Administra los torneos del sistema'}
              </p>
            </div>
            <button
              onClick={openCreateModal}
              disabled={isProcessing}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{isProcessing ? 'Procesando...' : 'Nuevo Torneo'}</span>
            </button>
          </div>
        </div>

        {/* League Info Banner */}
        {currentLeague && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <TrophyIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{currentLeague.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{currentLeague.province}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrophyIcon className="h-4 w-4" />
                    <span>{stats.total} torneos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UsersIcon className="h-4 w-4" />
                    <span>{stats.total_participants} participantes totales</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4" />
                    <span>${stats.total_prize_pool} en premios</span>
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
              <div className="bg-purple-100 p-3 rounded-full">
                <TrophyIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Torneos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Próximos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <PlayIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <UserGroupIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Participantes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_participants}</p>
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
                  placeholder="Buscar por nombre, deporte o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="upcoming">Próximos</option>
                  <option value="active">Activos</option>
                  <option value="completed">Completados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>
              
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todos los deportes</option>
                {sportsInTournaments.map((sport) => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tournaments Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredTournaments.length === 0 ? (
            <div className="text-center py-12">
              <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm || statusFilter !== 'all' || sportFilter !== 'all' 
                  ? 'No se encontraron torneos' 
                  : 'No hay torneos organizados'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || sportFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : 'Comienza creando tu primer torneo.'}
              </p>
              {(!searchTerm && statusFilter === 'all' && sportFilter === 'all') && (
                <div className="mt-6">
                  <button
                    onClick={openCreateModal}
                    disabled={isProcessing}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    {isProcessing ? 'Procesando...' : 'Crear Torneo'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredTournaments.map((tournament) => (
                <div key={tournament.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <TrophyIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{tournament.name}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                            {getStatusIcon(tournament.status)}
                            <span className="ml-1">{getStatusText(tournament.status)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CogIcon className="h-4 w-4 mr-2" />
                        {tournament.sport}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        {tournament.participants_count}/{tournament.max_participants} participantes
                      </div>

                      {tournament.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {tournament.location}
                        </div>
                      )}

                      {tournament.prize_pool && tournament.prize_pool > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <StarIcon className="h-4 w-4 mr-2" />
                          ${tournament.prize_pool} en premios
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewModal(tournament)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-100 transition-colors duration-150"
                          title="Ver detalles"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(tournament)}
                          disabled={isProcessing}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Editar torneo"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(tournament)}
                          disabled={isProcessing}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar torneo"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {tournament.clubs_participating} clubes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Tournament Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Crear Nuevo Torneo
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isProcessing}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Torneo *
                  </label>
                  <input
                    type="text"
                    value={tournamentForm.name}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Torneo Regional de Tenis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deporte *
                  </label>
                  <select
                    value={tournamentForm.sport_id}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, sport_id: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={0}>Seleccionar deporte</option>
                    {availableSports.map((sport) => (
                      <option key={sport.id} value={sport.id}>
                        {sport.icon} {sport.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={tournamentForm.description}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Descripción del torneo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={tournamentForm.start_date}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin *
                  </label>
                  <input
                    type="date"
                    value={tournamentForm.end_date}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Límite de Inscripción
                  </label>
                  <input
                    type="date"
                    value={tournamentForm.registration_deadline}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, registration_deadline: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Participantes
                  </label>
                  <input
                    type="number"
                    value={tournamentForm.max_participants}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, max_participants: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="4"
                    max="128"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato del Torneo
                  </label>
                  <select
                    value={tournamentForm.format}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, format: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="single_elimination">Eliminación Simple</option>
                    <option value="double_elimination">Doble Eliminación</option>
                    <option value="round_robin">Round Robin</option>
                    <option value="swiss">Sistema Suizo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuota de Inscripción ($)
                  </label>
                  <input
                    type="number"
                    value={tournamentForm.entry_fee}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, entry_fee: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bolsa de Premios ($)
                  </label>
                  <input
                    type="number"
                    value={tournamentForm.prize_pool}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, prize_pool: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={tournamentForm.location}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Centro Deportivo Municipal"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reglas del Torneo
                  </label>
                  <textarea
                    value={tournamentForm.rules}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, rules: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Reglas específicas del torneo..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCreateTournament}
                  disabled={isProcessing || !tournamentForm.name || !tournamentForm.sport_id || !tournamentForm.start_date || !tournamentForm.end_date}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Creando...' : 'Crear Torneo'}
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tournament Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Editar Torneo
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isProcessing}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Torneo *
                  </label>
                  <input
                    type="text"
                    value={tournamentForm.name}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Torneo Regional de Tenis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deporte *
                  </label>
                  <select
                    value={tournamentForm.sport_id}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, sport_id: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={0}>Seleccionar deporte</option>
                    {availableSports.map((sport) => (
                      <option key={sport.id} value={sport.id}>
                        {sport.icon} {sport.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={tournamentForm.description}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Descripción del torneo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={tournamentForm.start_date}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin *
                  </label>
                  <input
                    type="date"
                    value={tournamentForm.end_date}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Límite de Inscripción
                  </label>
                  <input
                    type="date"
                    value={tournamentForm.registration_deadline}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, registration_deadline: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Participantes
                  </label>
                  <input
                    type="number"
                    value={tournamentForm.max_participants}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, max_participants: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="4"
                    max="128"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato del Torneo
                  </label>
                  <select
                    value={tournamentForm.format}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, format: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="single_elimination">Eliminación Simple</option>
                    <option value="double_elimination">Doble Eliminación</option>
                    <option value="round_robin">Round Robin</option>
                    <option value="swiss">Sistema Suizo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuota de Inscripción ($)
                  </label>
                  <input
                    type="number"
                    value={tournamentForm.entry_fee}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, entry_fee: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bolsa de Premios ($)
                  </label>
                  <input
                    type="number"
                    value={tournamentForm.prize_pool}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, prize_pool: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={tournamentForm.location}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Centro Deportivo Municipal"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reglas del Torneo
                  </label>
                  <textarea
                    value={tournamentForm.rules}
                    onChange={(e) => setTournamentForm(prev => ({ ...prev, rules: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Reglas específicas del torneo..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleUpdateTournament}
                  disabled={isProcessing || !tournamentForm.name || !tournamentForm.sport_id || !tournamentForm.start_date || !tournamentForm.end_date}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Actualizando...' : 'Actualizar Torneo'}
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Tournament Modal */}
      {isViewModalOpen && selectedTournament && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedTournament.name}
                </h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tournament Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Información General</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <CogIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{selectedTournament.sport}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTournament.status)}`}>
                          {getStatusIcon(selectedTournament.status)}
                          <span className="ml-1">{getStatusText(selectedTournament.status)}</span>
                        </span>
                      </div>
                      {selectedTournament.description && (
                        <p className="text-sm text-gray-600">{selectedTournament.description}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Fechas</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(selectedTournament.start_date).toLocaleDateString()} - {new Date(selectedTournament.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedTournament.registration_deadline && (
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            Inscripciones hasta: {new Date(selectedTournament.registration_deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedTournament.location && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Ubicación</h4>
                      <div className="mt-2">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{selectedTournament.location}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tournament Stats */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Participación</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Participantes:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedTournament.participants_count}/{selectedTournament.max_participants}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Clubes participando:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedTournament.clubs_participating}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(selectedTournament.participants_count / (selectedTournament.max_participants || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Formato</h4>
                    <div className="mt-2">
                      <span className="text-sm text-gray-900">
                        {selectedTournament.format === 'single_elimination' && 'Eliminación Simple'}
                        {selectedTournament.format === 'double_elimination' && 'Doble Eliminación'}
                        {selectedTournament.format === 'round_robin' && 'Round Robin'}
                        {selectedTournament.format === 'swiss' && 'Sistema Suizo'}
                      </span>
                    </div>
                  </div>

                  {(selectedTournament.entry_fee || selectedTournament.prize_pool) && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Económico</h4>
                      <div className="mt-2 space-y-2">
                        {selectedTournament.entry_fee && selectedTournament.entry_fee > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Cuota de inscripción:</span>
                            <span className="text-sm font-medium text-gray-900">${selectedTournament.entry_fee}</span>
                          </div>
                        )}
                        {selectedTournament.prize_pool && selectedTournament.prize_pool > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Bolsa de premios:</span>
                            <span className="text-sm font-medium text-green-600">${selectedTournament.prize_pool}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedTournament.status === 'active' && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Progreso</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Partidos jugados:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedTournament.matches_played}/{selectedTournament.matches_total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${((selectedTournament.matches_played || 0) / (selectedTournament.matches_total || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedTournament.rules && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Reglas del Torneo</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTournament.rules}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTournament}
        title="Eliminar Torneo"
        message={`¿Estás seguro de que deseas eliminar el torneo "${selectedTournament?.name}"? Esta acción no se puede deshacer y se perderán todos los datos asociados.`}
      />
    </LeagueLayout>
  );
}

export default LigaTournamentsPage;
