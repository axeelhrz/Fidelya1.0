'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  BuildingOfficeIcon,
  UsersIcon,
  TrophyIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon,
  PaperAirplaneIcon,
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface LeagueLayoutProps {
  children: React.ReactNode;
}

export default function LeagueLayout({ children }: LeagueLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard/liga',
      icon: HomeIcon,
      current: pathname === '/dashboard/liga'
    },
    {
      name: 'Clubes',
      href: '/dashboard/liga/clubs',
      icon: BuildingOfficeIcon,
      current: pathname.startsWith('/dashboard/liga/clubs')
    },
    {
      name: 'Miembros',
      href: '/dashboard/liga/members',
      icon: UsersIcon,
      current: pathname.startsWith('/dashboard/liga/members')
    },
    {
      name: 'Torneos',
      href: '/dashboard/liga/tournaments',
      icon: TrophyIcon,
      current: pathname.startsWith('/dashboard/liga/tournaments')
    },
    {
      name: 'Deportes',
      href: '/dashboard/liga/sports',
      icon: CogIcon,
      current: pathname.startsWith('/dashboard/liga/sports')
    },
    {
      name: 'Invitaciones',
      href: '/dashboard/liga/invitations',
      icon: BellIcon,
      current: pathname.startsWith('/dashboard/liga/invitations')
    },
    {
      name: 'Enviar Invitaciones',
      href: '/dashboard/liga/send-invitations',
      icon: PaperAirplaneIcon,
      current: pathname.startsWith('/dashboard/liga/send-invitations')
    },
    {
      name: 'Estadísticas',
      href: '/dashboard/liga/stats',
      icon: ChartBarIcon,
      current: pathname.startsWith('/dashboard/liga/stats')
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user || (user.role !== 'liga' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Acceso Denegado</h2>
          <p className="text-gray-600 mt-2">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  // Mock league data - in real app this would come from API
  const currentLeague = {
    name: user?.name || 'Liga Deportiva',
    province: 'Pichincha',
    status: 'active',
    created_at: '2024-01-15',
    clubs_count: 12,
    members_count: 245
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        {/* League Info */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-yellow-600 to-yellow-700">
            <div className="flex items-center space-x-2">
              <TrophyIcon className="h-8 w-8 text-white" />
              <span className="text-white font-bold text-lg">Liga Panel</span>
            </div>
          </div>

          {/* League Card */}
          <div className="p-4 border-b border-gray-200">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-200 p-2 rounded-full">
                  <TrophyIcon className="h-5 w-5 text-yellow-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {currentLeague.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPinIcon className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{currentLeague.province}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{currentLeague.clubs_count}</div>
                  <div className="text-gray-600">Clubes</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{currentLeague.members_count}</div>
                  <div className="text-gray-600">Miembros</div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Liga Activa
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    item.current
                      ? 'bg-yellow-100 text-yellow-900 border-r-2 border-yellow-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                      item.current
                        ? 'text-yellow-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <TrophyIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Administrador de Liga
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel de Liga
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Gestiona tu liga deportiva de manera eficiente
                </p>
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
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}