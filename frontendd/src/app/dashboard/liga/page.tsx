'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  TrophyIcon,
  PlusIcon,
  BellIcon,
  PaperAirplaneIcon,
  CogIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import type { Club, Member, League } from '@/types';

interface LeagueStats {
  total_clubs: number;
  total_members: number;
  active_clubs: number;
  active_members: number;
  pending_invitations: number;
  sent_invitations: number;
  total_tournaments: number;
  active_tournaments: number;
  total_sports: number;
  growth_this_month: number;
  average_members_per_club: number;
}

interface Invitation {
  id: number;
  club_name: string;
  club_city: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  type: 'received' | 'sent';
}

interface Tournament {
  id: number;
  name: string;
  sport: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed';
  participants: number;
}

type TabType = 'dashboard' | 'clubs' | 'tournaments' | 'sports' | 'invitations' | 'stats';

export default function LigaDashboardPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState<LeagueStats | null>(null);
  const [recentClubs, setRecentClubs] = useState<Club[]>([]);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentLeague, setCurrentLeague] = useState<League | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Sports configuration
  const availableSports = [
    { id: 1, name: 'Tenis', code: 'tennis', icon: '🎾' },
    { id: 2, name: 'Tenis de Mesa', code: 'table_tennis', icon: '🏓' },
    { id: 3, name: 'Padel', code: 'padel', icon: '🎾' },
    { id: 4, name: 'Pickleball', code: 'pickleball', icon: '🏓' },
    { id: 5, name: 'Badminton', code: 'badminton', icon: '🏸' },
    { id: 6, name: 'Handball', code: 'handball', icon: '🤾' },
    { id: 7, name: 'Raquetball', code: 'racquetball', icon: '🎾' }
  ];

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
    { id: 'clubs', name: 'Clubes', icon: BuildingOfficeIcon },
    { id: 'tournaments', name: 'Torneos', icon: TrophyIcon },
    { id: 'sports', name: 'Deportes', icon: CogIcon },
    { id: 'invitations', name: 'Invitaciones', icon: BellIcon },
    { id: 'stats', name: 'Estadísticas', icon: ChartBarIcon }
  ];

  useEffect(() => {
    if (user && (user.role === 'liga' || user.role === 'super_admin')) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      
      if (!user) return;

      let clubs: Club[] = [];
      let members: Member[] = [];

      if (user.role === 'liga') {
        const leaguesResponse = await axios.get('/api/leagues');
        const allLeagues = leaguesResponse.data.data;
        const leaguesData = Array.isArray(allLeagues.data) ? allLeagues.data : allLeagues;
        const userLeague = leaguesData.find((league: League) => league.user_id === user.id);
        
        if (userLeague) {
          setCurrentLeague(userLeague);
          
          const clubsResponse = await axios.get(`/api/clubs?league_id=${userLeague.id}`);
          const allClubs = clubsResponse.data.data;
          clubs = Array.isArray(allClubs.data) ? allClubs.data : Array.isArray(allClubs) ? allClubs : [];
          
          if (clubs.length > 0) {
            const clubIds = clubs.map(club => club.id).join(',');
            const membersResponse = await axios.get(`/api/members?club_ids=${clubIds}`);
            const allMembers = membersResponse.data.data;
            members = Array.isArray(allMembers.data) ? allMembers.data : Array.isArray(allMembers) ? allMembers : [];
          }
        }
      }

      // Mock data for new features
      const mockInvitations: Invitation[] = [
        {
          id: 1,
          club_name: 'Club Deportivo Quito',
          club_city: 'Quito',
          status: 'pending',
          created_at: new Date().toISOString(),
          type: 'received'
        },
        {
          id: 2,
          club_name: 'Club Raqueta Elite',
          club_city: 'Guayaquil',
          status: 'pending',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          type: 'sent'
        }
      ];

      const mockTournaments: Tournament[] = [
        {
          id: 1,
          name: 'Torneo Regional de Tenis',
          sport: 'Tenis',
          start_date: '2024-02-15',
          end_date: '2024-02-18',
          status: 'upcoming',
          participants: 32
        },
        {
          id: 2,
          name: 'Copa Padel Liga',
          sport: 'Padel',
          start_date: '2024-01-20',
          end_date: '2024-01-22',
          status: 'active',
          participants: 16
        }
      ];

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newClubsThisMonth = clubs.filter(club => {
        const createdDate = new Date(club.created_at);
        return createdDate >= thisMonth;
      }).length;

      const leagueStats: LeagueStats = {
        total_clubs: clubs.length,
        total_members: members.length,
        active_clubs: clubs.filter(club => club.status === 'active').length,
        active_members: members.filter(member => member.status === 'active').length,
        pending_invitations: mockInvitations.filter(inv => inv.type === 'received' && inv.status === 'pending').length,
        sent_invitations: mockInvitations.filter(inv => inv.type === 'sent' && inv.status === 'pending').length,
        total_tournaments: mockTournaments.length,
        active_tournaments: mockTournaments.filter(t => t.status === 'active').length,
        total_sports: availableSports.length,
        growth_this_month: newClubsThisMonth,
        average_members_per_club: clubs.length > 0 ? Math.round(members.length / clubs.length) : 0,
      };

      setStats(leagueStats);
      setRecentClubs(clubs.slice(0, 4));
      setRecentMembers(members.slice(0, 4));
      setInvitations(mockInvitations);
      setTournaments(mockTournaments);

    } catch (error) {
      console.error('Error fetching liga dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInvitationAction = async (invitationId: number, action: 'accept' | 'reject') => {
    try {
      // Mock API call - replace with actual implementation
      console.log(`${action} invitation ${invitationId}`);
      
      setInvitations(prev => 
        prev.map(inv => 
          inv.id === invitationId 
            ? { ...inv, status: action === 'accept' ? 'accepted' : 'rejected' }
            : inv
        )
      );
    } catch (error) {
      console.error('Error handling invitation:', error);
    }
  };

  const sendInvitation = async (clubName: string, message: string) => {
    try {
      // Mock API call - replace with actual implementation
      console.log(`Sending invitation to ${clubName}: ${message}`);
      
      const newInvitation: Invitation = {
        id: Date.now(),
        club_name: clubName,
        club_city: 'Ciudad',
        status: 'pending',
        created_at: new Date().toISOString(),
        type: 'sent'
      };
      
      setInvitations(prev => [...prev, newInvitation]);
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (!user || (user.role !== 'liga' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-800">Acceso Denegado</h1>
          <p className="text-red-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <TrophyIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentLeague?.name || 'Panel de Liga'}
                </h1>
                <p className="text-sm text-gray-600">
                  Gestiona tu liga deportiva de manera eficiente
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              {currentLeague && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{currentLeague.province}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'dashboard' && (
          <DashboardContent 
            stats={stats} 
            recentClubs={recentClubs} 
            recentMembers={recentMembers}
            invitations={invitations}
            tournaments={tournaments}
            currentLeague={currentLeague}
          />
        )}
        
        {activeTab === 'clubs' && (
          <ClubsContent clubs={recentClubs} />
        )}
        
        {activeTab === 'tournaments' && (
          <TournamentsContent 
            tournaments={tournaments} 
            availableSports={availableSports}
            onCreateTournament={(tournament) => setTournaments(prev => [...prev, tournament])}
          />
        )}
        
        {activeTab === 'sports' && (
          <SportsContent availableSports={availableSports} />
        )}
        
        {activeTab === 'invitations' && (
          <InvitationsContent 
            invitations={invitations}
            onInvitationAction={handleInvitationAction}
            onSendInvitation={sendInvitation}
          />
        )}
        
        {activeTab === 'stats' && (
          <StatsContent stats={stats} />
        )}
      </div>
    </div>
  );
}

// Dashboard Content Component
function DashboardContent({ 
  stats, 
  recentClubs, 
  recentMembers, 
  invitations, 
  tournaments, 
  currentLeague 
}: {
  stats: LeagueStats | null;
  recentClubs: Club[];
  recentMembers: Member[];
  invitations: Invitation[];
  tournaments: Tournament[];
  currentLeague: League | null;
}) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">¡Bienvenido al Panel de Liga!</h2>
            <p className="text-yellow-100 text-lg">
              Gestiona tu liga deportiva de manera eficiente y profesional
            </p>
            {currentLeague && (
              <div className="flex items-center mt-4 space-x-6 text-yellow-200">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{currentLeague.province}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>Desde: {new Date(currentLeague.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  <span>Liga Activa</span>
                </div>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <TrophyIcon className="h-12 w-12 text-white mx-auto mb-2" />
              <p className="font-semibold">{currentLeague?.name}</p>
              <p className="text-yellow-200 text-sm">Liga Deportiva</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clubes Afiliados</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.total_clubs || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.active_clubs || 0} activos
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Miembros</p>
              <p className="text-3xl font-bold text-green-600">{stats?.total_members || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.active_members || 0} activos
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UsersIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Torneos Activos</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.active_tournaments || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.total_tournaments || 0} totales
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrophyIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Invitaciones</p>
              <p className="text-3xl font-bold text-orange-600">{stats?.pending_invitations || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.sent_invitations || 0} enviadas
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <BellIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invitations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Invitaciones Recientes</h3>
          </div>
          <div className="p-6">
            {invitations.length > 0 ? (
              <div className="space-y-4">
                {invitations.slice(0, 3).map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        invitation.type === 'received' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {invitation.type === 'received' ? (
                          <BellIcon className="h-5 w-5 text-blue-600" />
                        ) : (
                          <PaperAirplaneIcon className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invitation.club_name}</p>
                        <p className="text-sm text-gray-500">
                          {invitation.club_city} • {invitation.type === 'received' ? 'Solicita unirse' : 'Invitado'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      invitation.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : invitation.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {invitation.status === 'pending' ? 'Pendiente' : 
                       invitation.status === 'accepted' ? 'Aceptada' : 'Rechazada'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay invitaciones</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Las invitaciones aparecerán aquí cuando lleguen.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tournaments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Torneos Recientes</h3>
          </div>
          <div className="p-6">
            {tournaments.length > 0 ? (
              <div className="space-y-4">
                {tournaments.slice(0, 3).map((tournament) => (
                  <div key={tournament.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrophyIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tournament.name}</p>
                        <p className="text-sm text-gray-500">
                          {tournament.sport} • {tournament.participants} participantes
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      tournament.status === 'upcoming' 
                        ? 'bg-blue-100 text-blue-800' 
                        : tournament.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tournament.status === 'upcoming' ? 'Próximo' : 
                       tournament.status === 'active' ? 'Activo' : 'Completado'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay torneos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Los torneos aparecerán aquí cuando se creen.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Clubs Content Component
function ClubsContent({ clubs }: { clubs: Club[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Clubes</h2>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center space-x-2">
          <PlusIcon className="h-5 w-5" />
          <span>Invitar Club</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          {clubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => (
                <div key={club.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{club.name}</h3>
                      <p className="text-sm text-gray-500">{club.city}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Miembros:</span>
                      <span className="font-medium">{club.members_count || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        club.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {club.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No hay clubes afiliados</h3>
              <p className="mt-2 text-gray-500">
                Comienza invitando clubes a unirse a tu liga.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Tournaments Content Component
function TournamentsContent({ 
  tournaments, 
  availableSports, 
  onCreateTournament 
}: { 
  tournaments: Tournament[];
  availableSports: any[];
  onCreateTournament: (tournament: Tournament) => void;
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '',
    sport: '',
    start_date: '',
    end_date: '',
    participants: 16
  });

  const handleCreateTournament = () => {
    const tournament: Tournament = {
      id: Date.now(),
      name: newTournament.name,
      sport: newTournament.sport,
      start_date: newTournament.start_date,
      end_date: newTournament.end_date,
      status: 'upcoming',
      participants: newTournament.participants
    };
    
    onCreateTournament(tournament);
    setShowCreateForm(false);
    setNewTournament({
      name: '',
      sport: '',
      start_date: '',
      end_date: '',
      participants: 16
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Torneos</h2>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Crear Torneo</span>
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nuevo Torneo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Torneo
              </label>
              <input
                type="text"
                value={newTournament.name}
                onChange={(e) => setNewTournament(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Torneo Regional de Tenis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deporte
              </label>
              <select
                value={newTournament.sport}
                onChange={(e) => setNewTournament(prev => ({ ...prev, sport: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Seleccionar deporte</option>
                {availableSports.map((sport) => (
                  <option key={sport.id} value={sport.name}>
                    {sport.icon} {sport.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={newTournament.start_date}
                onChange={(e) => setNewTournament(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={newTournament.end_date}
                onChange={(e) => setNewTournament(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleCreateTournament}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Crear Torneo
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          {tournaments.length > 0 ? (
            <div className="space-y-4">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrophyIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tournament.name}</h3>
                        <p className="text-sm text-gray-500">
                          {tournament.sport} • {tournament.participants} participantes
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tournament.status === 'upcoming' 
                        ? 'bg-blue-100 text-blue-800' 
                        : tournament.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tournament.status === 'upcoming' ? 'Próximo' : 
                       tournament.status === 'active' ? 'Activo' : 'Completado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrophyIcon className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No hay torneos</h3>
              <p className="mt-2 text-gray-500">
                Crea tu primer torneo para comenzar las competencias.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sports Content Component
function SportsContent({ availableSports }: { availableSports: any[] }) {
  const [selectedSport, setSelectedSport] = useState<any>(null);
  const [sportParameters, setSportParameters] = useState<Record<string, any>>({});

  const defaultParameters = {
    tennis: {
      court_type: 'clay',
      set_format: 'best_of_3',
      tiebreak_format: '7_points',
      serve_clock: '25_seconds'
    },
    table_tennis: {
      ball_color: 'orange',
      table_height: '76cm',
      net_height: '15.25cm',
      game_format: 'best_of_5'
    },
    padel: {
      court_size: '20x10m',
      wall_height: '3m',
      ball_pressure: 'low',
      scoring: 'tennis_scoring'
    },
    pickleball: {
      court_size: '20x44ft',
      net_height: '36in',
      ball_type: 'plastic',
      serve_style: 'underhand'
    },
    badminton: {
      court_size: '17x44ft',
      net_height: '5ft',
      shuttlecock_type: 'feather',
      scoring: '21_points'
    },
    handball: {
      court_size: '40x20m',
      goal_size: '3x2m',
      ball_size: 'size_3',
      game_duration: '60_minutes'
    },
    racquetball: {
      court_type: 'enclosed',
      ball_type: 'blue',
      serve_style: 'power',
      game_format: 'best_of_3'
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Configuración de Deportes</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sports List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Deportes Disponibles</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {availableSports.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setSelectedSport(sport)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    selectedSport?.id === sport.id
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{sport.icon}</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{sport.name}</p>
                      <p className="text-sm text-gray-500">Código: {sport.code}</p>
                    </div>
                  </div>
                  <CogIcon className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sport Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedSport ? `Configurar ${selectedSport.name}` : 'Selecciona un Deporte'}
            </h3>
          </div>
          <div className="p-6">
            {selectedSport ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl">{selectedSport.icon}</span>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedSport.name}</h4>
                    <p className="text-sm text-gray-500">Configura los parámetros del deporte</p>
                  </div>
                </div>

                {/* Parameters */}
                {defaultParameters[selectedSport.code as keyof typeof defaultParameters] && (
                  <div className="space-y-4">
                    {Object.entries(defaultParameters[selectedSport.code as keyof typeof defaultParameters]).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <input
                          type="text"
                          defaultValue={value as string}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                    <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                      Guardar Configuración
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <CogIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Selecciona un Deporte</h3>
                <p className="mt-2 text-gray-500">
                  Elige un deporte de la lista para configurar sus parámetros.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Invitations Content Component
function InvitationsContent({ 
  invitations, 
  onInvitationAction, 
  onSendInvitation 
}: { 
  invitations: Invitation[];
  onInvitationAction: (id: number, action: 'accept' | 'reject') => void;
  onSendInvitation: (clubName: string, message: string) => void;
}) {
  const [showSendForm, setShowSendForm] = useState(false);
  const [newInvitation, setNewInvitation] = useState({
    clubName: '',
    message: ''
  });

  const handleSendInvitation = () => {
    onSendInvitation(newInvitation.clubName, newInvitation.message);
    setShowSendForm(false);
    setNewInvitation({ clubName: '', message: '' });
  };

  const receivedInvitations = invitations.filter(inv => inv.type === 'received');
  const sentInvitations = invitations.filter(inv => inv.type === 'sent');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Invitaciones</h2>
        <button 
          onClick={() => setShowSendForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
          <span>Enviar Invitación</span>
        </button>
      </div>

      {showSendForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enviar Invitación a Club</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Club
              </label>
              <input
                type="text"
                value={newInvitation.clubName}
                onChange={(e) => setNewInvitation(prev => ({ ...prev, clubName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Club Deportivo Central"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje de Invitación
              </label>
              <textarea
                value={newInvitation.message}
                onChange={(e) => setNewInvitation(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Escribe un mensaje personalizado para la invitación..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSendInvitation}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Enviar Invitación
              </button>
              <button
                onClick={() => setShowSendForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Received Invitations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Invitaciones Recibidas</h3>
          </div>
          <div className="p-6">
            {receivedInvitations.length > 0 ? (
              <div className="space-y-4">
                {receivedInvitations.map((invitation) => (
                  <div key={invitation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{invitation.club_name}</p>
                          <p className="text-sm text-gray-500">{invitation.club_city}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        invitation.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : invitation.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invitation.status === 'pending' ? 'Pendiente' : 
                         invitation.status === 'accepted' ? 'Aceptada' : 'Rechazada'}
                      </span>
                    </div>
                    {invitation.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onInvitationAction(invitation.id, 'accept')}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-1"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Aceptar</span>
                        </button>
                        <button
                          onClick={() => onInvitationAction(invitation.id, 'reject')}
                          className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-1"
                        >
                          <XCircleIcon className="h-4 w-4" />
                          <span>Rechazar</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay invitaciones recibidas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Las solicitudes de clubes aparecerán aquí.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sent Invitations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Invitaciones Enviadas</h3>
          </div>
          <div className="p-6">
            {sentInvitations.length > 0 ? (
              <div className="space-y-4">
                {sentInvitations.map((invitation) => (
                  <div key={invitation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <PaperAirplaneIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{invitation.club_name}</p>
                          <p className="text-sm text-gray-500">
                            Enviada el {new Date(invitation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        invitation.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : invitation.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invitation.status === 'pending' ? 'Pendiente' : 
                         invitation.status === 'accepted' ? 'Aceptada' : 'Rechazada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PaperAirplaneIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay invitaciones enviadas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Las invitaciones que envíes aparecerán aquí.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Content Component
function StatsContent({ stats }: { stats: LeagueStats | null }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Estadísticas de la Liga</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Clubes</p>
              <p className="text-3xl font-bold">{stats?.total_clubs || 0}</p>
              <p className="text-xs text-blue-200">{stats?.active_clubs || 0} activos</p>
            </div>
            <BuildingOfficeIcon className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Miembros</p>
              <p className="text-3xl font-bold">{stats?.total_members || 0}</p>
              <p className="text-xs text-green-200">{stats?.active_members || 0} activos</p>
            </div>
            <UsersIcon className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Torneos</p>
              <p className="text-3xl font-bold">{stats?.total_tournaments || 0}</p>
              <p className="text-xs text-purple-200">{stats?.active_tournaments || 0} activos</p>
            </div>
            <TrophyIcon className="h-12 w-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Deportes</p>
              <p className="text-3xl font-bold">{stats?.total_sports || 7}</p>
              <p className="text-xs text-orange-200">Configurados</p>
            </div>
            <CogIcon className="h-12 w-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Crecimiento</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nuevos clubes este mes</span>
              <span className="font-semibold text-green-600">+{stats?.growth_this_month || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Promedio miembros por club</span>
              <span className="font-semibold text-blue-600">{stats?.average_members_per_club || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Invitaciones pendientes</span>
              <span className="font-semibold text-orange-600">{stats?.pending_invitations || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Invitaciones enviadas</span>
              <span className="font-semibold text-purple-600">{stats?.sent_invitations || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de la Liga</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Clubes Activos</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold">{stats?.active_clubs || 0}/{stats?.total_clubs || 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Miembros Activos</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold">{stats?.active_members || 0}/{stats?.total_members || 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Torneos Activos</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-semibold">{stats?.active_tournaments || 0}/{stats?.total_tournaments || 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Deportes Configurados</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-semibold">{stats?.total_sports || 7}/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sports Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deportes Disponibles</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: 'Tenis', icon: '🎾', configured: true },
            { name: 'Tenis de Mesa', icon: '🏓', configured: true },
            { name: 'Padel', icon: '🎾', configured: true },
            { name: 'Pickleball', icon: '🏓', configured: false },
            { name: 'Badminton', icon: '🏸', configured: false },
            { name: 'Handball', icon: '🤾', configured: false },
            { name: 'Raquetball', icon: '🎾', configured: false }
          ].map((sport, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
              <div className="text-3xl mb-2">{sport.icon}</div>
              <p className="text-sm font-medium text-gray-900">{sport.name}</p>
              <div className={`mt-2 w-2 h-2 rounded-full mx-auto ${
                sport.configured ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
