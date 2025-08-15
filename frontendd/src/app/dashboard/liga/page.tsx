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
  EyeIcon
} from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import type { Club, Member, ApiResponse } from '@/types';

interface LeagueStats {
  total_clubs: number;
  total_members: number;
  active_clubs: number;
  active_members: number;
}

export default function LigaDashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<LeagueStats | null>(null);
  const [recentClubs, setRecentClubs] = useState<Club[]>([]);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user && user.role === 'liga') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      
      // Obtener estadísticas de la liga
      const [clubsResponse, membersResponse] = await Promise.all([
        axios.get<ApiResponse<Club[]>>('/clubs'),
        axios.get<ApiResponse<Member[]>>('/members')
      ]);

      const clubs = clubsResponse.data.data || [];
      const members = membersResponse.data.data || [];

      // Calcular estadísticas
      const leagueStats: LeagueStats = {
        total_clubs: clubs.length,
        total_members: members.length,
        active_clubs: clubs.filter(club => club.status === 'active').length,
        active_members: members.filter(member => member.status === 'active').length,
      };

      setStats(leagueStats);
      setRecentClubs(clubs.slice(0, 5)); // Últimos 5 clubes
      setRecentMembers(members.slice(0, 5)); // Últimos 5 miembros

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'liga') {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-800">Acceso Denegado</h1>
          <p className="text-red-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </Layout>
    );
  }

  const roleInfo = user.role_info;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Panel de Liga</h1>
              <p className="text-blue-100 mt-2">
                {roleInfo?.name || user.league_name}
              </p>
              <p className="text-blue-200 text-sm">
                {roleInfo?.province || user.province} • Ecuador
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Administrador</p>
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-blue-200 text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Clubes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.total_clubs || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Clubes Activos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.active_clubs || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Miembros</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.total_members || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Miembros Activos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.active_members || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <PlusIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Aprobar Nuevo Club</p>
                <p className="text-sm text-gray-500">Revisar solicitudes pendientes</p>
              </div>
            </button>

            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ChartBarIcon className="h-6 w-6 text-green-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Ver Estadísticas</p>
                <p className="text-sm text-gray-500">Reportes y análisis</p>
              </div>
            </button>

            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CogIcon className="h-6 w-6 text-purple-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Configuración</p>
                <p className="text-sm text-gray-500">Ajustes de la liga</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Clubs */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Clubes Recientes</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Ver todos
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentClubs.length > 0 ? (
                <div className="space-y-4">
                  {recentClubs.map((club) => (
                    <div key={club.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{club.name}</p>
                        <p className="text-sm text-gray-500">{club.city}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          club.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {club.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay clubes registrados</p>
              )}
            </div>
          </div>

          {/* Recent Members */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Miembros Recientes</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Ver todos
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentMembers.length > 0 ? (
                <div className="space-y-4">
                  {recentMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{member.full_name}</p>
                        <p className="text-sm text-gray-500">{member.club?.name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          member.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay miembros registrados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}