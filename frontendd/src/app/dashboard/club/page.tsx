'use client';

import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import { 
  UsersIcon, 
  TrophyIcon, 
  ChartBarIcon, 
  CogIcon,
  PlusIcon,
  EyeIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import type { Member, ApiResponse } from '@/types';

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
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user && user.role === 'club') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      
      // Obtener miembros del club
      const membersResponse = await axios.get<ApiResponse<Member[]>>('/members');
      const members = membersResponse.data.data || [];

      // Calcular estadísticas
      const clubStats: ClubStats = {
        total_members: members.length,
        active_members: members.filter(member => member.status === 'active').length,
        male_members: members.filter(member => member.gender === 'male').length,
        female_members: members.filter(member => member.gender === 'female').length,
      };

      setStats(clubStats);
      setRecentMembers(members.slice(0, 8)); // Últimos 8 miembros

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

  if (!user || user.role !== 'club') {
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
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Panel de Club</h1>
              <p className="text-green-100 mt-2">
                {roleInfo?.name || user.club_name}
              </p>
              <div className="flex items-center mt-2 text-green-200 text-sm">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>{roleInfo?.city || user.city}</span>
                {roleInfo?.address || user.address && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{roleInfo?.address || user.address}</span>
                  </>
                )}
              </div>
              {user.parent_league && (
                <div className="flex items-center mt-1 text-green-200 text-sm">
                  <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                  <span>Liga: {user.parent_league.name}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">Administrador</p>
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-green-200 text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-600" />
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
                <UsersIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Miembros Activos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.active_members || 0}
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
                <p className="text-sm font-medium text-gray-500">Hombres</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.male_members || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mujeres</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.female_members || 0}
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
              <PlusIcon className="h-6 w-6 text-green-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Registrar Miembro</p>
                <p className="text-sm text-gray-500">Agregar nuevo miembro al club</p>
              </div>
            </button>

            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <TrophyIcon className="h-6 w-6 text-yellow-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Organizar Torneo</p>
                <p className="text-sm text-gray-500">Crear nueva competencia</p>
              </div>
            </button>

            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ChartBarIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Ver Estadísticas</p>
                <p className="text-sm text-gray-500">Reportes del club</p>
              </div>
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Miembros del Club</h3>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                Ver todos
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentMembers.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <UsersIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.full_name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
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
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {member.gender === 'male' ? 'Masculino' : 'Femenino'}
                      </span>
                      {member.rubber_type && (
                        <span>Caucho: {member.rubber_type}</span>
                      )}
                      {member.ranking && (
                        <span>Ranking: {member.ranking}</span>
                      )}
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
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Registrar Miembro
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}