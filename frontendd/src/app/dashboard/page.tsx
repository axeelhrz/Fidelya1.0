'use client';

import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Bienvenido al Panel de Control de Raquet Power
        </h1>
        
        {user ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              ¡Hola, <span className="font-semibold text-gray-900">{user.name}</span>!
            </p>
            <p className="text-gray-600">
              Correo: <span className="font-semibold text-gray-900">{user.email}</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Ligas</h3>
                <p className="text-blue-700">Gestionar ligas deportivas</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Clubes</h3>
                <p className="text-green-700">Gestionar clubes deportivos</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Miembros</h3>
                <p className="text-purple-700">Gestionar miembros del club</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900">Deportes</h3>
                <p className="text-orange-700">Gestionar tipos de deportes</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Por favor inicia sesión para acceder al panel de control.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}