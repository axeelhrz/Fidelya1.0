'use client';

import { WhatsAppTester } from '@/components/notifications/WhatsAppTester';

export default function TestWhatsAppPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Prueba de WhatsApp - Fidelya
          </h1>
          <p className="text-gray-600">
            Prueba el envío de notificaciones por WhatsApp usando Twilio
          </p>
        </div>
        
        <WhatsAppTester />
        
        <div className="mt-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📋 Instrucciones para Configurar el Sandbox
          </h2>
          
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">1</span>
              <div>
                <p className="font-medium">Conectar tu número al sandbox de Twilio:</p>
                <p>Envía un mensaje de WhatsApp desde tu teléfono al número:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">+1 415 523 8886</code>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">2</span>
              <div>
                <p className="font-medium">El mensaje debe ser exactamente:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">join orange-tiger</code>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">3</span>
              <div>
                <p className="font-medium">Recibirás una confirmación:</p>
                <p className="italic">"Joined orange-tiger. You can now send messages to this number."</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">4</span>
              <div>
                <p className="font-medium">Usa el probador arriba:</p>
                <p>Ingresa tu número (con código de país) y envía un mensaje de prueba.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-md">
            <h3 className="font-medium text-yellow-800 mb-2">⚠️ Importante:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• El sandbox es gratuito pero solo funciona con números registrados</li>
              <li>• Para producción necesitarás comprar un número de Twilio</li>
              <li>• Cada mensaje cuesta aproximadamente $0.005 USD</li>
              <li>• Tienes $15 USD de crédito gratuito para probar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}