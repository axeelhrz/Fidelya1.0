'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export const WhatsAppTester = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('¡Hola! Este es un mensaje de prueba desde Fidelya 🚀');

  const handleDirectTest = async () => {
    if (!testPhone.trim()) {
      toast.error('Ingresa un número de teléfono');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🧪 Probando API directamente...');
      
      // Llamar directamente a la API de WhatsApp
      const response = await fetch('/api/notifications/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testPhone,
          message: `*Prueba Directa - Fidelya*\n\n${testMessage}\n\n_Enviado desde el probador 🧪_`
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`✅ WhatsApp enviado exitosamente! SID: ${result.sid}`);
        console.log('🎉 Resultado de la prueba directa:', result);
      } else {
        toast.error(`❌ Error: ${result.error}`);
        console.error('💥 Error en la prueba:', result);
      }

    } catch (error) {
      console.error('💥 Error en la prueba:', error);
      toast.error('Error en la prueba de WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceTest = async () => {
    try {
      console.log('🔧 Verificando estado de la API...');
      
      // Hacer una llamada de prueba sin número para verificar configuración
      const response = await fetch('/api/notifications/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '',
          message: 'test'
        })
      });

      const result = await response.json();
      
      if (result.debug) {
        console.log('🔍 Estado de credenciales:', result.debug);
        if (result.debug.accountSid === 'Present' && result.debug.authToken === 'Present') {
          toast.success('✅ Credenciales de Twilio configuradas correctamente');
        } else {
          toast.error('❌ Credenciales de Twilio faltantes');
        }
      } else {
        console.log('📊 Respuesta de la API:', result);
      }
      
    } catch (error) {
      console.error('💥 Error verificando servicio:', error);
      toast.error('Error verificando el servicio');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        🧪 Probador de WhatsApp (API Route)
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de teléfono (con código de país)
          </label>
          <input
            type="tel"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="+5491123456789"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Formato: +54 para Argentina, +1 para USA, etc.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje de prueba
          </label>
          <textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleDirectTest}
            disabled={loading}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '📤 Enviando...' : '📱 Enviar WhatsApp'}
          </button>
          
          <button
            onClick={handleServiceTest}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            🔧 Verificar API
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-md">
        <p className="text-xs text-green-800">
          <strong>✅ Configuración Actualizada:</strong><br/>
          • Ahora usa API Route (server-side)<br/>
          • Las credenciales se manejan en el servidor<br/>
          • Mejor seguridad y compatibilidad
        </p>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-md">
        <p className="text-xs text-yellow-800">
          <strong>📋 Instrucciones:</strong><br/>
          1. Envía "join orange-tiger" al +1 415 523 8886<br/>
          2. Ingresa tu número con código de país<br/>
          3. Haz clic en "Enviar WhatsApp"<br/>
          4. Revisa la consola para logs detallados
        </p>
      </div>
    </div>
  );
};