'use client';

import { useAuth } from '@/contexts/AuthContext';
import ClubLayout from '@/components/clubs/ClubLayout';
import { useEffect, useState } from 'react';
import { 
  UsersIcon, 
  TrophyIcon, 
  ChartBarIcon, 
  PlusIcon,
  EyeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import type { Member, League, ApiResponse } from '@/types';
import Link from 'next/link';

interface ClubStats {
  total_members: number;
  active_members: number;
  male_members: number;
  female_members: number;
}

export default function ClubDashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<ClubStats | null>(null);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user && (user.role === 'club' || user.role === 'super_admin')) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      
      // Obtener miembros del club
      const membersResponse = await axios.get<ApiResponse<Member[]>>('/members');
      const members = membersResponse.data.data || [];

      // Obtener ligas
      const leaguesResponse = await axios.get<ApiResponse<League[]>>('/leagues');
      const allLeagues = leaguesResponse.data.data || [];

      // Calcular estadísticas
      const clubStats: ClubStats = {
        total_members: members.length,
        active_members: members.filter(member => member.status === 'active').length,
        male_members: members.filter(member => member.gender === 'male').length,
        female_members: members.filter(member => member.gender === 'female').length,
      };

      setStats(clubStats);
      setRecentMembers(members.slice(0, 6)); // Últimos 6 miembros
      setLeagues(allLeagues.slice(0, 3)); // Primeras 3 ligas

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <ClubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </ClubLayout>
    );
  }

  if (!user || (user.role !== 'club' && user.role !== 'super_admin')) {
    return (
      <ClubLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-800">Acceso Denegado</h1>
          <p className="text-red-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </ClubLayout>
    );
  }

  const roleInfo = user.role_info;
  const isSuperAdmin = user.role === 'super_admin';
  const clubName = user?.club_name || roleInfo?.name || 'Mi Club';

  return (
    <ClubLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Dashboard!</h1>
              <p className="text-green-100 text-lg">
                Gestiona tu club de manera eficiente desde aquí
              </p>
              <div className="flex items-center mt-4 space-x-6 text-green-200">
                {user?.city && (
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{user.city}</span>
                  </div>
                )}
                {user?.parent_league && (
                  <div className="flex items-center">
                    <TrophyIcon className="h-5 w-5 mr-2" />
                    <span>Liga: {user.parent_league.name}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <BuildingOfficeIcon className="h-12 w-12 text-white mx-auto mb-2" />
                <p className="font-semibold">{clubName}</p>
                <p className="text-green-200 text-sm">Club Deportivo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Miembros</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total_members || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Miembros Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.active_members || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hombres</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.male_members || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-pink-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mujeres</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.female_members || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/dashboard/club/members"
              className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <PlusIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Gestionar Miembros</p>
                <p className="text-sm text-gray-500">Agregar y administrar miembros</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/club/leagues"
              className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <TrophyIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Ver Ligas</p>
                <p className="text-sm text-gray-500">Ligas disponibles y afiliaciones</p>
              </div>
            </Link>

            <Link 
              href="/dashboard/club/stats"
              className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Estadísticas</p>
                <p className="text-sm text-gray-500">Reportes y análisis del club</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Miembros Recientes</h3>
                <Link 
                  href="/dashboard/club/members"
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
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
                          <p className="font-medium text-gray-900">{member.full_name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay miembros</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza registrando el primer miembro de tu club.
                  </p>
                  <div className="mt-6">
                    <Link 
                      href="/dashboard/club/members"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Registrar Miembro
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Leagues */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Ligas Disponibles</h3>
                <Link 
                  href="/dashboard/club/leagues"
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Ver todas
                </Link>
              </div>
            </div>
            <div className="p-6">
              {leagues.length > 0 ? (
                <div className="space-y-4">
                  {leagues.map((league) => (
                    <div key={league.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                          <TrophyIcon className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{league.name}</p>
                          <p className="text-sm text-gray-500">
                            {league.province && `${league.province}`}
                            {league.clubs_count && ` • ${league.clubs_count} clubes`}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        league.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {league.status === 'active' ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ligas disponibles</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Contacta con el administrador para unirte a una liga.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClubLayout>
  );
}