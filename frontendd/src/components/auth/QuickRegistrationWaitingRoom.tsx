'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '@/lib/axios';

interface RegistrationData {
  id: number;
  registration_code: string;
  full_name: string;
  status: string;
  status_label: string;
  status_color: string;
  days_waiting: number;
  club_summary: string;
  location_summary: string;
  playing_side_label: string | null;
  playing_style_label: string | null;
  racket_summary: {
    brand: string | null;
    model: string | null;
  };
  drive_rubber_summary: {
    brand: string | null;
    model: string | null;
    type: string | null;
    color: string | null;
  };
  backhand_rubber_summary: {
    brand: string | null;
    model: string | null;
    type: string | null;
    color: string | null;
  };
  created_at: string;
  contacted_at: string | null;
  approved_at: string | null;
}

interface QuickRegistrationWaitingRoomProps {
  registrationCode?: string;
  initialData?: RegistrationData;
}

const QuickRegistrationWaitingRoom: React.FC<QuickRegistrationWaitingRoomProps> = ({ 
  registrationCode,
  initialData
}) => {
  const [email, setEmail] = useState('');
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSearch, setShowSearch] = useState(!initialData && !registrationCode);

  useEffect(() => {
    if (registrationCode && !initialData) {
      // Si tenemos un código de registro pero no datos iniciales, podríamos buscar por código
      // Por ahora, solo mostramos el formulario de búsqueda por email
      setShowSearch(true);
    }
  }, [registrationCode, initialData]);

  const handleSearchByEmail = async () => {
    if (!email.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/registro-rapido/waiting-room-status', {
        email: email.trim()
      });

      if (response.data.found) {
        setRegistrationData(response.data.data);
        setShowSearch(false);
      } else {
        setError('No se encontró ningún registro con este email');
      }
    } catch (error: any) {
      console.error('Error al buscar registro:', error);
      setError('Error al buscar el registro. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'contacted': return '#3B82F6';
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'contacted': return '📧';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '⏳';
    }
  };

  if (showSearch) {
    return (
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏓</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Sala de Espera
            </h1>
            
            <h2 className="text-lg text-gray-600 font-medium mb-4">
              Censo de Tenis de Mesa Ecuador
            </h2>

            <p className="text-gray-700 mb-6">
              Ingresa tu email para consultar el estado de tu registro en el censo
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email de registro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchByEmail()}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 font-medium placeholder-gray-500"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleSearchByEmail}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Buscando...
                </>
              ) : (
                <>
                  🔍 Consultar Estado
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!registrationData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏓</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            ¡Hola, {registrationData.full_name}!
          </h1>
          
          <h2 className="text-lg text-gray-600 font-medium mb-4">
            Censo de Tenis de Mesa Ecuador
          </h2>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2"
            style={{
              backgroundColor: `${getStatusColor(registrationData.status)}20`,
              color: getStatusColor(registrationData.status),
              borderColor: `${getStatusColor(registrationData.status)}40`,
            }}
          >
            <span className="text-lg">{getStatusIcon(registrationData.status)}</span>
            <span className="font-bold">{registrationData.status_label}</span>
          </div>
        </div>

        {/* Registration Info */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
            📋 Información de tu Registro
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Código de Registro</p>
              <p className="font-bold text-green-700 text-lg">{registrationData.registration_code}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Días en espera</p>
              <p className="font-bold text-gray-800">{registrationData.days_waiting} días</p>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            👤 Información Personal
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                📍 Ubicación
              </p>
              <p className="font-bold text-gray-800">{registrationData.location_summary}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                🏓 Club
              </p>
              <p className="font-bold text-gray-800">{registrationData.club_summary}</p>
            </div>
          </div>
        </div>

        {/* Playing Style */}
        {(registrationData.playing_side_label || registrationData.playing_style_label) && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              🏓 Estilo de Juego
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registrationData.playing_side_label && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Lado de Juego</p>
                  <p className="font-bold text-gray-800">{registrationData.playing_side_label}</p>
                </div>
              )}
              
              {registrationData.playing_style_label && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Tipo de Juego</p>
                  <p className="font-bold text-gray-800">{registrationData.playing_style_label}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Equipment */}
        {(registrationData.racket_summary.brand || registrationData.drive_rubber_summary.brand || registrationData.backhand_rubber_summary.brand) && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              🏓 Equipamiento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {registrationData.racket_summary.brand && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Raqueta</p>
                  <p className="font-bold text-gray-800">{registrationData.racket_summary.brand}</p>
                  {registrationData.racket_summary.model && (
                    <p className="text-sm text-gray-600">{registrationData.racket_summary.model}</p>
                  )}
                </div>
              )}
              
              {registrationData.drive_rubber_summary.brand && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Caucho Drive</p>
                  <p className="font-bold text-gray-800">{registrationData.drive_rubber_summary.brand}</p>
                  {registrationData.drive_rubber_summary.model && (
                    <p className="text-sm text-gray-600">{registrationData.drive_rubber_summary.model}</p>
                  )}
                  {registrationData.drive_rubber_summary.color && (
                    <p className="text-xs text-gray-500">Color: {registrationData.drive_rubber_summary.color}</p>
                  )}
                </div>
              )}
              
              {registrationData.backhand_rubber_summary.brand && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Caucho Back</p>
                  <p className="font-bold text-gray-800">{registrationData.backhand_rubber_summary.brand}</p>
                  {registrationData.backhand_rubber_summary.model && (
                    <p className="text-sm text-gray-600">{registrationData.backhand_rubber_summary.model}</p>
                  )}
                  {registrationData.backhand_rubber_summary.color && (
                    <p className="text-xs text-gray-500">Color: {registrationData.backhand_rubber_summary.color}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <hr className="my-6 border-gray-200" />

        {/* Status Message */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            ¿Qué sigue?
          </h3>
          
          {registrationData.status === 'pending' && (
            <p className="text-gray-600 mb-4">
              Tu registro está siendo revisado por nuestro equipo. Te contactaremos pronto 
              para confirmar tu participación en el censo de tenis de mesa de Ecuador.
            </p>
          )}
          
          {registrationData.status === 'contacted' && (
            <p className="text-gray-600 mb-4">
              ¡Genial! Ya hemos establecido contacto contigo. Estamos procesando tu información 
              para incluirte oficialmente en el censo.
            </p>
          )}
          
          {registrationData.status === 'approved' && (
            <p className="text-gray-600 mb-4">
              ¡Felicitaciones! Tu registro ha sido aprobado y ahora formas parte oficial 
              del censo de tenis de mesa de Ecuador.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setRegistrationData(null);
              setShowSearch(true);
              setEmail('');
              setError('');
            }}
            className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors duration-200 font-bold"
          >
            Consultar Otro Registro
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-bold"
          >
            Volver al Inicio
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickRegistrationWaitingRoom;