'use client';

import { useAuth } from '@/contexts/AuthContext';
import LeagueLayout from '@/components/leagues/LeagueLayout';
import { useEffect, useState } from 'react';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  TrophyIcon,
  PlusIcon,
  EyeIcon,
  StarIcon,
  FireIcon,
  UserGroupIcon,
  GlobeAltIcon,
  BellIcon,
  PaperAirplaneIcon,
  CogIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import type { Club, Member, League } from '@/types';
import Link from 'next/link';

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

export default function LigaDashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<LeagueStats | null>(null);
  const [recentClubs, setRecentClubs] = useState<Club[]>([]);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [recentInvitations, setRecentInvitations] = useState<Invitation[]>([]);
  const [currentLeague, setCurrentLeague] = useState<League | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user && (user.role === 'liga' || user.role === 'super_admin')) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      console.log('Liga Dashboard - User:', user);

      if (!user) return;

      let clubs: Club[] = [];
      let members: Member[] = [];

      if (user.role === 'liga') {
        // Find the league that belongs to this user
        const leaguesResponse = await axios.get('/api/leagues');
        const allLeagues = leaguesResponse.data.data;
        const leaguesData = Array.isArray(allLeagues.data) ? allLeagues.data : allLeagues;
        const userLeague = leaguesData.find((league: League) => league.user_id === user.id);
        
        if (userLeague) {
          setCurrentLeague(userLeague);
          
          // Get clubs affiliated to this league
          const clubsResponse = await axios.get(`/api/clubs?league_id=${userLeague.id}`);
          const allClubs = clubsResponse.data.data;
          clubs = Array.isArray(allClubs.data) ? allClubs.data : Array.isArray(allClubs) ? allClubs : [];
          
          // Get members from clubs in this league
          if (clubs.length > 0) {
            const clubIds = clubs.map(club => club.id).join(',');
            const membersResponse = await axios.get(`/api/members?club_ids=${clubIds}`);
            const allMembers = membersResponse.data.data;
            members = Array.isArray(allMembers.data) ? allMembers.data : Array.isArray(allMembers) ? allMembers : [];
          }
        }
      } else if (user.role === 'super_admin') {
        // Super admin can see all data
        const [clubsResponse, membersResponse] = await Promise.all([
          axios.get('/api/clubs'),
          axios.get('/api/members')
        ]);
        
        const allClubs = clubsResponse.data.data;
        clubs = Array.isArray(allClubs.data) ? allClubs.data : allClubs;
        
        const allMembers = membersResponse.data.data;
        members = Array.isArray(allMembers.data) ? allMembers.data : allMembers;
      }

      // Calculate statistics
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const newClubsThisMonth = clubs.filter(club => {
        const createdDate = new Date(club.created_at);
        return createdDate >= thisMonth;
      }).length;

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

      const leagueStats: LeagueStats = {
        total_clubs: clubs.length,
        total_members: members.length,
        active_clubs: clubs.filter(club => club.status === 'active').length,
        active_members: members.filter(member => member.status === 'active').length,
        pending_invitations: mockInvitations.filter(inv => inv.type === 'received' && inv.status === 'pending').length,
        sent_invitations: mockInvitations.filter(inv => inv.type === 'sent' && inv.status === 'pending').length,
        total_tournaments: 3, // Mock data
        active_tournaments: 2, // Mock data
        total_sports: 7, // Tenis, Tenis de Mesa, Padel, Pickleball, Badminton, Handball, Raquetball
        growth_this_month: newClubsThisMonth,
        average_members_per_club: clubs.length > 0 ? Math.round(members.length / clubs.length) : 0,
      };

      setStats(leagueStats);
      setRecentClubs(clubs.slice(0, 4));
      setRecentMembers(members.slice(0, 4));
      setRecentInvitations(mockInvitations);

    } catch (error) {
      console.error('Error fetching liga dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <LeagueLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
        </div>
      </LeagueLayout>
    );
  }

  if (!user || (user.role !== 'liga' && user.role !== 'super_admin')) {
    return (
      <LeagueLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-800">Acceso Denegado</h1>
          <p className="text-red-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </LeagueLayout>
    );
  }

  return (
    <LeagueLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Panel de Liga!</h1>
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
                <p className="font-semibold">{currentLeague?.name || user?.name}</p>
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

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href="/dashboard/liga/clubs"
              className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Gestionar Clubes</p>
                <p className="text-sm text-gray-500">Ver y administrar clubes</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/liga/tournaments"
              className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <TrophyIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Crear Torneo</p>
                <p className="text-sm text-gray-500">Organizar competencias</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/liga/sports"
              className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <CogIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Configurar Deportes</p>
                <p className="text-sm text-gray-500">Parámetros y reglas</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/liga/send-invitations"
              className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <PaperAirplaneIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Invitar Clubes</p>
                <p className="text-sm text-gray-500">Enviar invitaciones</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invitations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Invitaciones Recientes</h3>
                <Link 
                  href="/dashboard/liga/invitations"
                  className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                >
                  Ver todas
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentInvitations.length > 0 ? (
                <div className="space-y-4">
                  {recentInvitations.map((invitation) => (
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
                      <div className="flex items-center space-x-2">
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
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                      </div>
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

          {/* Recent Clubs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Clubes Recientes</h3>
                <Link 
                  href="/dashboard/liga/clubs"
                  className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                >
                  Ver todos
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentClubs.length > 0 ? (
                <div className="space-y-4">
                  {recentClubs.map((club) => (
                    <div key={club.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{club.name}</p>
                          <p className="text-sm text-gray-500">{club.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          club.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {club.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clubes afiliados</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Los clubes aparecerán aquí cuando se afilien.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Deportes Configurados</p>
                <p className="text-2xl font-bold">{stats?.total_sports || 7}</p>
                <p className="text-xs text-blue-200">Tenis, Padel, Pickleball...</p>
              </div>
              <CogIcon className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Promedio por Club</p>
                <p className="text-2xl font-bold">{stats?.average_members_per_club || 0}</p>
                <p className="text-xs text-green-200">Miembros por club</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Crecimiento Mensual</p>
                <p className="text-2xl font-bold">{stats?.growth_this_month || 0}</p>
                <p className="text-xs text-purple-200">Nuevos clubes</p>
              </div>
              <StarIcon className="h-8 w-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>
    </LeagueLayout>
  );
}