'use client';

import React from 'react';
import { useFreeNotifications } from '@/hooks/useFreeNotifications';
import { useAuth } from '@/hooks/useAuth';

export const NotificationTest: React.FC = () => {
  const { 
    success, 
    error, 
    warning, 
    info, 
    urgent,
    sendExternalNotification,
    requestPermissions,
    runDiagnostic,
    status,
    isHealthy,
    hasPermissions,
    loading
  } = useFreeNotifications();
  
  const { user } = useAuth();

  const handleTestToast = () => {
    success('¡Prueba exitosa!', 'Las notificaciones toast están funcionando correctamente');
  };

  const handleTestError = () => {
    error('Error de prueba', 'Esta es una notificación de error para probar el sistema');
  };

  const handleTestWarning = () => {
    warning('Advertencia de prueba', 'Esta es una notificación de advertencia');
  };

  const handleTestInfo = () => {
    info('Información de prueba', 'Esta es una notificación informativa');
  };

  const handleTestUrgent = () => {
    urgent('¡Urgente!', 'Esta es una notificación urgente que no se agrupa en lotes');
  };

  const handleTestExternal = async () => {
    if (!user) {
      warning('Usuario requerido', 'Debes estar logueado para probar notificaciones externas');
      return;
    }

    try {
      await sendExternalNotification(
        user.uid,
        'Notificación Externa',
        'Esta es una prueba de notificación externa (email + push + browser)',
        'info',
        'medium',
        {
          actionUrl: '/dashboard',
          actionLabel: 'Ver Dashboard'
        }
      );
      success('Enviado', 'Notificación externa enviada correctamente');
    } catch (err) {
      error('Error', 'No se pudo enviar la notificación externa');
    }
  };

  const handleRequestPermissions = async () => {
    try {
      const permissions = await requestPermissions();
      if (permissions.browser || permissions.push) {
        success('Permisos otorgados', 'Notificaciones activadas correctamente');
      } else {
        warning('Permisos denegados', 'No se pudieron obtener permisos de notificación');
      }
    } catch (err) {
      error('Error', 'Error al solicitar permisos');
    }
  };

  const handleRunDiagnostic = async () => {
    try {
      const diagnostic = await runDiagnostic();
      if (diagnostic) {
        const statusMessage = `Estado: ${diagnostic.status}`;
        const issuesMessage = diagnostic.issues.length > 0 
          ? `\nProblemas: ${diagnostic.issues.join(', ')}`
          : '\nTodo funcionando correctamente';
        
        if (diagnostic.status === 'healthy') {
          success('Diagnóstico', statusMessage + issuesMessage);
        } else if (diagnostic.status === 'warning') {
          warning('Diagnóstico', statusMessage + issuesMessage);
        } else {
          error('Diagnóstico', statusMessage + issuesMessage);
        }
      }
    } catch (err) {
      error('Error', 'No se pudo ejecutar el diagnóstico');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🔔 Prueba de Notificaciones
      </h2>

      {/* Estado del sistema */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Estado del Sistema</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Inicializado:</span>
            <span className={`ml-2 ${status.initialized ? 'text-green-600' : 'text-red-600'}`}>
              {status.initialized ? '✅ Sí' : '❌ No'}
            </span>
          </div>
          <div>
            <span className="font-medium">Saludable:</span>
            <span className={`ml-2 ${isHealthy ? 'text-green-600' : 'text-yellow-600'}`}>
              {isHealthy ? '✅ Sí' : '⚠️ Con problemas'}
            </span>
          </div>
          <div>
            <span className="font-medium">Permisos:</span>
            <span className={`ml-2 ${hasPermissions ? 'text-green-600' : 'text-red-600'}`}>
              {hasPermissions ? '✅ Otorgados' : '❌ Denegados'}
            </span>
          </div>
          <div>
            <span className="font-medium">Usuario:</span>
            <span className={`ml-2 ${user ? 'text-green-600' : 'text-gray-600'}`}>
              {user ? `✅ ${user.nombre}` : '👤 No logueado'}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <span className="font-medium">Servicios disponibles:</span>
          <div className="flex gap-4 mt-1">
            <span className={`text-xs px-2 py-1 rounded ${status.serviceAvailability.email ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Email: {status.serviceAvailability.email ? 'OK' : 'NO'}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${status.serviceAvailability.push ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Push: {status.serviceAvailability.push ? 'OK' : 'NO'}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${status.serviceAvailability.browser ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Browser: {status.serviceAvailability.browser ? 'OK' : 'NO'}
            </span>
          </div>
        </div>
      </div>

      {/* Botones de prueba */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pruebas de Notificaciones</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleTestToast}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            ✅ Éxito
          </button>
          
          <button
            onClick={handleTestError}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            ❌ Error
          </button>
          
          <button
            onClick={handleTestWarning}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            ⚠️ Advertencia
          </button>
          
          <button
            onClick={handleTestInfo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ℹ️ Información
          </button>
        </div>

        <button
          onClick={handleTestUrgent}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          🚨 Urgente (Sin lote)
        </button>

        <button
          onClick={handleTestExternal}
          disabled={!user || loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📤 Notificación Externa {!user && '(Requiere login)'}
        </button>
      </div>

      {/* Configuración */}
      <div className="mt-6 space-y-3">
        <h3 className="text-lg font-semibold">Configuración</h3>
        
        <button
          onClick={handleRequestPermissions}
          disabled={loading}
          className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          🔐 Solicitar Permisos
        </button>
        
        <button
          onClick={handleRunDiagnostic}
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          🔍 Ejecutar Diagnóstico
        </button>
      </div>

      {/* Instrucciones */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">📋 Instrucciones</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Primero solicita permisos si no los tienes</li>
          <li>2. Prueba las notificaciones toast (siempre funcionan)</li>
          <li>3. Si estás logueado, prueba notificaciones externas</li>
          <li>4. Ejecuta diagnóstico para ver problemas</li>
          <li>5. Revisa la consola del navegador para logs detallados</li>
        </ol>
      </div>
    </div>
  );
};