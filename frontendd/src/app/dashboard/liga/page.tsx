'use client';

import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  ChartBarIcon, 
  CogIcon,
  PlusIcon,
  EyeIcon,
  ShieldCheckIcon,
  TrophyIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
  FireIcon,
  UserGroupIcon,
  CalendarIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import type { Club, Member, League } from '@/types';
import Link from 'next/link';

interface LeagueStats {
  total_clubs: number;
  total_members: number;
  active_clubs: number;
  active_members: number;
  pending_requests: number;
  total_provinces: number;
  growth_this_month: number;
  average_members_per_club: number;
}

export default function LigaDashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<LeagueStats | null>(null);
  const [recentClubs, setRecentClubs] = useState<Club[]>([]);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
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
      console.log('Liga Dashboard - User role:', user?.role);
      console.log('Liga Dashboard - User ID:', user?.id);

      if (!user) return;

      let clubs: Club[] = [];
      let members: Member[] = [];

      if (user.role === 'liga') {
        // Find the league that belongs to this user
        const leaguesResponse = await axios.get('/api/leagues');
        console.log('Liga Dashboard - Leagues response:', leaguesResponse.data);
        
        const allLeagues = leaguesResponse.data.data;
        const leaguesData = Array.isArray(allLeagues.data) ? allLeagues.data : allLeagues;
        const userLeague = leaguesData.find((league: League) => league.user_id === user.id);
        console.log('Liga Dashboard - User league found:', userLeague);
        
        if (userLeague) {
          setCurrentLeague(userLeague);
          
          // Get clubs affiliated to this league
          const clubsResponse = await axios.get(`/api/clubs?league_id=${userLeague.id}`);
          console.log('Liga Dashboard - Clubs response:', clubsResponse.data);
          
          const allClubs = clubsResponse.data.data;
          clubs = Array.isArray(allClubs.data) ? allClubs.data : Array.isArray(allClubs) ? allClubs : [];
          
          // Get members from clubs in this league
          if (clubs.length > 0) {
            const clubIds = clubs.map(club => club.id).join(',');
            const membersResponse = await axios.get(`/api/members?club_ids=${clubIds}`);
            console.log('Liga Dashboard - Members response:', membersResponse.data);
            
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

      console.log('Liga Dashboard - Final clubs:', clubs);
      console.log('Liga Dashboard - Final members:', members);

      // Calculate statistics
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const newClubsThisMonth = clubs.filter(club => {
        const createdDate = new Date(club.created_at);
        return createdDate >= thisMonth;
      }).length;

      const provinces = [...new Set(clubs.map(club => club.city).filter(Boolean))];

      const leagueStats: LeagueStats = {
        total_clubs: clubs.length,
        total_members: members.length,
        active_clubs: clubs.filter(club => club.status === 'active').length,
        active_members: members.filter(member => member.status === 'active').length,
        pending_requests: clubs.filter(club => club.status === 'pending').length,
        total_provinces: provinces.length,
        growth_this_month: newClubsThisMonth,
        average_members_per_club: clubs.length > 0 ? Math.round(members.length / clubs.length) : 0,
      };

      setStats(leagueStats);
      setRecentClubs(clubs.slice(0, 6)); // Last 6 clubs
      setRecentMembers(members.slice(0, 6)); // Last 6 members

    } catch (error) {
      console.error('Error fetching liga dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user || (user.role !== 'liga' && user.role !== 'super_admin')) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-800">Acceso Denegado</h1>
          <p className="text-red-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </Layout>
    );
  }

  const isSuperAdmin = user.role === 'super_admin';
  const leagueName = currentLeague?.name || user?.name || 'Liga Deportiva';

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className={`bg-gradient-to-r ${isSuperAdmin ? 'from-red-600 to-red-800' : 'from-yellow-600 to-yellow-800'} rounded-xl shadow-lg p-8 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <TrophyIcon className="h-10 w-10 text-white" />
                <div>
                  <h1 className="text-3xl font-bold">Panel de Liga</h1>
                  <p className={`${isSuperAdmin ? 'text-red-100' : 'text-yellow-100'} text-lg mt-1`}>
                    {isSuperAdmin ? 'Vista de Super Administrador' : leagueName}
                  </p>
                </div>
                {isSuperAdmin && (
                  <ShieldCheckIcon className="h-8 w-8 text-white" />
                )}
              </div>
              {currentLeague && (
                <div className="flex items-center mt-4 space-x-6 text-yellow-200">
                  {currentLeague.province && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      <span>{currentLeague.province}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>Desde: {new Date(currentLeague.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <span>Estado: {currentLeague.status === 'active' ? 'Activa' : 'Inactiva'}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <TrophyIcon className="h-12 w-12 text-white mx-auto mb-2" />
                <p className="font-semibold">{leagueName}</p>
                <p className={`${isSuperAdmin ? 'text-red-200' : 'text-yellow-200'} text-sm`}>
                  {isSuperAdmin ? 'Super Admin' : 'Liga Deportiva'}
                </p>
              </div>
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
                    <span>{stats?.total_clubs || 0} clubes afiliados</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UsersIcon className="h-4 w-4" />
                    <span>{stats?.total_members || 0} miembros totales</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentLeague.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {currentLeague.status === 'active' ? 'Liga Activa' : 'Liga Inactiva'}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clubes</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_clubs || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clubes Activos</p>
                <p className="text-3xl font-bold text-green-600">{stats?.active_clubs || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.total_clubs ? Math.round((stats.active_clubs / stats.total_clubs) * 100) : 0}% del total
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Miembros</p>
                <p className="text-3xl font-bold text-purple-600">{stats?.total_members || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Promedio: {stats?.average_members_per_club || 0} por club
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <UsersIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crecimiento Mensual</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.growth_this_month || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Nuevos clubes este mes</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <StarIcon className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link 
              href="/clubs"
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
              href="/members"
              className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Ver Miembros</p>
                <p className="text-sm text-gray-500">Miembros de todos los clubes</p>
              </div>
            </Link>

            <button className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Generar Reportes</p>
                <p className="text-sm text-gray-500">Estadísticas y análisis</p>
              </div>
            </button>

            <button className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <BellIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Solicitudes</p>
                <p className="text-sm text-gray-500">Revisar afiliaciones</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Clubs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Clubes Recientes</h3>
                <Link 
                  href="/clubs"
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
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clubes registrados</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Los clubes aparecerán aquí cuando se afilien a la liga.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Miembros Recientes</h3>
                <Link 
                  href="/members"
                  className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                >
                  Ver todos
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentMembers.length > 0 ? (
                <div className="space-y-4">
                  {recentMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <UsersIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{member.club?.name || 'Sin club'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          member.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay miembros registrados</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Los miembros aparecerán aquí cuando los clubes los registren.
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
                <p className="text-blue-100">Tasa de Actividad</p>
                <p className="text-2xl font-bold">
                  {stats?.total_clubs ? Math.round((stats.active_clubs / stats.total_clubs) * 100) : 0}%
                </p>
                <p className="text-xs text-blue-200">Clubes activos</p>
              </div>
              <FireIcon className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Cobertura Territorial</p>
                <p className="text-2xl font-bold">{stats?.total_provinces || 0}</p>
                <p className="text-xs text-green-200">Provincias/ciudades</p>
              </div>
              <GlobeAltIcon className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Promedio por Club</p>
                <p className="text-2xl font-bold">{stats?.average_members_per_club || 0}</p>
                <p className="text-xs text-purple-200">Miembros por club</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}