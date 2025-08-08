'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { simpleNotificationService } from '@/services/simple-notifications.service';
import { useAuth } from '@/hooks/useAuth';

export const WhatsAppTester = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('¡Hola! Este es un mensaje de prueba desde Fidelya 🚀');

  const handleTest = async () => {
    if (!user) {
      toast.error('Debes estar autenticado');
      return;
    }

    if (!testPhone.trim()) {
      toast.error('Ingresa un número de teléfono');
      return;
    }

    setLoading(true);
    
    try {
      // Crear una notificación de prueba
      const notificationData = {
        title: 'Prueba WhatsApp - Fidelya',
        message: testMessage,
        type: 'info' as const,
        channels: ['whatsapp' as const],
        recipientIds: ['test-recipient'] // ID ficticio para la prueba
      };

      // Crear la notificación
      const notificationId = await simpleNotificationService.createNotification(
        notificationData,
        user.uid
      );

      // Simular un destinatario con el número de prueba
      const originalGetRecipients = simpleNotificationService.getRecipients;
      simpleNotificationService.getRecipients = async () => [
        {
          id: 'test-recipient',
          name: 'Usuario de Prueba',
          phone: testPhone,
          type: 'socio' as const
        }
      ];

      // Enviar la notificación
      const result = await simpleNotificationService.sendNotification(
        notificationId,
        notificationData
      );

      // Restaurar el método original
      simpleNotificationService.getRecipients = originalGetRecipients;

      if (result.success) {
        toast.success(`✅ WhatsApp enviado exitosamente!`);
        console.log('🎉 Resultado de la prueba:', result);
      } else {
        toast.error(`❌ Error enviando WhatsApp: ${result.errors.join(', ')}`);
        console.error('💥 Errores:', result.errors);
      }

    } catch (error) {
      console.error('💥 Error en la prueba:', error);
      toast.error('Error en la prueba de WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceStatus = () => {
    const status = simpleNotificationService.getServicesStatus();
    console.log('🔧 Estado de servicios:', status);
    
    if (status.whatsapp.configured) {
      toast.success('✅ Twilio WhatsApp está configurado correctamente');
    } else {
      toast.error('❌ Twilio WhatsApp NO está configurado');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        🧪 Probador de WhatsApp
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
            onClick={handleTest}
            disabled={loading}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '📤 Enviando...' : '📱 Enviar WhatsApp'}
          </button>
          
          <button
            onClick={handleServiceStatus}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            🔧 Estado
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-md">
        <p className="text-xs text-yellow-800">
          <strong>📋 Instrucciones:</strong><br/>
          1. Ingresa tu número con código de país<br/>
          2. Para el sandbox de Twilio, primero envía "join orange-tiger" al +1 415 523 8886<br/>
          3. Luego haz clic en "Enviar WhatsApp"
        </p>
      </div>
    </div>
  );
};